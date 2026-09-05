using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HopperFlow.Domain.Entities;

namespace HopperFlow.Application.Common.Interfaces.Repositories;

public interface ICustomerRepository : IGenericRepository<Customer>
{
    Task<IEnumerable<Customer>> GetActiveCustomersAsync();
    Task<Customer?> GetCustomerWithOrdersAsync(int id);
}