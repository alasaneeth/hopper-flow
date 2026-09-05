using Microsoft.EntityFrameworkCore;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Domain.Entities;
using HopperFlow.Domain.Enums;
using HopperFlow.Infrastructure.Data;

namespace HopperFlow.Infrastructure.Repositories;

public class RiceStockRepository : GenericRepository<RiceStock>, IRiceStockRepository
{
    public RiceStockRepository(AppDbContext context) : base(context) { }

    public async Task<RiceStock?> GetByRiceTypeAsync(ProductType riceType)
        => await _context.RiceStocks
            .FirstOrDefaultAsync(r => r.RiceType == riceType && !r.IsDeleted);

    public async Task<IEnumerable<RiceStock>> GetLowStockItemsAsync()
        => await _context.RiceStocks
            .Where(r => r.QuantityKg <= r.LowStockThresholdKg && !r.IsDeleted)
            .ToListAsync();
}