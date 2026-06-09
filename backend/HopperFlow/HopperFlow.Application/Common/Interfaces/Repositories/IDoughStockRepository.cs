using HopperFlow.Domain.Entities;
using HopperFlow.Domain.Enums;

namespace HopperFlow.Application.Common.Interfaces.Repositories;

public interface IDoughStockRepository : IGenericRepository<DoughStock>
{
    Task<DoughStock?> GetByProductTypeAsync(ProductType productType);
    Task<IEnumerable<DoughStock>> GetLowStockItemsAsync();
}