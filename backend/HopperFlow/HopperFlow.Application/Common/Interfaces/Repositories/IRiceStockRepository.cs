using HopperFlow.Domain.Entities;
using HopperFlow.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Application.Common.Interfaces.Repositories
{
    public interface IRiceStockRepository : IGenericRepository<RiceStock>
    {
        Task<RiceStock?> GetByRiceTypeAsync(ProductType riceType);
        Task<IEnumerable<RiceStock>> GetLowStockItemsAsync();
    }
}
