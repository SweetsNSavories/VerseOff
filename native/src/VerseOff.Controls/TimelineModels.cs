using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Data.Common;
using System.Runtime.CompilerServices;
using System.Security;
using VerseOff.Domain;

namespace VerseOff.Controls;

public enum TimelineRecordKind
{
    Activity = 0,
    Note = 1,
    Post = 2,
    Custom = 3,
}

public enum TimelineAttachmentTransferState
{
    MetadataOnly = 0,
    PendingDownload = 1,
    Available = 2,
    PendingUpload = 3,
    Failed = 4,
}

public sealed record TimelineParty(
    int ParticipationTypeMask,
    Guid? PartyId,
    string? PartyLogicalName,
    string? UnresolvedPartyName,
    string? AddressUsed);

public sealed record TimelineAttachment(
    Guid AttachmentId,
    string FileName,
    string MimeType,
    long Size,
    string? Checksum,
    string? Etag,
    TimelineAttachmentTransferState TransferState);

public sealed record TimelineRecord(
    Guid RecordId,
    string TableLogicalName,
    TimelineRecordKind Kind,
    string Subject,
    string? Body,
    DateTimeOffset SortDate,
    string? StatusLabel,
    string? OwnerDisplayName,
    bool IsPinned,
    IReadOnlyList<TimelineParty> Parties,
    IReadOnlyList<TimelineAttachment> Attachments,
    string SecuritySnapshotVersion,
    string? Etag);

public sealed record TimelineQuery(
    Guid RegardingId,
    string RegardingTable,
    IReadOnlyList<TimelineModule> Modules,
    IReadOnlyList<string> ActivityTypes,
    string? SearchText,
    TimelineSortDirection SortDirection,
    TimelineRollupType RollupType,
    int PageSize,
    string? ContinuationToken);

public sealed record TimelinePage(
    IReadOnlyList<TimelineRecord> Records,
    string? ContinuationToken);

public interface ITimelineRecordProvider
{
    ValueTask<TimelinePage> QueryAsync(
        TimelineQuery query,
        CancellationToken cancellationToken = default);
}

public sealed class TimelineViewModel : INotifyPropertyChanged
{
    private readonly TimelineDefinition definition;
    private readonly ITimelineRecordProvider provider;
    private readonly Guid regardingId;
    private readonly string regardingTable;
    private string? continuationToken;
    private string? searchText;
    private string? errorMessage;
    private bool isBusy;

    public TimelineViewModel(
        TimelineDefinition definition,
        ITimelineRecordProvider provider,
        Guid regardingId,
        string regardingTable)
    {
        this.definition = definition
            ?? throw new ArgumentNullException(nameof(definition));
        this.provider = provider
            ?? throw new ArgumentNullException(nameof(provider));
        ArgumentException.ThrowIfNullOrWhiteSpace(regardingTable);
        this.regardingId = regardingId;
        this.regardingTable = regardingTable;
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    public ObservableCollection<TimelineRecord> Records { get; } = [];

    public string? SearchText
    {
        get => searchText;
        set => SetProperty(ref searchText, value);
    }

    public string? ErrorMessage
    {
        get => errorMessage;
        private set => SetProperty(ref errorMessage, value);
    }

    public bool IsBusy
    {
        get => isBusy;
        private set
        {
            if (SetProperty(ref isBusy, value))
            {
                OnPropertyChanged(nameof(CanLoadMore));
            }
        }
    }

    public bool CanLoadMore =>
        !IsBusy && !string.IsNullOrWhiteSpace(continuationToken);

    public async Task RefreshAsync(
        CancellationToken cancellationToken = default)
    {
        continuationToken = null;
        Records.Clear();
        await LoadPageAsync(cancellationToken);
    }

    public Task LoadMoreAsync(
        CancellationToken cancellationToken = default) =>
        LoadPageAsync(cancellationToken);

    private async Task LoadPageAsync(CancellationToken cancellationToken)
    {
        if (IsBusy)
        {
            return;
        }

        IsBusy = true;
        ErrorMessage = null;
        try
        {
            var page = await provider.QueryAsync(
                new(
                    regardingId,
                    regardingTable,
                    definition.EnabledModules,
                    definition.EnabledActivityTypes,
                    SearchText,
                    definition.SortDirection,
                    definition.RollupType,
                    definition.RecordsPerPage,
                    continuationToken),
                cancellationToken);
            foreach (var record in page.Records)
            {
                if (!Records.Any(existing =>
                        existing.RecordId == record.RecordId))
                {
                    Records.Add(record);
                }
            }

            continuationToken = page.ContinuationToken;
            OnPropertyChanged(nameof(CanLoadMore));
        }
        catch (SecurityException exception)
        {
            ErrorMessage = exception.Message;
        }
        catch (DbException exception)
        {
            ErrorMessage = exception.Message;
        }
        catch (IOException exception)
        {
            ErrorMessage = exception.Message;
        }
        catch (InvalidOperationException exception)
        {
            ErrorMessage = exception.Message;
        }
        finally
        {
            IsBusy = false;
        }
    }

    private bool SetProperty<T>(
        ref T field,
        T value,
        [CallerMemberName] string? propertyName = null)
    {
        if (EqualityComparer<T>.Default.Equals(field, value))
        {
            return false;
        }

        field = value;
        OnPropertyChanged(propertyName);
        return true;
    }

    private void OnPropertyChanged(
        [CallerMemberName] string? propertyName = null) =>
        PropertyChanged?.Invoke(
            this,
            new PropertyChangedEventArgs(propertyName));
}
