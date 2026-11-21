using FlowOps.Api.Data;
using FlowOps.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlowOps.Api.Controllers;

[ApiController]
public sealed class IncidentRecordsController(FlowOpsDbContext db) : ControllerBase
{
    [HttpGet("comments")]
    public async Task<ActionResult<IReadOnlyList<IncidentComment>>> GetComments(CancellationToken ct) =>
        Ok(await db.Comments.AsNoTracking().OrderByDescending(x => x.CreatedAt).ToListAsync(ct));

    [HttpPost("comments")]
    public async Task<ActionResult<IncidentComment>> AddComment(IncidentComment comment, CancellationToken ct)
    {
        if (!await db.Incidents.AnyAsync(x => x.Id == comment.IncidentId, ct)) return NotFound(new { message = "Incident not found." });
        if (string.IsNullOrWhiteSpace(comment.Message)) return BadRequest(new { message = "Comment message is required." });
        comment.Id = string.IsNullOrWhiteSpace(comment.Id) ? Guid.NewGuid().ToString("N") : comment.Id;
        comment.CreatedAt = DateTimeOffset.UtcNow;
        db.Comments.Add(comment);
        await db.SaveChangesAsync(ct);
        return Ok(comment);
    }

    [HttpGet("activities")]
    public async Task<ActionResult<IReadOnlyList<IncidentActivity>>> GetActivities(CancellationToken ct) =>
        Ok(await db.Activities.AsNoTracking().OrderByDescending(x => x.CreatedAt).ToListAsync(ct));

    [HttpPost("activities")]
    public async Task<ActionResult<IncidentActivity>> AddActivity(IncidentActivity activity, CancellationToken ct)
    {
        if (!await db.Incidents.AnyAsync(x => x.Id == activity.IncidentId, ct)) return NotFound(new { message = "Incident not found." });
        activity.Id = string.IsNullOrWhiteSpace(activity.Id) ? Guid.NewGuid().ToString("N") : activity.Id;
        activity.CreatedAt = DateTimeOffset.UtcNow;
        db.Activities.Add(activity);
        await db.SaveChangesAsync(ct);
        return Ok(activity);
    }
}
