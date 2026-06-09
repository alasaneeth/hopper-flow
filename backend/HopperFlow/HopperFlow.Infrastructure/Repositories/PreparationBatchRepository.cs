using Microsoft.EntityFrameworkCore;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Domain.Entities;
using HopperFlow.Domain.Enums;
using HopperFlow.Infrastructure.Data;

namespace HopperFlow.Infrastructure.Repositories;

public class PreparationBatchRepository : GenericRepository<PreparationBatch>,
    IPreparationBatchRepository
{
    public PreparationBatchRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<PreparationBatch>> GetByDateRangeAsync(
        DateTime from, DateTime to)
        => await _context.PreparationBatches
            .Where(p => p.PreparationDate >= from &&
                        p.PreparationDate <= to &&
                        !p.IsDeleted)
            .OrderByDescending(p => p.PreparationDate)
            .ToListAsync();

    public async Task<IEnumerable<PreparationBatch>> GetByProductTypeAsync(
        ProductType productType)
        => await _context.PreparationBatches
            .Where(p => p.ProductType == productType && !p.IsDeleted)
            .OrderByDescending(p => p.PreparationDate)
            .ToListAsync();
}