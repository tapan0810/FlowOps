using FlowOps.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FlowOps.Api.Data;

public sealed class FlowOpsDbContext(DbContextOptions<FlowOpsDbContext> options) : DbContext(options)
{
    public DbSet<Incident> Incidents => Set<Incident>();
    public DbSet<IncidentComment> Comments => Set<IncidentComment>();
    public DbSet<IncidentActivity> Activities => Set<IncidentActivity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Incident>().HasKey(x => x.Id);
        modelBuilder.Entity<Incident>().Property(x => x.Title).HasMaxLength(200).IsRequired();
        modelBuilder.Entity<Incident>().Property(x => x.Severity).HasMaxLength(20).IsRequired();
        modelBuilder.Entity<Incident>().Property(x => x.Status).HasMaxLength(30).IsRequired();
        modelBuilder.Entity<Incident>().Property(x => x.ServiceName).HasMaxLength(120).IsRequired();
        modelBuilder.Entity<Incident>().Property(x => x.AssignedTo).HasMaxLength(120).IsRequired();

        modelBuilder.Entity<IncidentComment>().HasKey(x => x.Id);
        modelBuilder.Entity<IncidentComment>().Property(x => x.Message).HasMaxLength(4000).IsRequired();
        modelBuilder.Entity<IncidentComment>().HasIndex(x => x.IncidentId);

        modelBuilder.Entity<IncidentActivity>().HasKey(x => x.Id);
        modelBuilder.Entity<IncidentActivity>().Property(x => x.Message).HasMaxLength(1000).IsRequired();
        modelBuilder.Entity<IncidentActivity>().HasIndex(x => x.IncidentId);
    }
}
