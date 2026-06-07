using HopperFlow.Domain.Entities;
using HopperFlow.Domain.Enums;

namespace HopperFlow.Application.Common.Interfaces.Repositories;

public interface IPreparationBatchRepository : IGenericRepository<PreparationBatch>
{
    Task<IEnumerable<PreparationBatch>> GetByDateRangeAsync(DateTime from, DateTime to);
    Task<IEnumerable<PreparationBatch>> GetByProductTypeAsync(ProductType productType);
}