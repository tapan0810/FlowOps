using FlowOps.Api.Data;
using FlowOps.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlowOps.Api.Controllers;

[ApiController]
[Route("incidents")]
public sealed class IncidentsController(FlowOpsDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Incident>>> GetAll(CancellationToken ct) =>
        Ok(await db.Incidents.AsNoTracking().OrderByDescending(x => x.CreatedAt).ToListAsync(ct));

    [HttpGet("{id}")]
    public async Task<ActionResult<Incident>> GetById(string id, CancellationToken ct)
    {
        var incident = await db.Incidents.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);
        return incident is null ? NotFound() : Ok(incident);
    }

    [HttpPost]
    public async Task<ActionResult<Incident>> Create(Incident incident, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(incident.Title) || string.IsNullOrWhiteSpace(incident.ServiceName))
            return BadRequest(new { message = "Title and serviceName are required." });

        incident.Id = string.IsNullOrWhiteSpace(incident.Id) ? $"INC-{Guid.NewGuid().ToString("N")[..8]}" : incident.Id;
        incident.CreatedAt = incident.CreatedAt == default ? DateTimeOffset.UtcNow : incident.CreatedAt;
        db.Incidents.Add(incident);
        await db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = incident.Id }, incident);
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult<Incident>> Patch(string id, IncidentPatch patch, CancellationToken ct)
    {
        var incident = await db.Incidents.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (incident is null) return NotFound();

        if (patch.Title is not null) incident.Title = patch.Title;
        if (patch.Description is not null) incident.Description = patch.Description;
        if (patch.Severity is not null) incident.Severity = patch.Severity;
        if (patch.Status is not null) incident.Status = patch.Status;
        if (patch.ServiceName is not null) incident.ServiceName = patch.ServiceName;
        if (patch.AssignedTo is not null) incident.AssignedTo = patch.AssignedTo;
        if (patch.SlaTargetMinutes.HasValue) incident.SlaTargetMinutes = patch.SlaTargetMinutes.Value;

        await db.SaveChangesAsync(ct);
        return Ok(incident);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var incident = await db.Incidents.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (incident is null) return NotFound();
        db.Incidents.Remove(incident);
        await db.SaveChangesAsync(ct);
        return NoContent();
    }
}

public sealed record IncidentPatch(
    string? Title,
    string? Description,
    string? Severity,
    string? Status,
    string? ServiceName,
    string? AssignedTo,
    int? SlaTargetMinutes);
