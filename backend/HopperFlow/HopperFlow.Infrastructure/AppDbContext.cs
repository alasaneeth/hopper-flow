using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using HopperFlow.Domain.Entities;

namespace HopperFlow.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppUser>(entity =>
        {
            entity.Property(e => e.FullName)
                  .HasMaxLength(100)
                  .IsRequired();

            entity.Property(e => e.Role)
                  .IsRequired();

            entity.Property(e => e.IsActive)
                  .HasDefaultValue(true);
        });
    }
}