using HopperFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Application.Common.Interfaces.Repositories
{
    public interface ISupplierRepository : IGenericRepository<Supplier>
    {
        Task<IEnumerable<Supplier>> GetActiveSupplersAsync();
    }
}
