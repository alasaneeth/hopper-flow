using Microsoft.EntityFrameworkCore;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Domain.Entities;
using HopperFlow.Domain.Enums;
using HopperFlow.Infrastructure.Data;

namespace HopperFlow.Infrastructure.Repositories;

public class RicePurchaseRepository : GenericRepository<RicePurchase>, IRicePurchaseRepository
{
    public RicePurchaseRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<RicePurchase>> GetByDateRangeAsync(
        DateTime from, DateTime to)
        => await _context.RicePurchases
            .Include(r => r.Supplier)
            .Where(r => r.PurchaseDate >= from && r.PurchaseDate <= to && !r.IsDeleted)
            .OrderByDescending(r => r.PurchaseDate)
            .ToListAsync();

    public async Task<IEnumerable<RicePurchase>> GetByRiceTypeAsync(ProductType riceType)
        => await _context.RicePurchases
            .Include(r => r.Supplier)
            .Where(r => r.RiceType == riceType && !r.IsDeleted)
            .OrderByDescending(r => r.PurchaseDate)
            .ToListAsync();
}