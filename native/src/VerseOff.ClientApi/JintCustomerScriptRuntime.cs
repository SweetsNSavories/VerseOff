using System.Globalization;
using System.Text;
using System.Text.Json;
using Jint;
using Jint.Native;

namespace VerseOff.ClientApi;

public sealed record CustomerScriptRuntimeOptions(
    TimeSpan Timeout,
    long MaximumMemoryBytes,
    int MaximumStatements,
    int MaximumRecursionDepth,
    int MaximumSourceBytes)
{
    public static CustomerScriptRuntimeOptions Default { get; } = new(
        TimeSpan.FromSeconds(2),
        8L * 1024 * 1024,
        50_000,
        64,
        1024 * 1024);

    public void Validate()
    {
        if (Timeout <= TimeSpan.Zero
            || MaximumMemoryBytes <= 0
            || MaximumStatements <= 0
            || MaximumRecursionDepth <= 0
            || MaximumSourceBytes <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(Timeout),
                "All customer-script runtime limits must be positive.");
        }
    }
}

public sealed class JintCustomerScriptRuntime : ICustomerScriptRuntime
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    private readonly CustomerScriptRuntimeOptions runtimeOptions;
    private readonly IXrmWebApiService webApiService;
    private readonly IXrmNavigationService navigationService;

    public JintCustomerScriptRuntime(
        CustomerScriptRuntimeOptions? runtimeOptions = null,
        IXrmWebApiService? webApiService = null,
        IXrmNavigationService? navigationService = null)
    {
        this.runtimeOptions =
            runtimeOptions ?? CustomerScriptRuntimeOptions.Default;
        this.runtimeOptions.Validate();
        this.webApiService =
            webApiService ?? new UnavailableXrmWebApiService();
        this.navigationService =
            navigationService ?? new UnavailableXrmNavigationService();
    }

    public async ValueTask<object?> InvokeAsync(
        CustomerScript script,
        string functionName,
        XrmExecutionContext executionContext,
        IReadOnlyList<object?> arguments,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(script);
        ArgumentException.ThrowIfNullOrWhiteSpace(functionName);
        ArgumentNullException.ThrowIfNull(executionContext);
        ArgumentNullException.ThrowIfNull(arguments);

        var scan = CustomerScriptScanner.Scan(
            script,
            runtimeOptions.MaximumSourceBytes);
        if (!scan.IsAllowed)
        {
            throw new CustomerScriptRejectedException(
                string.Join(
                    " ",
                    scan.Findings.Select(finding => finding.Message)));
        }

        if (!CustomerScriptScanner.IsValidFunctionName(functionName))
        {
            throw new CustomerScriptRejectedException(
                $"Script function name '{functionName}' is invalid.");
        }

        if (executionContext.GetFormContext() is not XrmFormContext formContext)
        {
            throw new CustomerScriptRejectedException(
                "The Jint runtime requires a native XrmFormContext.");
        }

        var state = ScriptState.Create(executionContext, formContext);
        var normalizedArguments = arguments
            .Select(ScriptValue.Normalize)
            .ToArray();
        var engine = CreateEngine(cancellationToken);
        engine.SetValue(
            "__verseoffWebApiHost",
            new Func<string, string, Task<string>>(
                (operation, argumentsJson) => InvokeHostAsync(
                    webApiService.ExecuteAsync,
                    operation,
                    argumentsJson,
                    cancellationToken)));
        engine.SetValue(
            "__verseoffNavigationHost",
            new Func<string, string, Task<string>>(
                (operation, argumentsJson) => InvokeHostAsync(
                    navigationService.ExecuteAsync,
                    operation,
                    argumentsJson,
                    cancellationToken)));
        engine.SetValue(
            "__verseoffOfflineTableCheck",
            new Func<string, bool>(
                webApiService.IsAvailableOffline));
        engine.SetValue(
            "__verseoffStateJson",
            JsonSerializer.Serialize(state, JsonOptions));
        engine.SetValue(
            "__verseoffArgsJson",
            JsonSerializer.Serialize(normalizedArguments, JsonOptions));
        engine.Execute(ClientApiBootstrap);
        engine.Execute(script.Source, script.ScriptId);
        engine.SetValue("__verseoffFunctionName", functionName);
        engine.Execute(InvocationBootstrap);

        var result = await engine.InvokeAsync(
            "__verseoffInvoke",
            cancellationToken);
        var stateJson = engine
            .Invoke("__verseoffExportState")
            .AsString();
        var updatedState = JsonSerializer.Deserialize<ScriptState>(
            stateJson,
            JsonOptions)
            ?? throw new CustomerScriptRejectedException(
                "Customer script returned an invalid form state.");
        updatedState.Apply(executionContext, formContext);
        return result.IsNull() || result.IsUndefined()
            ? null
            : ScriptValue.Normalize(result.ToObject());
    }

    private Engine CreateEngine(CancellationToken cancellationToken) =>
        new(options =>
        {
            options.Strict();
            options.LimitMemory(runtimeOptions.MaximumMemoryBytes);
            options.TimeoutInterval(runtimeOptions.Timeout);
            options.MaxStatements(runtimeOptions.MaximumStatements);
            options.CancellationToken(cancellationToken);
            options.Constraints.MaxRecursionDepth =
                runtimeOptions.MaximumRecursionDepth;
            options.Constraints.RegexTimeout = runtimeOptions.Timeout;
            options.Constraints.PromiseTimeout = runtimeOptions.Timeout;
            options.Interop.Enabled = false;
            options.Host.StringCompilationAllowed = false;
            options.AgentCanSuspend = false;
            options.Culture = CultureInfo.InvariantCulture;
            options.TimeZone = TimeZoneInfo.Utc;
            options.ExperimentalFeatures = ExperimentalFeature.TaskInterop;
        });

    private static async Task<string> InvokeHostAsync(
        Func<XrmHostRequest, CancellationToken, ValueTask<JsonElement>>
            handler,
        string operation,
        string argumentsJson,
        CancellationToken cancellationToken)
    {
        const int maximumRequestBytes = 256 * 1024;
        ArgumentException.ThrowIfNullOrWhiteSpace(operation);
        if (operation.Length > 128
            || Encoding.UTF8.GetByteCount(argumentsJson)
                > maximumRequestBytes)
        {
            throw new ClientApiOperationUnavailableException(
                operation,
                "The serialized request exceeds the host boundary limit.");
        }

        using var document = JsonDocument.Parse(
            argumentsJson,
            new JsonDocumentOptions
            {
                CommentHandling = JsonCommentHandling.Disallow,
                MaxDepth = 32,
            });
        if (document.RootElement.ValueKind is not JsonValueKind.Object)
        {
            throw new ClientApiOperationUnavailableException(
                operation,
                "Host arguments must be a JSON object.");
        }

        var result = await handler(
            new(operation, document.RootElement.Clone()),
            cancellationToken);
        var response = result.GetRawText();
        if (Encoding.UTF8.GetByteCount(response) > maximumRequestBytes)
        {
            throw new ClientApiOperationUnavailableException(
                operation,
                "The serialized host response exceeds the boundary limit.");
        }

        return response;
    }

    private const string InvocationBootstrap =
        """
        const __verseoffSegments = __verseoffFunctionName.split(".");
        let __verseoffHandler = globalThis;
        for (const __verseoffSegment of __verseoffSegments) {
            __verseoffHandler = __verseoffHandler[__verseoffSegment];
            if (__verseoffHandler === null ||
                __verseoffHandler === undefined) {
                break;
            }
        }
        if (typeof __verseoffHandler !== "function") {
            throw new Error(
                "Customer handler was not found: " +
                __verseoffFunctionName);
        }
        function __verseoffInvoke() {
            return __verseoffHandler(
                executionContext,
                ...__verseoffArgs);
        }
        """;

    private const string ClientApiBootstrap =
        """
        const __verseoffState = JSON.parse(__verseoffStateJson);
        const __verseoffArgs = JSON.parse(__verseoffArgsJson);
        const __verseoffStringify = JSON.stringify.bind(JSON);
        __verseoffStateJson = undefined;
        __verseoffArgsJson = undefined;

        function __verseoffUnsupported(name) {
            return Promise.reject(
                new Error(name + " is unavailable in the offline runtime."));
        }

        async function __verseoffHostCall(host, operation, args) {
            const response = await host(
                operation,
                __verseoffStringify(args || {}));
            return JSON.parse(response);
        }

        function __verseoffCollection(map, factory) {
            const names = Object.keys(map);
            return Object.freeze({
                get: function(key) {
                    if (typeof key === "number") {
                        return key >= 0 && key < names.length
                            ? factory(names[key])
                            : null;
                    }
                    return Object.prototype.hasOwnProperty.call(map, key)
                        ? factory(key)
                        : null;
                },
                getLength: function() { return names.length; },
                forEach: function(callback) {
                    names.forEach(function(name, index) {
                        callback(factory(name), index);
                    });
                }
            });
        }

        function __verseoffArrayCollection(values, factory) {
            return Object.freeze({
                get: function(key) {
                    if (typeof key === "number") {
                        return key >= 0 && key < values.length
                            ? factory(values[key], key)
                            : null;
                    }
                    if (typeof key === "function") {
                        return values
                            .map(factory)
                            .filter(key);
                    }
                    return values
                        .map(factory)
                        .find(function(value) {
                            return value.getName &&
                                value.getName() === key;
                        }) || null;
                },
                getLength: function() { return values.length; },
                forEach: function(callback) {
                    values.forEach(function(value, index) {
                        callback(factory(value, index), index);
                    });
                }
            });
        }

        const __verseoffAttributeCache = Object.create(null);
        function __verseoffAttribute(name) {
            const state = __verseoffState.attributes[name];
            if (!state) {
                return null;
            }
            if (__verseoffAttributeCache[name]) {
                return __verseoffAttributeCache[name];
            }
            const handlers = [];
            const attribute = Object.freeze({
                addOnChange: function(handler) {
                    if (typeof handler !== "function") {
                        throw new TypeError("OnChange handler must be a function.");
                    }
                    handlers.push(handler);
                },
                fireOnChange: function() {
                    handlers.slice().forEach(function(handler) {
                        handler(executionContext);
                    });
                },
                getAttributeType: function() { return state.attributeType; },
                getFormat: function() { return state.format; },
                getInitialValue: function() { return state.initialValue; },
                getIsDirty: function() { return state.isDirty; },
                getMaxLength: function() { return state.maximumLength; },
                getMax: function() { return state.maximum; },
                getMin: function() { return state.minimum; },
                getName: function() { return state.name; },
                getOption: function(value) {
                    return state.options.find(function(option) {
                        return option.value === value ||
                            option.text === value;
                    }) || null;
                },
                getOptions: function() {
                    return state.options.map(function(option) {
                        return Object.freeze({
                            text: option.text,
                            value: option.value
                        });
                    });
                },
                getParent: function() { return formContext; },
                getPrecision: function() { return state.precision; },
                getRequiredLevel: function() { return state.requiredLevel; },
                getSelectedOption: function() {
                    if (Array.isArray(state.value)) {
                        return state.options.filter(function(option) {
                            return state.value.includes(option.value);
                        });
                    }
                    return state.options.find(function(option) {
                        return option.value === state.value;
                    }) || null;
                },
                getSubmitMode: function() { return state.submitMode; },
                getText: function() {
                    const selected = attribute.getSelectedOption();
                    if (Array.isArray(selected)) {
                        return selected.map(function(option) {
                            return option.text;
                        }).join("; ");
                    }
                    return selected ? selected.text : null;
                },
                getUserPrivilege: function() {
                    return Object.freeze({
                        canRead: true,
                        canUpdate: true,
                        canCreate: true
                    });
                },
                getValue: function() { return state.value; },
                isValid: function() { return state.isValid; },
                removeOnChange: function(handler) {
                    const index = handlers.indexOf(handler);
                    if (index >= 0) {
                        handlers.splice(index, 1);
                    }
                },
                setRequiredLevel: function(level) {
                    if (!["none", "required", "recommended"].includes(level)) {
                        throw new RangeError("Unsupported required level.");
                    }
                    state.requiredLevel = level;
                },
                setIsValid: function(value) {
                    state.isValid = Boolean(value);
                },
                setPrecision: function(value) {
                    if (!Number.isInteger(value) || value < 0) {
                        throw new RangeError("Precision must be non-negative.");
                    }
                    state.precision = value;
                },
                setSubmitMode: function(mode) {
                    if (!["always", "never", "dirty"].includes(mode)) {
                        throw new RangeError("Unsupported submit mode.");
                    }
                    state.submitMode = mode;
                },
                setValue: function(value) {
                    state.value = value;
                    state.isDirty = true;
                }
            });
            __verseoffAttributeCache[name] = attribute;
            return attribute;
        }

        const __verseoffControlCache = Object.create(null);
        function __verseoffGridAttribute(row, name) {
            return Object.freeze({
                getIsDirty: function() { return false; },
                getName: function() { return name; },
                getValue: function() { return row.values[name]; },
                setValue: function(value) { row.values[name] = value; }
            });
        }
        function __verseoffGridEntity(row) {
            return Object.freeze({
                attributes: __verseoffCollection(
                    row.values,
                    function(name) {
                        return __verseoffGridAttribute(row, name);
                    }),
                getEntityName: function() { return row.entityName; },
                getEntityReference: function() {
                    return Object.freeze({
                        entityType: row.entityName,
                        id: row.recordId,
                        name: row.primaryName
                    });
                },
                getId: function() { return row.recordId; },
                getPrimaryAttributeValue: function() {
                    return row.primaryName;
                }
            });
        }
        function __verseoffGridRow(row) {
            return Object.freeze({
                getData: function() {
                    return Object.freeze({
                        getEntity: function() {
                            return __verseoffGridEntity(row);
                        }
                    });
                },
                getEntityName: function() { return row.entityName; },
                getId: function() { return row.recordId; },
                getName: function() { return row.primaryName; }
            });
        }
        function __verseoffGrid(state) {
            if (!state.grid) {
                return null;
            }
            const selected = state.grid.rows.filter(function(row) {
                return state.grid.selectedRecordIds.includes(row.recordId);
            });
            return Object.freeze({
                getEntityName: function() {
                    return state.grid.entityName;
                },
                getGridType: function() { return 1; },
                getRows: function() {
                    return __verseoffArrayCollection(
                        state.grid.rows,
                        __verseoffGridRow);
                },
                getSelectedRows: function() {
                    return __verseoffArrayCollection(
                        selected,
                        __verseoffGridRow);
                },
                getTotalRecordCount: function() {
                    return state.grid.rows.length;
                }
            });
        }
        function __verseoffControl(name) {
            const state = __verseoffState.controls[name];
            if (!state) {
                return null;
            }
            if (__verseoffControlCache[name]) {
                return __verseoffControlCache[name];
            }
            const control = Object.freeze({
                addNotification: function(notification) {
                    if (!notification || !notification.uniqueId) {
                        return false;
                    }
                    state.notifications[notification.uniqueId] =
                        notification.messages
                            ? notification.messages.join("\n")
                            : String(notification.message || "");
                    return true;
                },
                clearNotification: function(uniqueId) {
                    const existed = Object.prototype.hasOwnProperty.call(
                        state.notifications,
                        uniqueId);
                    delete state.notifications[uniqueId];
                    return existed;
                },
                getAttribute: function() {
                    return state.attributeName
                        ? __verseoffAttribute(state.attributeName)
                        : null;
                },
                getControlType: function() { return state.controlType; },
                getDisabled: function() { return state.isDisabled; },
                getEntityName: function() {
                    return state.grid ? state.grid.entityName : null;
                },
                getGrid: function() { return __verseoffGrid(state); },
                getLabel: function() { return state.label; },
                getName: function() { return state.name; },
                getParent: function() { return formContext.ui; },
                getOutputs: function() { return Object.freeze({}); },
                getVisible: function() { return state.isVisible; },
                getFetchXml: function() {
                    return state.grid ? state.grid.fetchXml : null;
                },
                getGridType: function() {
                    return state.grid ? 1 : null;
                },
                getRelationship: function() {
                    return state.grid ? state.grid.relationship : null;
                },
                getViewSelector: function() {
                    if (!state.grid) {
                        return null;
                    }
                    return Object.freeze({
                        getCurrentView: function() {
                            return state.grid.currentView;
                        },
                        isVisible: function() {
                            return state.grid.viewSelectorVisible;
                        },
                        setCurrentView: function(viewReference) {
                            state.grid.currentView = viewReference;
                        }
                    });
                },
                openRelatedGrid: function() {
                    return __verseoffUnsupported(
                        "grid.openRelatedGrid");
                },
                refreshRibbon: function() {},
                addOnLoad: function(handler) {
                    if (state.grid) { state.grid.onLoadCount++; }
                },
                removeOnLoad: function(handler) {},
                addOnRecordSelect: function(handler) {
                    if (state.grid) { state.grid.onRecordSelectCount++; }
                },
                removeOnRecordSelect: function(handler) {},
                addOnSave: function(handler) {
                    if (state.grid) { state.grid.onSaveCount++; }
                },
                removeOnSave: function(handler) {},
                setDisabled: function(value) {
                    state.isDisabled = Boolean(value);
                },
                setFocus: function() {
                    state.focusRequested = true;
                },
                setLabel: function(value) { state.label = String(value); },
                setNotification: function(message, uniqueId) {
                    const id = uniqueId || String(message);
                    state.notifications[id] = String(message);
                    return true;
                },
                refresh: function() {
                    if (state.controlType !== "timelinewall" &&
                        !state.grid) {
                        throw new Error(
                            "refresh is only available on supported refreshable controls.");
                    }
                    state.refreshRequested = true;
                },
                setVisible: function(value) {
                    state.isVisible = Boolean(value);
                }
            });
            __verseoffControlCache[name] = control;
            return control;
        }

        const __verseoffAttributes = __verseoffCollection(
            __verseoffState.attributes,
            __verseoffAttribute);
        const __verseoffEntityAttributeStates = {};
        Object.keys(__verseoffState.attributes).forEach(function(name) {
            if (__verseoffState.attributes[name].isEntityAttribute) {
                __verseoffEntityAttributeStates[name] =
                    __verseoffState.attributes[name];
            }
        });
        const __verseoffEntityAttributes = __verseoffCollection(
            __verseoffEntityAttributeStates,
            __verseoffAttribute);
        const __verseoffControls = __verseoffCollection(
            __verseoffState.controls,
            __verseoffControl);
        const __verseoffSectionCache = Object.create(null);
        function __verseoffSection(tabName, sectionName) {
            const key = tabName + ":" + sectionName;
            const state = __verseoffState.tabs[tabName]
                .sections[sectionName];
            if (__verseoffSectionCache[key]) {
                return __verseoffSectionCache[key];
            }
            const section = Object.freeze({
                controls: __verseoffArrayCollection(
                    state.controlNames,
                    function(controlName) {
                        return __verseoffControl(controlName);
                    }),
                getLabel: function() { return state.label; },
                getName: function() { return state.name; },
                getParent: function() { return __verseoffTab(tabName); },
                getVisible: function() { return state.isVisible; },
                setLabel: function(value) { state.label = String(value); },
                setVisible: function(value) {
                    state.isVisible = Boolean(value);
                }
            });
            __verseoffSectionCache[key] = section;
            return section;
        }
        const __verseoffTabCache = Object.create(null);
        function __verseoffTab(name) {
            const state = __verseoffState.tabs[name];
            if (!state) {
                return null;
            }
            if (__verseoffTabCache[name]) {
                return __verseoffTabCache[name];
            }
            const stateHandlers = [];
            const tab = Object.freeze({
                addTabStateChange: function(handler) {
                    if (typeof handler !== "function") {
                        throw new TypeError(
                            "Tab state handler must be a function.");
                    }
                    stateHandlers.push(handler);
                },
                getContentType: function() { return "cardSections"; },
                getDisplayState: function() {
                    return state.displayState;
                },
                getLabel: function() { return state.label; },
                getName: function() { return state.name; },
                getParent: function() { return formContext.ui; },
                getVisible: function() { return state.isVisible; },
                removeTabStateChange: function(handler) {
                    const index = stateHandlers.indexOf(handler);
                    if (index >= 0) {
                        stateHandlers.splice(index, 1);
                    }
                },
                sections: __verseoffCollection(
                    state.sections,
                    function(sectionName) {
                        return __verseoffSection(name, sectionName);
                    }),
                setDisplayState: function(value) {
                    if (!["expanded", "collapsed"].includes(value)) {
                        throw new RangeError(
                            "Unsupported tab display state.");
                    }
                    state.displayState = value;
                    stateHandlers.slice().forEach(function(handler) {
                        handler(executionContext);
                    });
                },
                setContentType: function() {
                    throw new Error(
                        "Changing tab content type is not supported offline.");
                },
                setFocus: function() {},
                setLabel: function(value) { state.label = String(value); },
                setVisible: function(value) {
                    state.isVisible = Boolean(value);
                }
            });
            __verseoffTabCache[name] = tab;
            return tab;
        }
        const __verseoffTabs = __verseoffCollection(
            __verseoffState.tabs,
            __verseoffTab);

        function __verseoffProcessStage(stage) {
            return Object.freeze({
                getCategory: function() {
                    return Object.freeze({
                        getValue: function() { return stage.category; }
                    });
                },
                getEntityName: function() { return stage.entityName; },
                getId: function() { return stage.stageId; },
                getName: function() { return stage.name; },
                getNavigationBehavior: function() { return null; },
                getStatus: function() { return stage.status; },
                getSteps: function() { return []; }
            });
        }
        function __verseoffProcessApi() {
            const state = __verseoffState.process;
            if (!state) {
                return null;
            }
            const stageHandlers = [];
            const statusHandlers = [];
            const stages = __verseoffArrayCollection(
                state.stages,
                __verseoffProcessStage);
            return Object.freeze({
                addOnPreProcessStatusChange: function(handler) {
                    statusHandlers.push(handler);
                },
                addOnPreStageChange: function(handler) {
                    stageHandlers.push(handler);
                },
                addOnStageSelected: function(handler) {
                    stageHandlers.push(handler);
                },
                addOnProcessStatusChange: function(handler) {
                    statusHandlers.push(handler);
                },
                addOnStageChange: function(handler) {
                    stageHandlers.push(handler);
                },
                getActivePath: function() {
                    return __verseoffArrayCollection(
                        state.stages.slice(0, state.activeStageIndex + 1),
                        __verseoffProcessStage);
                },
                getActiveProcess: function() {
                    return Object.freeze({
                        getId: function() { return state.processId; },
                        getName: function() { return state.name; },
                        getStages: function() { return stages; },
                        isRendered: function() { return true; }
                    });
                },
                getActiveStage: function() {
                    return __verseoffProcessStage(
                        state.stages[state.activeStageIndex]);
                },
                getDisplayState: function() { return "expanded"; },
                getEnabledProcesses: function(callback) {
                    const value = {};
                    value[state.processId] = state.name;
                    callback(value);
                },
                getProcessInstances: function(callback) {
                    const instances = [{
                        ProcessDefinitionID: state.processId,
                        ProcessDefinitionName: state.name,
                        StatusCodeName: state.status
                    }];
                    if (callback) {
                        callback(instances);
                    }
                    return Promise.resolve(instances);
                },
                getSelectedStage: function() {
                    return __verseoffProcessStage(
                        state.stages[state.activeStageIndex]);
                },
                getStatus: function() { return state.status; },
                moveNext: function(callback) {
                    if (state.activeStageIndex >= state.stages.length - 1) {
                        if (callback) { callback("end"); }
                        return;
                    }
                    state.activeStageIndex++;
                    stageHandlers.slice().forEach(function(handler) {
                        handler(executionContext);
                    });
                    if (callback) { callback("success"); }
                },
                movePrevious: function(callback) {
                    if (state.activeStageIndex <= 0) {
                        if (callback) { callback("beginning"); }
                        return;
                    }
                    state.activeStageIndex--;
                    stageHandlers.slice().forEach(function(handler) {
                        handler(executionContext);
                    });
                    if (callback) { callback("success"); }
                },
                removeOnPreProcessStatusChange: function() {},
                removeOnPreStageChange: function() {},
                removeOnProcessStatusChange: function() {},
                removeOnStageChange: function() {},
                removeOnStageSelected: function() {},
                setActiveProcess: function(processId, callback) {
                    const result = processId === state.processId
                        ? "success"
                        : "invalid";
                    if (callback) { callback(result); }
                },
                setActiveStage: function(stageId, callback) {
                    const index = state.stages.findIndex(function(stage) {
                        return stage.stageId === stageId;
                    });
                    if (index < 0) {
                        if (callback) { callback("invalid"); }
                        return;
                    }
                    state.activeStageIndex = index;
                    stageHandlers.slice().forEach(function(handler) {
                        handler(executionContext);
                    });
                    if (callback) { callback("success"); }
                },
                setActiveProcessInstance: function(instanceId, callback) {
                    if (callback) { callback("invalid"); }
                },
                setDisplayState: function() {},
                setStatus: function(status, callback) {
                    state.status = status;
                    statusHandlers.slice().forEach(function(handler) {
                        handler(executionContext);
                    });
                    if (callback) { callback("success"); }
                }
            });
        }
        const __verseoffProcess = __verseoffProcessApi();
        const __verseoffEntity = Object.freeze({
            addOnPostSave: function() {},
            addOnSave: function() {},
            attributes: __verseoffEntityAttributes,
            getDataXml: function() { return ""; },
            getEntityName: function() {
                return __verseoffState.entityName;
            },
            getEntityReference: function() {
                return Object.freeze({
                    entityType: __verseoffState.entityName,
                    id: __verseoffState.entityId,
                    name: null
                });
            },
            getId: function() { return __verseoffState.entityId; },
            getIsDirty: function() {
                return Object.keys(__verseoffState.attributes).some(
                    function(name) {
                        return __verseoffState.attributes[name].isDirty;
                    });
            },
            getPrimaryAttributeValue: function() {
                const primary = __verseoffState.attributes.name;
                return primary ? primary.value : null;
            },
            isValid: function() { return true; },
            removeOnPostSave: function() {},
            removeOnSave: function() {},
            save: function() {
                return __verseoffUnsupported("formContext.data.entity.save");
            }
        });
        const __verseoffData = Object.freeze({
            addOnLoad: function() {},
            attributes: __verseoffAttributes,
            entity: __verseoffEntity,
            getIsDirty: function() {
                return __verseoffEntity.getIsDirty();
            },
            process: __verseoffProcess,
            isValid: function() { return true; },
            refresh: function() {
                return __verseoffUnsupported("formContext.data.refresh");
            },
            removeOnLoad: function() {},
            save: function() {
                return __verseoffUnsupported("formContext.data.save");
            }
        });
        const __verseoffUi = Object.freeze({
            addLoaded: function() {},
            addOnLoad: function() {},
            clearFormNotification: function(uniqueId) {
                const existed = Object.prototype.hasOwnProperty.call(
                    __verseoffState.formNotifications,
                    uniqueId);
                delete __verseoffState.formNotifications[uniqueId];
                return existed;
            },
            close: function() {
                return __verseoffUnsupported("formContext.ui.close");
            },
            controls: __verseoffControls,
            getFormType: function() { return __verseoffState.formType; },
            getViewPortHeight: function() { return 0; },
            getViewPortWidth: function() { return 0; },
            formSelector: Object.freeze({
                getCurrentItem: function() { return null; },
                items: Object.freeze({
                    get: function() { return null; },
                    getLength: function() { return 0; },
                    forEach: function() {}
                })
            }),
            headerSection: Object.freeze({
                getBodyVisible: function() { return true; },
                getCommandBarVisible: function() { return true; },
                getTabNavigatorVisible: function() { return true; },
                setBodyVisible: function() {},
                setCommandBarVisible: function() {},
                setTabNavigatorVisible: function() {}
            }),
            navigation: Object.freeze({
                items: Object.freeze({
                    get: function() { return null; },
                    getLength: function() { return 0; },
                    forEach: function() {}
                })
            }),
            process: Object.freeze({
                getDisplayState: function() { return "expanded"; },
                getVisible: function() {
                    return __verseoffState.process !== null;
                },
                reflow: function() {},
                setDisplayState: function() {},
                setVisible: function() {}
            }),
            refreshRibbon: function() {},
            removeLoaded: function() {},
            removeOnLoad: function() {},
            setFormEntityName: function() {
                throw new Error(
                    "Changing the form entity is not supported offline.");
            },
            setFormNotification: function(message, level, uniqueId) {
                __verseoffState.formNotifications[uniqueId] = {
                    message: String(message),
                    level: String(level)
                };
                return true;
            },
            tabs: __verseoffTabs
        });
        const formContext = Object.freeze({
            data: __verseoffData,
            getAttribute: __verseoffAttribute,
            getControl: __verseoffControl,
            ui: __verseoffUi
        });

        function __verseoffEventSource() {
            const source = __verseoffState.eventSource;
            if (!source) {
                return null;
            }
            return source.kind === "attribute"
                ? __verseoffAttribute(source.name)
                : source.kind === "control"
                    ? __verseoffControl(source.name)
                    : source.kind === "gridRow"
                        ? Object.keys(__verseoffState.controls)
                            .map(function(name) {
                                const control =
                                    __verseoffState.controls[name];
                                return control.grid
                                    ? control.grid.rows
                                    : [];
                            })
                            .flat()
                            .filter(function(row) {
                                return row.recordId === source.name;
                            })
                            .map(__verseoffGridRow)[0] || null
                        : null;
        }

        const __verseoffEventArgs = Object.freeze({
            getSaveMode: function() {
                return __verseoffState.eventArguments
                    ? __verseoffState.eventArguments.saveMode
                    : 0;
            },
            isDefaultPrevented: function() {
                return __verseoffState.eventArguments
                    ? __verseoffState.eventArguments.isDefaultPrevented
                    : false;
            },
            preventDefault: function() {
                if (__verseoffState.eventArguments) {
                    __verseoffState.eventArguments.isDefaultPrevented = true;
                }
            },
            preventDefaultOnError: function() {
                if (__verseoffState.eventArguments) {
                    __verseoffState.eventArguments.preventDefaultOnError = true;
                }
            }
        });
        const executionContext = Object.freeze({
            getContext: function() {
                return Xrm.Utility.getGlobalContext();
            },
            getDepth: function() { return __verseoffState.depth; },
            getEventArgs: function() {
                return __verseoffState.eventArguments
                    ? __verseoffEventArgs
                    : null;
            },
            getEventSource: __verseoffEventSource,
            getFormContext: function() { return formContext; },
            getSharedVariable: function(key) {
                return Object.prototype.hasOwnProperty.call(
                    __verseoffState.sharedVariables,
                    key)
                        ? __verseoffState.sharedVariables[key]
                        : null;
            },
            setSharedVariable: function(key, value) {
                __verseoffState.sharedVariables[key] = value;
            }
        });

        const __verseoffReject = function(name) {
            return function() { return __verseoffUnsupported(name); };
        };
        const Xrm = Object.freeze({
            App: Object.freeze({
                addGlobalNotification:
                    __verseoffReject("Xrm.App.addGlobalNotification"),
                clearGlobalNotification:
                    __verseoffReject("Xrm.App.clearGlobalNotification")
            }),
            Copilot: Object.freeze({
                executeEvent: __verseoffReject("Xrm.Copilot.executeEvent"),
                isM365CopilotEnabled: function() { return false; }
            }),
            Device: Object.freeze({
                captureAudio: __verseoffReject("Xrm.Device.captureAudio"),
                captureImage: __verseoffReject("Xrm.Device.captureImage"),
                captureVideo: __verseoffReject("Xrm.Device.captureVideo"),
                getBarcodeValue:
                    __verseoffReject("Xrm.Device.getBarcodeValue"),
                getCurrentPosition:
                    __verseoffReject("Xrm.Device.getCurrentPosition"),
                pickFile: __verseoffReject("Xrm.Device.pickFile")
            }),
            Encoding: Object.freeze({
                htmlAttributeEncode: function(value) {
                    return String(value)
                        .replaceAll("&", "&amp;")
                        .replaceAll('"', "&quot;")
                        .replaceAll("'", "&#39;")
                        .replaceAll("<", "&lt;")
                        .replaceAll(">", "&gt;");
                },
                htmlDecode: function(value) {
                    return String(value)
                        .replaceAll("&lt;", "<")
                        .replaceAll("&gt;", ">")
                        .replaceAll("&quot;", '"')
                        .replaceAll("&#39;", "'")
                        .replaceAll("&amp;", "&");
                },
                htmlEncode: function(value) {
                    return String(value)
                        .replaceAll("&", "&amp;")
                        .replaceAll("<", "&lt;")
                        .replaceAll(">", "&gt;");
                },
                xmlAttributeEncode: function(value) {
                    return Xrm.Encoding.htmlAttributeEncode(value);
                },
                xmlEncode: function(value) {
                    return Xrm.Encoding.htmlEncode(value);
                }
            }),
            Navigation: Object.freeze({
                navigateTo: function(pageInput, navigationOptions) {
                    return __verseoffHostCall(
                        __verseoffNavigationHost,
                        "navigateTo",
                        { pageInput, navigationOptions });
                },
                openAlertDialog: function(alertStrings, alertOptions) {
                    return __verseoffHostCall(
                        __verseoffNavigationHost,
                        "openAlertDialog",
                        { alertStrings, alertOptions });
                },
                openConfirmDialog: function(
                    confirmStrings,
                    confirmOptions) {
                    return __verseoffHostCall(
                        __verseoffNavigationHost,
                        "openConfirmDialog",
                        { confirmStrings, confirmOptions });
                },
                openErrorDialog: function(errorOptions) {
                    return __verseoffHostCall(
                        __verseoffNavigationHost,
                        "openErrorDialog",
                        { errorOptions });
                },
                openFile: function(file, openFileOptions) {
                    return __verseoffHostCall(
                        __verseoffNavigationHost,
                        "openFile",
                        { file, openFileOptions });
                },
                openForm: function(entityFormOptions, formParameters) {
                    return __verseoffHostCall(
                        __verseoffNavigationHost,
                        "openForm",
                        { entityFormOptions, formParameters });
                },
                openUrl: function(url, openUrlOptions) {
                    return __verseoffHostCall(
                        __verseoffNavigationHost,
                        "openUrl",
                        { url, openUrlOptions });
                },
                openWebResource: function(
                    webResourceName,
                    windowOptions,
                    data) {
                    return __verseoffHostCall(
                        __verseoffNavigationHost,
                        "openWebResource",
                        { webResourceName, windowOptions, data });
                }
            }),
            Panel: Object.freeze({
                loadPanel: __verseoffReject("Xrm.Panel.loadPanel")
            }),
            Utility: Object.freeze({
                closeProgressIndicator: function() {},
                getAllowedStatusTransitions:
                    __verseoffReject(
                        "Xrm.Utility.getAllowedStatusTransitions"),
                getEntityMetadata:
                    __verseoffReject("Xrm.Utility.getEntityMetadata"),
                getEntityMainFormDescriptor:
                    __verseoffReject(
                        "Xrm.Utility.getEntityMainFormDescriptor"),
                getGlobalContext: function() {
                    return Object.freeze({
                        client: Object.freeze({
                            getClient: function() {
                                return "VerseOff";
                            },
                            getClientState: function() {
                                return "Offline";
                            }
                        }),
                        getClientUrl: function() {
                            return __verseoffState.clientUrl;
                        },
                        getCurrentAppName: function() {
                            return Promise.resolve(
                                __verseoffState.appName);
                        },
                        getCurrentAppProperties: function() {
                            return Promise.resolve(Object.freeze({
                                appId: __verseoffState.appModuleId,
                                displayName: __verseoffState.appName,
                                uniqueName: __verseoffState.appUniqueName
                            }));
                        },
                        getOrgUniqueName: function() {
                            return __verseoffState.organizationUniqueName;
                        },
                        getQueryStringParameters: function() {
                            return Object.freeze({});
                        },
                        getUserId: function() {
                            return __verseoffState.userObjectId;
                        },
                        getUserLcid: function() { return 1033; },
                        getUserName: function() {
                            return __verseoffState.userName;
                        },
                        isOnPremises: function() { return false; },
                        organizationSettings: Object.freeze({}),
                        userSettings: Object.freeze({})
                    });
                },
                getLearningPathAttributeName:
                    __verseoffReject(
                        "Xrm.Utility.getLearningPathAttributeName"),
                getPageContext: function() {
                    return Object.freeze({
                        input: Object.freeze({
                            entityId: __verseoffState.entityId,
                            entityName: __verseoffState.entityName,
                            pageType: "entityrecord"
                        })
                    });
                },
                getResourceString:
                    __verseoffReject("Xrm.Utility.getResourceString"),
                invokeProcessAction:
                    __verseoffReject("Xrm.Utility.invokeProcessAction"),
                lookupObjects:
                    __verseoffReject("Xrm.Utility.lookupObjects"),
                refreshParentGrid: function() {},
                showProgressIndicator: function() {}
            }),
            WebApi: Object.freeze({
                createRecord: function(entityLogicalName, data) {
                    return __verseoffHostCall(
                        __verseoffWebApiHost,
                        "createRecord",
                        { entityLogicalName, data });
                },
                deleteRecord: function(entityLogicalName, id) {
                    return __verseoffHostCall(
                        __verseoffWebApiHost,
                        "deleteRecord",
                        { entityLogicalName, id });
                },
                execute: function(request) {
                    return __verseoffHostCall(
                        __verseoffWebApiHost,
                        "execute",
                        { request });
                },
                executeMultiple: function(requests) {
                    return __verseoffHostCall(
                        __verseoffWebApiHost,
                        "executeMultiple",
                        { requests });
                },
                isAvailableOffline: function(entityLogicalName) {
                    return __verseoffOfflineTableCheck(entityLogicalName);
                },
                offline: Object.freeze({
                    createRecord: function(entityLogicalName, data) {
                        return Xrm.WebApi.createRecord(
                            entityLogicalName,
                            data);
                    },
                    deleteRecord: function(entityLogicalName, id) {
                        return Xrm.WebApi.deleteRecord(
                            entityLogicalName,
                            id);
                    },
                    isAvailableOffline: function(entityLogicalName) {
                        return Xrm.WebApi.isAvailableOffline(
                            entityLogicalName);
                    },
                    retrieveMultipleRecords: function(
                        entityLogicalName,
                        options,
                        maxPageSize) {
                        return Xrm.WebApi.retrieveMultipleRecords(
                            entityLogicalName,
                            options,
                            maxPageSize);
                    },
                    retrieveRecord: function(
                        entityLogicalName,
                        id,
                        options) {
                        return Xrm.WebApi.retrieveRecord(
                            entityLogicalName,
                            id,
                            options);
                    },
                    updateRecord: function(entityLogicalName, id, data) {
                        return Xrm.WebApi.updateRecord(
                            entityLogicalName,
                            id,
                            data);
                    }
                }),
                online: Object.freeze({
                    createRecord: function(entityLogicalName, data) {
                        return Xrm.WebApi.createRecord(
                            entityLogicalName,
                            data);
                    },
                    deleteRecord: function(entityLogicalName, id) {
                        return Xrm.WebApi.deleteRecord(
                            entityLogicalName,
                            id);
                    },
                    execute: function(request) {
                        return Xrm.WebApi.execute(request);
                    },
                    executeMultiple: function(requests) {
                        return Xrm.WebApi.executeMultiple(requests);
                    },
                    retrieveMultipleRecords: function(
                        entityLogicalName,
                        options,
                        maxPageSize) {
                        return Xrm.WebApi.retrieveMultipleRecords(
                            entityLogicalName,
                            options,
                            maxPageSize);
                    },
                    retrieveRecord: function(
                        entityLogicalName,
                        id,
                        options) {
                        return Xrm.WebApi.retrieveRecord(
                            entityLogicalName,
                            id,
                            options);
                    },
                    updateRecord: function(entityLogicalName, id, data) {
                        return Xrm.WebApi.updateRecord(
                            entityLogicalName,
                            id,
                            data);
                    }
                }),
                retrieveMultipleRecords: function(
                    entityLogicalName,
                    options,
                    maxPageSize) {
                    return __verseoffHostCall(
                        __verseoffWebApiHost,
                        "retrieveMultipleRecords",
                        { entityLogicalName, options, maxPageSize });
                },
                retrieveRecord: function(
                    entityLogicalName,
                    id,
                    options) {
                    return __verseoffHostCall(
                        __verseoffWebApiHost,
                        "retrieveRecord",
                        { entityLogicalName, id, options });
                },
                updateRecord: function(entityLogicalName, id, data) {
                    return __verseoffHostCall(
                        __verseoffWebApiHost,
                        "updateRecord",
                        { entityLogicalName, id, data });
                }
            }),
            Page: formContext
        });

        const GetGlobalContext = Xrm.Utility.getGlobalContext;

        function __verseoffExportState() {
            return __verseoffStringify(__verseoffState);
        }
        """;
}

internal sealed class ScriptState
{
    public required string EntityName { get; init; }

    public required string EntityId { get; init; }

    public int FormType { get; init; }

    public string? ClientUrl { get; init; }

    public string? AppModuleId { get; init; }

    public string? AppName { get; init; }

    public string? AppUniqueName { get; init; }

    public string? OrganizationUniqueName { get; init; }

    public string? UserObjectId { get; init; }

    public string? UserName { get; init; }

    public int Depth { get; init; }

    public required Dictionary<string, ScriptAttributeState> Attributes
    {
        get;
        init;
    }

    public required Dictionary<string, ScriptControlState> Controls
    {
        get;
        init;
    }

    public required Dictionary<string, ScriptTabState> Tabs
    {
        get;
        init;
    }

    public ScriptProcessState? Process { get; init; }

    public required Dictionary<string, JsonElement> SharedVariables
    {
        get;
        init;
    }

    public required Dictionary<string, JsonElement> FormNotifications
    {
        get;
        init;
    }

    public ScriptEventSource? EventSource { get; init; }

    public ScriptSaveEventArguments? EventArguments { get; init; }

    public static ScriptState Create(
        XrmExecutionContext executionContext,
        XrmFormContext formContext) =>
        new()
        {
            EntityName = formContext.EntityName,
            EntityId = formContext.EntityId.ToString("D"),
            FormType = formContext.FormType,
            ClientUrl = formContext.ClientUrl?.AbsoluteUri,
            Depth = executionContext.GetDepth(),
            Attributes = formContext.Attributes.ToDictionary(
                attribute => attribute.Name,
                attribute => new ScriptAttributeState
                {
                    Name = attribute.Name,
                    AttributeType = attribute.AttributeType,
                    Format = attribute.Format,
                    MaximumLength = attribute.MaximumLength,
                    IsEntityAttribute = attribute.IsEntityAttribute,
                    Options = attribute.Options.Select(option =>
                        new ScriptOptionState
                        {
                            Text = option.Text,
                            Value = option.Value,
                        }).ToArray(),
                    Minimum = attribute.Minimum,
                    Maximum = attribute.Maximum,
                    Precision = attribute.Precision,
                    IsValid = attribute.IsValid,
                    InitialValue = ScriptValue.ToJsonElement(
                        attribute.InitialValue),
                    Value = ScriptValue.ToJsonElement(attribute.GetValue()),
                    RequiredLevel = attribute.RequiredLevel,
                    SubmitMode = attribute.SubmitMode,
                    IsDirty = attribute.IsDirty,
                },
                StringComparer.OrdinalIgnoreCase),
            Controls = formContext.Controls.ToDictionary(
                control => control.Name,
                control => new ScriptControlState
                {
                    Name = control.Name,
                    ControlType = control.ControlType,
                    AttributeName = control.AttributeName,
                    Label = control.Label,
                    IsVisible = control.IsVisible,
                    IsDisabled = control.IsDisabled,
                    Notifications = new(
                        control.Notifications,
                        StringComparer.Ordinal),
                    RefreshRequested = false,
                    FocusRequested = false,
                    Grid = control is XrmGridControl grid
                        ? ScriptGridState.Create(grid)
                        : null,
                },
                StringComparer.OrdinalIgnoreCase),
            Tabs = formContext.Tabs.ToDictionary(
                tab => tab.Name,
                tab => ScriptTabState.Create(tab),
                StringComparer.OrdinalIgnoreCase),
            Process = formContext.Process is null
                ? null
                : ScriptProcessState.Create(formContext.Process),
            SharedVariables = executionContext
                .SnapshotSharedVariables()
                .ToDictionary(
                    item => item.Key,
                    item => ScriptValue.ToJsonElement(item.Value),
                    StringComparer.Ordinal),
            FormNotifications = new(StringComparer.Ordinal),
            EventSource = ScriptEventSource.Create(
                executionContext.GetEventSource()),
            EventArguments = executionContext.GetEventArgs()
                is XrmSaveEventArguments save
                    ? new()
                    {
                        SaveMode = save.SaveMode,
                        IsDefaultPrevented = save.IsDefaultPrevented,
                        PreventDefaultOnError = save.PreventDefaultOnError,
                    }
                    : null,
        };

    public void Apply(
        XrmExecutionContext executionContext,
        XrmFormContext formContext)
    {
        foreach (var attribute in Attributes)
        {
            formContext.GetAttribute(attribute.Key)?.ApplyScriptState(
                ScriptValue.FromJsonElement(attribute.Value.Value),
                attribute.Value.RequiredLevel,
                attribute.Value.SubmitMode,
                attribute.Value.IsDirty,
                attribute.Value.IsValid,
                attribute.Value.Precision);
        }

        foreach (var control in Controls)
        {
            var nativeControl = formContext.GetControl(control.Key);
            nativeControl?.ApplyScriptState(
                control.Value.Label,
                control.Value.IsVisible,
                control.Value.IsDisabled,
                control.Value.Notifications,
                control.Value.RefreshRequested);
            if (control.Value.FocusRequested && nativeControl is not null)
            {
                nativeControl.SetFocus();
            }
            if (nativeControl is XrmGridControl grid
                && control.Value.Grid is not null)
            {
                grid.ApplyGridState(
                    control.Value.Grid.Rows,
                    control.Value.Grid.SelectedRecordIds.ToHashSet());
            }
        }

        foreach (var tab in Tabs)
        {
            formContext.GetTab(tab.Key)?.ApplyScriptState(
                tab.Value.Label,
                tab.Value.IsVisible,
                tab.Value.DisplayState,
                tab.Value.Sections);
        }

        if (Process is not null && formContext.Process is not null)
        {
            formContext.Process.ApplyScriptState(
                Process.ActiveStageIndex,
                Process.Status);
        }

        executionContext.ApplySharedVariables(
            SharedVariables.ToDictionary(
                item => item.Key,
                item => ScriptValue.FromJsonElement(item.Value),
                StringComparer.Ordinal));
        if (EventArguments is not null
            && executionContext.GetEventArgs()
                is XrmSaveEventArguments saveArguments)
        {
            if (EventArguments.IsDefaultPrevented)
            {
                saveArguments.PreventDefault();
            }

            if (EventArguments.PreventDefaultOnError)
            {
                saveArguments.PreventDefaultWhenHandlerFails();
            }
        }
    }
}

internal sealed class ScriptAttributeState
{
    public required string Name { get; init; }

    public required string AttributeType { get; init; }

    public string? Format { get; init; }

    public int? MaximumLength { get; init; }

    public bool IsEntityAttribute { get; init; }

    public required ScriptOptionState[] Options { get; init; }

    public decimal? Minimum { get; init; }

    public decimal? Maximum { get; init; }

    public int? Precision { get; init; }

    public bool IsValid { get; init; }

    public JsonElement InitialValue { get; init; }

    public JsonElement Value { get; init; }

    public required string RequiredLevel { get; init; }

    public required string SubmitMode { get; init; }

    public bool IsDirty { get; init; }
}

internal sealed class ScriptOptionState
{
    public required string Text { get; init; }

    public int Value { get; init; }
}

internal sealed class ScriptControlState
{
    public required string Name { get; init; }

    public required string ControlType { get; init; }

    public string? AttributeName { get; init; }

    public required string Label { get; init; }

    public bool IsVisible { get; init; }

    public bool IsDisabled { get; init; }

    public required Dictionary<string, string> Notifications { get; init; }

    public bool RefreshRequested { get; init; }

    public bool FocusRequested { get; init; }

    public ScriptGridState? Grid { get; init; }
}

internal sealed class ScriptSectionState
{
    public required string Name { get; init; }

    public required string Label { get; init; }

    public bool IsVisible { get; init; }

    public required string[] ControlNames { get; init; }
}

internal sealed class ScriptTabState
{
    public required string Name { get; init; }

    public required string Label { get; init; }

    public bool IsVisible { get; init; }

    public required string DisplayState { get; init; }

    public required Dictionary<string, ScriptSectionState> Sections
    {
        get;
        init;
    }

    public static ScriptTabState Create(XrmTab tab) =>
        new()
        {
            Name = tab.Name,
            Label = tab.Label,
            IsVisible = tab.IsVisible,
            DisplayState = tab.DisplayState,
            Sections = tab.Sections.ToDictionary(
                section => section.Name,
                section => new ScriptSectionState
                {
                    Name = section.Name,
                    Label = section.Label,
                    IsVisible = section.IsVisible,
                    ControlNames = section.ControlNames.ToArray(),
                },
                StringComparer.OrdinalIgnoreCase),
        };
}

internal sealed class ScriptProcessState
{
    public Guid ProcessId { get; init; }

    public required string Name { get; init; }

    public int ActiveStageIndex { get; init; }

    public required string Status { get; init; }

    public required ScriptProcessStageState[] Stages { get; init; }

    public static ScriptProcessState Create(XrmProcess process) =>
        new()
        {
            ProcessId = process.ProcessId,
            Name = process.Name,
            ActiveStageIndex = process.ActiveStageIndex,
            Status = process.Status,
            Stages = process.Stages.Select(stage =>
                new ScriptProcessStageState
                {
                    StageId = stage.StageId,
                    Name = stage.Name,
                    EntityName = stage.EntityName,
                    Status = stage.Status,
                    Category = stage.Category,
                }).ToArray(),
        };
}

internal sealed class ScriptProcessStageState
{
    public Guid StageId { get; init; }

    public required string Name { get; init; }

    public required string EntityName { get; init; }

    public required string Status { get; init; }

    public int Category { get; init; }
}

internal sealed class ScriptGridState
{
    public required string EntityName { get; init; }

    public required ScriptGridRowState[] Rows { get; init; }

    public required Guid[] SelectedRecordIds { get; init; }

    public string? FetchXml { get; init; }

    public Dictionary<string, string>? Relationship { get; init; }

    public Dictionary<string, string>? CurrentView { get; init; }

    public bool ViewSelectorVisible { get; init; } = true;

    public int OnLoadCount { get; init; }

    public int OnRecordSelectCount { get; init; }

    public int OnSaveCount { get; init; }

    public static ScriptGridState Create(XrmGridControl grid) =>
        new()
        {
            EntityName = grid.EntityName,
            Rows = grid.Rows.Select(row => new ScriptGridRowState
            {
                RecordId = row.RecordId,
                EntityName = row.EntityName,
                PrimaryName = row.PrimaryName,
                Values = row.Values.ToDictionary(
                    item => item.Key,
                    item => ScriptValue.ToJsonElement(item.Value),
                    StringComparer.OrdinalIgnoreCase),
            }).ToArray(),
            SelectedRecordIds = grid.SelectedRecordIds.ToArray(),
        };
}

internal sealed class ScriptGridRowState
{
    public Guid RecordId { get; init; }

    public required string EntityName { get; init; }

    public string? PrimaryName { get; init; }

    public required Dictionary<string, JsonElement> Values { get; init; }
}

internal sealed record ScriptEventSource(string Kind, string Name)
{
    public static ScriptEventSource? Create(object? source) =>
        source switch
        {
            XrmAttribute attribute => new("attribute", attribute.Name),
            XrmControl control => new("control", control.Name),
            XrmGridRow row => new(
                "gridRow",
                row.RecordId.ToString("D")),
            _ => null,
        };
}

internal sealed class ScriptSaveEventArguments
{
    public int SaveMode { get; init; }

    public bool IsDefaultPrevented { get; init; }

    public bool PreventDefaultOnError { get; init; }
}

internal static class ScriptValue
{
    public static JsonElement ToJsonElement(object? value) =>
        JsonSerializer.SerializeToElement(
            Normalize(value),
            JintCustomerScriptRuntimeJson.Options);

    public static object? Normalize(object? value) =>
        value switch
        {
            null => null,
            string or bool or byte or sbyte or short or ushort or int
                or uint or long or ulong or float or double or decimal => value,
            Guid guid => guid.ToString("D"),
            DateTime valueAsDateTime =>
                valueAsDateTime.ToUniversalTime().ToString("O"),
            DateTimeOffset valueAsDateTimeOffset =>
                valueAsDateTimeOffset.ToUniversalTime().ToString("O"),
            JsonElement element => FromJsonElement(element),
            IEnumerable<object?> list => list.Select(Normalize).ToArray(),
            IReadOnlyDictionary<string, object?> dictionary =>
                dictionary.ToDictionary(
                    item => item.Key,
                    item => Normalize(item.Value),
                    StringComparer.Ordinal),
            _ => throw new CustomerScriptRejectedException(
                $"Value type '{value.GetType().FullName}' cannot cross the customer-script boundary."),
        };

    public static object? FromJsonElement(JsonElement element) =>
        element.ValueKind switch
        {
            JsonValueKind.Null or JsonValueKind.Undefined => null,
            JsonValueKind.String => element.GetString(),
            JsonValueKind.True => true,
            JsonValueKind.False => false,
            JsonValueKind.Number when element.TryGetInt64(out var integer) =>
                integer,
            JsonValueKind.Number => element.GetDouble(),
            JsonValueKind.Array => element.EnumerateArray()
                .Select(FromJsonElement)
                .ToArray(),
            JsonValueKind.Object => element.EnumerateObject()
                .ToDictionary(
                    property => property.Name,
                    property => FromJsonElement(property.Value),
                    StringComparer.Ordinal),
            _ => throw new CustomerScriptRejectedException(
                "A script value has an unsupported JSON representation."),
        };
}

internal static class JintCustomerScriptRuntimeJson
{
    public static JsonSerializerOptions Options { get; } = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };
}
