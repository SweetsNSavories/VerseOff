using VerseOff.Customization.Metadata;

namespace VerseOff.Customization.Data;

/// <summary>
/// In-memory data provider for testing and offline scenarios
/// </summary>
public class InMemoryDataProvider : IDataProvider
{
    private readonly Dictionary<string, List<Dictionary<string, object>>> _data;
    private readonly Dictionary<string, ViewDefinition> _views;

    public InMemoryDataProvider()
    {
        _data = new();
        _views = new();
    }

    /// <summary>
    /// Add test data to the provider
    /// </summary>
    public void AddRecords(string entityLogicalName, List<Dictionary<string, object>> records)
    {
        _data[entityLogicalName] = new List<Dictionary<string, object>>(records);
    }

    /// <summary>
    /// Add a view definition
    /// </summary>
    public void AddView(string entityLogicalName, ViewDefinition view)
    {
        var key = $"{entityLogicalName}:{view.ViewId}";
        _views[key] = view;
    }

    public Task<List<Dictionary<string, object>>> GetRecordsAsync(
        string entityLogicalName,
        CancellationToken cancellationToken = default)
    {
        if (!_data.TryGetValue(entityLogicalName, out var records))
            return Task.FromResult(new List<Dictionary<string, object>>());

        return Task.FromResult(new List<Dictionary<string, object>>(records));
    }

    public Task<List<Dictionary<string, object>>> GetRelatedRecordsAsync(
        string parentEntityLogicalName,
        string parentRecordId,
        string relationshipName,
        CancellationToken cancellationToken = default)
    {
        // In memory implementation - just return empty for now
        // In production, would implement relationship traversal
        return Task.FromResult(new List<Dictionary<string, object>>());
    }

    public Task<ViewDefinition?> GetViewDefinitionAsync(
        string entityLogicalName,
        string viewId,
        CancellationToken cancellationToken = default)
    {
        var key = $"{entityLogicalName}:{viewId}";
        _views.TryGetValue(key, out var view);
        return Task.FromResult(view);
    }
}

/// <summary>
/// REST API data provider (for cloud/API scenarios)
/// </summary>
public class RestApiDataProvider : IDataProvider
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;
    private readonly Dictionary<string, ViewDefinition> _viewCache;
    private readonly TimeSpan _cacheDuration;

    public RestApiDataProvider(string baseUrl, HttpClient? httpClient = null)
    {
        ArgumentNullException.ThrowIfNull(baseUrl);

        _baseUrl = baseUrl.TrimEnd('/');
        _httpClient = httpClient ?? new HttpClient();
        _viewCache = new();
        _cacheDuration = TimeSpan.FromMinutes(15);
    }

    public async Task<List<Dictionary<string, object>>> GetRecordsAsync(
        string entityLogicalName,
        CancellationToken cancellationToken = default)
    {
        var url = $"{_baseUrl}/api/data/v1.0/{entityLogicalName}";
        var response = await _httpClient.GetAsync(url, cancellationToken);

        if (!response.IsSuccessStatusCode)
            return new();

        var json = await response.Content.ReadAsStringAsync(cancellationToken);
        // Parse JSON to list of dictionaries - simplified for now
        return new List<Dictionary<string, object>>();
    }

    public async Task<List<Dictionary<string, object>>> GetRelatedRecordsAsync(
        string parentEntityLogicalName,
        string parentRecordId,
        string relationshipName,
        CancellationToken cancellationToken = default)
    {
        var url = $"{_baseUrl}/api/data/v1.0/{parentEntityLogicalName}({parentRecordId})/{relationshipName}";
        var response = await _httpClient.GetAsync(url, cancellationToken);

        if (!response.IsSuccessStatusCode)
            return new();

        var json = await response.Content.ReadAsStringAsync(cancellationToken);
        // Parse JSON to list of dictionaries - simplified for now
        return new List<Dictionary<string, object>>();
    }

    public async Task<ViewDefinition?> GetViewDefinitionAsync(
        string entityLogicalName,
        string viewId,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = $"{entityLogicalName}:{viewId}";
        if (_viewCache.TryGetValue(cacheKey, out var cachedView))
        {
            if (DateTime.UtcNow - cachedView.CachedAt < _cacheDuration)
                return cachedView;
            _viewCache.Remove(cacheKey);
        }

        var url = $"{_baseUrl}/api/data/v1.0/{entityLogicalName}/views({viewId})";
        var response = await _httpClient.GetAsync(url, cancellationToken);

        if (!response.IsSuccessStatusCode)
            return null;

        var json = await response.Content.ReadAsStringAsync(cancellationToken);
        // Parse JSON to ViewDefinition - simplified for now
        return null;
    }
}

