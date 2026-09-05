using Microsoft.EntityFrameworkCore;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Domain.Entities;
using HopperFlow.Domain.Enums;
using HopperFlow.Infrastructure.Data;

namespace HopperFlow.Infrastructure.Repositories;

public class DoughStockRepository : GenericRepository<DoughStock>, IDoughStockRepository
{
    public DoughStockRepository(AppDbContext context) : base(context) { }

    public async Task<DoughStock?> GetByProductTypeAsync(ProductType productType)
        => await _context.DoughStocks
            .FirstOrDefaultAsync(d => d.ProductType == productType && !d.IsDeleted);

    public async Task<IEnumerable<DoughStock>> GetLowStockItemsAsync()
        => await _context.DoughStocks
            .Where(d => d.QuantityKg <= d.LowStockThresholdKg && !d.IsDeleted)
            .ToListAsync();
}