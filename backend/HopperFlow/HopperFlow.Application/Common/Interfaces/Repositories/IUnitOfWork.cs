using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Application.Common.Interfaces.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        ISupplierRepository Suppliers { get; }
        IRicePurchaseRepository RicePurchases { get; }
        IRiceStockRepository RiceStocks { get; }
        Task<int> SaveChangesAsync();
    }
}
