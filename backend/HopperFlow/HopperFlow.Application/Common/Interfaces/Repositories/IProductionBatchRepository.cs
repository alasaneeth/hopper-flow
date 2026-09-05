using HopperFlow.Domain.Entities;
using HopperFlow.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Application.Common.Interfaces.Repositories
{
    public interface IProductionBatchRepository : IGenericRepository<ProductionBatch>
    {
        Task<IEnumerable<ProductionBatch>> GetByDateRangeAsync(DateTime from, DateTime to);
        Task<IEnumerable<ProductionBatch>> GetByProductTypeAsync(ProductType productType);
        Task<IEnumerable<ProductionBatch>> GetSpecialOrdersAsync();
    }
}
