namespace FlowOps.Api.Models;

public sealed class Incident
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Severity { get; set; } = "Medium";
    public string Status { get; set; } = "New";
    public string ServiceName { get; set; } = string.Empty;
    public string AssignedTo { get; set; } = "Unassigned";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public int SlaTargetMinutes { get; set; } = 240;
}

public sealed class IncidentComment
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string IncidentId { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Author { get; set; } = "Current User";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}

public sealed class IncidentActivity
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string IncidentId { get; set; } = string.Empty;
    public string Type { get; set; } = "StatusChanged";
    public string Message { get; set; } = string.Empty;
    public string PerformedBy { get; set; } = "Current User";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public string? PreviousValue { get; set; }
    public string? NewValue { get; set; }
}
