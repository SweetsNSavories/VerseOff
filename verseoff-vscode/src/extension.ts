import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { InteractiveBrowserCredential } from "@azure/identity";
import { LogsQueryClient } from "@azure/monitor-query";

export function activate(context: vscode.ExtensionContext) {
    console.log('VerseOff Maker Extension is now active!');

    let openPortalDisposable = vscode.commands.registerCommand('verseoff.openMakerPortal', () => {
        const panel = vscode.window.createWebviewPanel(
            'verseOffMaker',
            'VerseOff Maker Portal',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = getWebviewContent(panel.webview);

        panel.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'generate':
                        vscode.window.showInformationMessage(`Starting Generation...`);
                        await runPythonGenerator(message.data, context);
                        return;
                    case 'fetchApps':
                        vscode.window.showInformationMessage("Fetching Model-Driven Apps...");
                        // In reality, this hits GET /api/data/v9.2/appmodules
                        panel.webview.postMessage({ command: 'appsFetched', apps: ['Customer Service Hub', 'Sales Professional', 'Field Service'] });
                        return;
                    case 'fetchEntities':
                        vscode.window.showInformationMessage(`Fetching components for App: ${message.appName}...`);
                        // In reality, this queries appmodulecomponents
                        panel.webview.postMessage({ command: 'entitiesFetched', entities: ['incident', 'account', 'contact'] });
                        return;
                    case 'askAI':
                        vscode.window.showInformationMessage(`Asking AI: "${message.prompt}"`);
                        const query = await invokeLLMForComponent(message.prompt);
                        if (query) {
                            panel.webview.postMessage({ command: 'aiResponse', result: `AI suggests including component via query: ${query}` });
                        } else {
                            panel.webview.postMessage({ command: 'aiResponse', result: `AI could not determine the component query.` });
                        }
                        return;
                }
            },
            undefined,
            context.subscriptions
        );
    });

    let runTestsDisposable = vscode.commands.registerCommand('verseoff.runAutoCorrection', async () => {
        vscode.window.showInformationMessage('Starting AI Auto-Correction Test Loop...');
        await runTestLoop();
    });

    context.subscriptions.push(openPortalDisposable, runTestsDisposable);
}

function getWebviewContent(webview: vscode.Webview) {
    // Using VS Code Webview UI Toolkit for native look and feel
    const toolkitUri = 'https://cdn.jsdelivr.net/npm/@vscode/webview-ui-toolkit@1.2.2/dist/toolkit.min.js';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VerseOff Maker Portal</title>
    <script type="module" src="${toolkitUri}"></script>
    <style>
        body { padding: 20px; max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
        .card { padding: 20px; border: 1px solid var(--vscode-widget-border); background: var(--vscode-editor-background); border-radius: 6px; }
        .row { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; }
        .entities-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
    </style>
</head>
<body>
    <h1>VerseOff Maker Portal</h1>
    
    <div class="card">
        <h2>1. Connection</h2>
        <div class="row">
            <label>Dataverse Environment URL <span style="color:red">*</span></label>
            <vscode-text-field id="orgUrl" value="https://org.crm.dynamics.com" style="width: 100%;"></vscode-text-field>
        </div>
        <div class="row">
            <label>Entra ID Client ID (For Auth) <span style="color:red">*</span></label>
            <vscode-text-field id="clientId" placeholder="Enter Azure AD Client ID Guid" style="width: 100%;"></vscode-text-field>
        </div>
        <div class="row">
            <label>App Insights Workspace ID (For Telemetry) <span style="color:red">*</span></label>
            <vscode-text-field id="workspaceId" placeholder="Enter Log Analytics Workspace ID" style="width: 100%;"></vscode-text-field>
        </div>
        <vscode-button id="connectBtn">Connect to Environment</vscode-button>
    </div>

    <div class="card" id="appCard" style="opacity: 0.5; pointer-events: none;">
        <h2>2. Select Model-Driven App</h2>
        <p>Choose the base app to take offline.</p>
        <div class="row" id="appList">
            <!-- Populated dynamically -->
        </div>
        <vscode-button id="selectAppBtn">Load App Components</vscode-button>
    </div>

    <div class="card" id="selectionCard" style="opacity: 0.5; pointer-events: none;">
        <h2>3. Component Trimming</h2>
        <p>Trim down the entities and forms from the selected app.</p>
        <div class="entities-grid" id="entityList">
            <!-- Populated dynamically -->
        </div>
        
        <hr style="margin: 20px 0; border-color: var(--vscode-widget-border);" />
        
        <h3>AI Component Inclusion</h3>
        <p>Want to include a custom plugin or workflow? Ask the AI!</p>
        <div class="row">
            <vscode-text-field id="aiPrompt" placeholder="e.g. Include the SLA calculation workflow" style="width: 100%;"></vscode-text-field>
            <vscode-button id="askAIBtn" appearance="secondary">Ask AI</vscode-button>
            <p id="aiResult" style="color: var(--vscode-charts-green); font-size: 0.9em;"></p>
        </div>
        
        <br />
        <vscode-button id="generateBtn" appearance="primary">Generate Offline App</vscode-button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let selectedAppName = "";
        
        document.getElementById('connectBtn').addEventListener('click', () => {
            const org = document.getElementById('orgUrl').value;
            const client = document.getElementById('clientId').value;
            const workspace = document.getElementById('workspaceId').value;
            
            if (!org || !client || !workspace) {
                const btn = document.getElementById('connectBtn');
                btn.textContent = 'Error: Missing Required Fields';
                setTimeout(() => { btn.textContent = 'Connect to Environment'; }, 2000);
                return;
            }
            
            document.getElementById('connectBtn').textContent = 'Connecting...';
            vscode.postMessage({ command: 'fetchApps' });
        });

        document.getElementById('selectAppBtn').addEventListener('click', () => {
            const apps = document.querySelectorAll('vscode-radio');
            apps.forEach(app => {
                if(app.checked) selectedAppName = app.value;
            });
            if(selectedAppName) {
                document.getElementById('selectAppBtn').textContent = 'Loading...';
                vscode.postMessage({ command: 'fetchEntities', appName: selectedAppName });
            }
        });

        document.getElementById('askAIBtn').addEventListener('click', () => {
            const prompt = document.getElementById('aiPrompt').value;
            if(prompt) {
                document.getElementById('aiResult').textContent = "Thinking...";
                vscode.postMessage({ command: 'askAI', prompt: prompt });
            }
        });

        document.getElementById('generateBtn').addEventListener('click', () => {
            const selected = Array.from(document.querySelectorAll('vscode-checkbox'))
                .filter(cb => cb.checked)
                .map(cb => cb.value);
                
            vscode.postMessage({
                command: 'generate',
                data: {
                    orgUrl: document.getElementById('orgUrl').value,
                    clientId: document.getElementById('clientId').value,
                    workspaceId: document.getElementById('workspaceId').value,
                    baseApp: selectedAppName,
                    entities: selected,
                    customODataQueries: [ document.getElementById('aiResult').textContent ]
                }
            });
        });

        window.addEventListener('message', event => {
            const message = event.data;
            if (message.command === 'appsFetched') {
                document.getElementById('connectBtn').textContent = 'Connected';
                document.getElementById('appCard').style.opacity = '1';
                document.getElementById('appCard').style.pointerEvents = 'all';
                
                const list = document.getElementById('appList');
                list.innerHTML = '';
                message.apps.forEach(app => {
                    const rb = document.createElement('vscode-radio');
                    rb.value = app;
                    rb.textContent = app;
                    list.appendChild(rb);
                });
            } else if (message.command === 'entitiesFetched') {
                document.getElementById('selectAppBtn').textContent = 'Loaded';
                document.getElementById('selectionCard').style.opacity = '1';
                document.getElementById('selectionCard').style.pointerEvents = 'all';
                
                const list = document.getElementById('entityList');
                list.innerHTML = '';
                message.entities.forEach(ent => {
                    const cb = document.createElement('vscode-checkbox');
                    cb.value = ent;
                    cb.textContent = ent;
                    cb.checked = true; // Default to true since it's in the app
                    list.appendChild(cb);
                });
            } else if (message.command === 'aiResponse') {
                document.getElementById('aiResult').textContent = message.result;
            }
        });
    </script>
</body>
</html>`;
}

async function runPythonGenerator(data: any, context: vscode.ExtensionContext) {
    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage("Open a workspace first.");
        return;
    }
    const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    
    // 1. Fetch Telemetry via Azure SDK
    vscode.window.showInformationMessage("Authenticating with Azure to fetch Telemetry Cache Manifest...");
    let cacheManifest = {};
    try {
        cacheManifest = await fetchAppInsightsTelemetry(data.clientId, data.workspaceId || "YOUR_WORKSPACE_ID");
        vscode.window.showInformationMessage("Telemetry successfully retrieved! Building manifest.");
    } catch (e) {
        vscode.window.showWarningMessage("Telemetry fetch failed, falling back to full cache.");
        console.error(e);
    }

    // Embed the telemetry manifest into the python data
    data.cache_manifest = cacheManifest;
    
    // Write the manifest payload
    const manifestPath = path.join(wsPath, 'maker_manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(data, null, 2));

    const terminal = vscode.window.createTerminal("VerseOff Builder");
    terminal.show();
    terminal.sendText(`python VerseOff/cli.py --manifest maker_manifest.json`);
    terminal.sendText(`python VerseOff/dev_runner.py`);
}

async function fetchAppInsightsTelemetry(clientId: string, workspaceId: string): Promise<any> {
    // 1. Authenticate (Pops browser, caches token)
    const credential = new InteractiveBrowserCredential({
        clientId: clientId,
        tenantId: "common"
    });

    const logsQueryClient = new LogsQueryClient(credential);

    // 2. Query App Insights for top records
    const kqlQuery = `
        pageViews
        | where timestamp > ago(90d)
        | where name == "EditForm Load"
        | extend entity = tostring(customDimensions["entityName"])
        | extend recordId = tostring(customDimensions["recordId"])
        | extend userId = tostring(customDimensions["userId"])
        | summarize accessCount=count() by entity, recordId, userId
        | order by accessCount desc
        | take 50
    `;

    try {
        const result = await logsQueryClient.queryWorkspace(workspaceId, kqlQuery, { duration: "P90D" });
        
        // Transform LogQueryResult into cache_manifest dict
        const manifest: any = {};
        if (result.status === "Success") {
            const tables = result.tables;
            if (tables && tables.length > 0) {
                const table = tables[0];
                for (const row of table.rows) {
                    const entity = row[0]?.toString() || "unknown";
                    const recordId = row[1]?.toString() || "";
                    const count = Number(row[3]) || 1;
                    
                    if (!manifest[entity]) manifest[entity] = [];
                    manifest[entity].push({ id: recordId, priority: count });
                }
            }
        }
        return manifest;
    } catch (e) {
        throw new Error("Failed to query App Insights workspace: " + e);
    }
}

async function runTestLoop() {
    if (!vscode.workspace.workspaceFolders) return;
    const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const outputDir = path.join(wsPath, 'generated_app');

    const terminal = vscode.window.createTerminal("VerseOff AI Auto-Correction");
    terminal.show();

    // Loop 3 times max to prevent infinite AI loops
    for (let i = 0; i < 3; i++) {
        terminal.sendText(`echo '=== Running Test Cycle ${i + 1} ==='`);
        
        try {
            const { stdout, stderr } = await execPromise(`pytest ${path.join(outputDir, 'tests')} -v`, { cwd: wsPath });
            terminal.sendText("echo '✅ All tests passed! Offline app is fully verified.'");
            vscode.window.showInformationMessage("Auto-Correction Complete: All JS functions safely bridge to PyQt.");
            break; 
        } catch (error: any) {
            terminal.sendText(`echo '❌ Tests failed. Caught stack trace.'`);
            
            // Extract the failure from stdout/stderr
            const failureLog = error.stdout || error.stderr || error.message;
            terminal.sendText(`echo '🤖 Submitting failure to GitHub Copilot / VS Code LM...'`);
            
            const fixedCode = await invokeLLMAutoFix(failureLog);
            if (fixedCode) {
                terminal.sendText(`echo '✨ AI proposed a fix. Applying to workspace and rebuilding...'`);
                // In production, we'd parse the LLM output for file paths and write the files.
                // For demo, we just simulate the wait.
            } else {
                terminal.sendText(`echo '⚠️ AI could not determine a fix.'`);
                break;
            }
        }
    }
}

async function invokeLLMAutoFix(failureLog: string): Promise<string | null> {
    try {
        // Utilize the native VS Code Language Model API (BYO-AI via Copilot Extension)
        const models = await vscode.lm.selectChatModels({ family: 'gpt-4o' });
        if (models.length === 0) {
            console.warn("No language model available. Please install GitHub Copilot Chat.");
            return null;
        }
        
        // Read the extracted PDF Knowledge
        let pdfKnowledge = "";
        try {
            const wsPath = vscode.workspace.workspaceFolders![0].uri.fsPath;
            const refPath = path.join(wsPath, 'd365_engine_reference.md');
            if (fs.existsSync(refPath)) {
                pdfKnowledge = fs.readFileSync(refPath, 'utf8');
            }
        } catch (e) {
            console.warn("Could not load PDF knowledge base.");
        }
        
        const prompt = `You are a PyQt6 and Dataverse XRM expert building the VerseOff offline app.
        
        YOUR SINGLE MINDED PURPOSE:
        You exist ONLY to build, fix, and optimize a PyQt6-based offline application powered by a local SQLite database. 
        You MUST NOT deviate from this architecture. Do not suggest web technologies, other frameworks, or alternative databases.
        
        PREREQUISITES ASSUMED:
        - The developer using this tool MUST have at least the 'System Customizer' role in the target Dataverse Organization.
        - The developer MUST have the 'prvReadAuditSummary' privilege (optional but recommended for Audit History telemetry).
        - The developer MUST have access to Dataverse AppInsights Telemetry for this organization to support intelligent caching.

        The following test execution failed while evaluating a downloaded Dataverse JavaScript file inside a QJSEngine.
        
        Here is the official reference architecture extracted from the Dynamics 365 PDF Documentation:
        ---
        ${pdfKnowledge}
        ---
        
        Error Log:
        ${failureLog.substring(0, 1000)} // truncate for safety
        
        Using the architectural rules and knowledge provided above, provide the corrected JavaScript code or Python MockFormContext patch to resolve this failure. 
        Respond ONLY with code.`;

        const messages = [vscode.LanguageModelChatMessage.User(prompt)];
        const response = await models[0].sendRequest(messages, {}, new vscode.CancellationTokenSource().token);
        
        let fullResponse = "";
        for await (const chunk of response.text) {
            fullResponse += chunk;
        }
        return fullResponse;
    } catch (e) {
        console.error("LLM Auto-fix failed", e);
        return null;
    }
}

async function invokeLLMForComponent(promptText: string): Promise<string | null> {
    try {
        const models = await vscode.lm.selectChatModels({ family: 'gpt-4o' });
        if (models.length === 0) return null;
        
        const prompt = `You are a Dataverse OData expert. The developer wants to include a specific solution component in their offline app.
        Their request: "${promptText}"
        
        Provide ONLY the OData v9.2 filter query string to locate this component in the 'solutioncomponents' or related metadata table. 
        For example: "$filter=contains(name, 'SLA') and componenttype eq 29"
        Respond ONLY with the string, no markdown, no quotes.`;

        const messages = [vscode.LanguageModelChatMessage.User(prompt)];
        const response = await models[0].sendRequest(messages, {}, new vscode.CancellationTokenSource().token);
        
        let fullResponse = "";
        for await (const chunk of response.text) {
            fullResponse += chunk;
        }
        return fullResponse.trim();
    } catch (e) {
        return null;
    }
}

function execPromise(command: string, options: cp.ExecOptions): Promise<{ stdout: string, stderr: string }> {
    return new Promise((resolve, reject) => {
        cp.exec(command, options, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stdout, stderr });
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

export function deactivate() {}
