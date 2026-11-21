using FlowOps.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<FlowOpsDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("FlowOps")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("FlowOpsUi", policy => policy
        .WithOrigins("http://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("FlowOpsUi");
app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "FlowOps.Api" }));
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<FlowOpsDbContext>();
    await db.Database.EnsureCreatedAsync();
    if (!await db.Incidents.AnyAsync())
    {
        db.Incidents.AddRange(
            new FlowOps.Api.Models.Incident { Id = "INC-1001", Title = "Payment gateway unavailable", Description = "Payment processing requests are failing.", ServiceName = "Payment Gateway", Severity = "Critical", Status = "Investigating", AssignedTo = "Rahul Sharma", CreatedAt = DateTimeOffset.UtcNow.AddHours(-3), SlaTargetMinutes = 30 },
            new FlowOps.Api.Models.Incident { Id = "INC-1002", Title = "Customer portal latency", Description = "Customers are experiencing slow response times.", ServiceName = "Customer Portal", Severity = "High", Status = "Assigned", AssignedTo = "Priya Singh", CreatedAt = DateTimeOffset.UtcNow.AddHours(-2), SlaTargetMinutes = 60 },
            new FlowOps.Api.Models.Incident { Id = "INC-1003", Title = "Database connection pool exhausted", Description = "Database connections are being exhausted.", ServiceName = "Customer Database", Severity = "Critical", Status = "Triaged", AssignedTo = "Amit Verma", CreatedAt = DateTimeOffset.UtcNow.AddHours(-1), SlaTargetMinutes = 60 },
            new FlowOps.Api.Models.Incident { Id = "INC-1004", Title = "Email notification delay", Description = "Outbound notifications are delayed.", ServiceName = "Notification Service", Severity = "Medium", Status = "Investigating", AssignedTo = "Neha Das", CreatedAt = DateTimeOffset.UtcNow.AddMinutes(-90), SlaTargetMinutes = 240 },
            new FlowOps.Api.Models.Incident { Id = "INC-1005", Title = "Report export failure", Description = "Users cannot export operational reports.", ServiceName = "Reporting Service", Severity = "Low", Status = "Triaged", AssignedTo = "Unassigned", CreatedAt = DateTimeOffset.UtcNow.AddMinutes(-45), SlaTargetMinutes = 480 }
        );
        await db.SaveChangesAsync();
    }
}

app.Run();

public partial class Program { }
