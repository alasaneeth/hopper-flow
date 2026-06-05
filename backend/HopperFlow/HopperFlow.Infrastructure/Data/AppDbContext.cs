using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using HopperFlow.Domain.Entities;

namespace HopperFlow.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<RicePurchase> RicePurchases => Set<RicePurchase>();
    public DbSet<RiceStock> RiceStocks => Set<RiceStock>();
    public DbSet<ProductionBatch> ProductionBatches => Set<ProductionBatch>();

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
        builder.Entity<Supplier>(entity =>
        {
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.ContactNumber).HasMaxLength(20);
            entity.Property(e => e.Address).HasMaxLength(250);
        });

        builder.Entity<RicePurchase>(entity =>
        {
            entity.Property(e => e.QuantityKg).HasPrecision(10, 2);
            entity.Property(e => e.PricePerKg).HasPrecision(10, 2);
            entity.Property(e => e.TotalAmount).HasPrecision(10, 2);
            entity.HasOne(e => e.Supplier)
                  .WithMany(s => s.RicePurchases)
                  .HasForeignKey(e => e.SupplierId);
        });

        builder.Entity<RiceStock>(entity =>
        {
            entity.Property(e => e.QuantityKg).HasPrecision(10, 2);
            entity.Property(e => e.LowStockThresholdKg).HasPrecision(10, 2);
        });
    }
}