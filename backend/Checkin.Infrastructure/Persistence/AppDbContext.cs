using Microsoft.EntityFrameworkCore;
using Checkin.Domain.Entities;

namespace Checkin.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(
        DbContextOptions<AppDbContext> options
    ) : base(options)
    {
    }

    public DbSet<Device> Devices => Set<Device>();

    public DbSet<Checkin.Domain.Entities.Checkin> Checkins
    => Set<Checkin.Domain.Entities.Checkin>();

    public object CheckIns { get; set; }
}