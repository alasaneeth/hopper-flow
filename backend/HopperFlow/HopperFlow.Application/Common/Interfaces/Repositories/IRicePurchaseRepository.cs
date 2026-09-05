using HopperFlow.Domain.Entities;
using HopperFlow.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Application.Common.Interfaces.Repositories
{
    public interface IRicePurchaseRepository: IGenericRepository<RicePurchase>
    {
        Task<IEnumerable<RicePurchase>> GetByDateRangeAsync(DateTime from, DateTime to);
        Task<IEnumerable<RicePurchase>> GetByRiceTypeAsync(ProductType riceType);
    }
}
