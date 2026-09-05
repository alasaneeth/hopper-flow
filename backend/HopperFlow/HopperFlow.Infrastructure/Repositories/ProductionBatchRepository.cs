using Microsoft.EntityFrameworkCore;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Domain.Entities;
using HopperFlow.Domain.Enums;
using HopperFlow.Infrastructure.Data;

namespace HopperFlow.Infrastructure.Repositories;

public class ProductionBatchRepository : GenericRepository<ProductionBatch>,
    IProductionBatchRepository
{
    public ProductionBatchRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<ProductionBatch>> GetByDateRangeAsync(
        DateTime from, DateTime to)
        => await _context.ProductionBatches
            .Where(p => p.ProductionDate >= from &&
                        p.ProductionDate <= to &&
                        !p.IsDeleted)
            .OrderByDescending(p => p.ProductionDate)
            .ToListAsync();

    public async Task<IEnumerable<ProductionBatch>> GetByProductTypeAsync(
        ProductType productType)
        => await _context.ProductionBatches
            .Where(p => p.ProductType == productType && !p.IsDeleted)
            .OrderByDescending(p => p.ProductionDate)
            .ToListAsync();

    public async Task<IEnumerable<ProductionBatch>> GetSpecialOrdersAsync()
        => await _context.ProductionBatches
            .Where(p => p.IsSpecialOrder && !p.IsDeleted)
            .OrderByDescending(p => p.ProductionDate)
            .ToListAsync();
}