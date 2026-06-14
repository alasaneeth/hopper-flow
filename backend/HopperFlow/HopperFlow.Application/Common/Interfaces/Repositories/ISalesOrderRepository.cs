using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HopperFlow.Domain.Entities;
using HopperFlow.Domain.Enums;

namespace HopperFlow.Application.Common.Interfaces.Repositories;

public interface ISalesOrderRepository : IGenericRepository<SalesOrder>
{
    Task<IEnumerable<SalesOrder>> GetByCustomerAsync(int customerId);
    Task<IEnumerable<SalesOrder>> GetByPaymentStatusAsync(PaymentStatus status);
    Task<IEnumerable<SalesOrder>> GetByDateRangeAsync(DateTime from, DateTime to);
    Task<SalesOrder?> GetOrderWithPaymentsAsync(int id);
}
