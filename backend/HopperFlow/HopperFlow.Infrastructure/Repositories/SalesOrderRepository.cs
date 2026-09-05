using Microsoft.EntityFrameworkCore;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Domain.Entities;
using HopperFlow.Domain.Enums;
using HopperFlow.Infrastructure.Data;

namespace HopperFlow.Infrastructure.Repositories;

public class SalesOrderRepository : GenericRepository<SalesOrder>, ISalesOrderRepository
{
    public SalesOrderRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<SalesOrder>> GetByCustomerAsync(int customerId)
        => await _context.SalesOrders
            .Include(o => o.Customer)
            .Include(o => o.Payments)
            .Where(o => o.CustomerId == customerId && !o.IsDeleted)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

    public async Task<IEnumerable<SalesOrder>> GetByPaymentStatusAsync(PaymentStatus status)
        => await _context.SalesOrders
            .Include(o => o.Customer)
            .Where(o => o.PaymentStatus == status && !o.IsDeleted)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

    public async Task<IEnumerable<SalesOrder>> GetByDateRangeAsync(
        DateTime from, DateTime to)
        => await _context.SalesOrders
            .Include(o => o.Customer)
            .Include(o => o.Payments)
            .Where(o => o.OrderDate >= from &&
                        o.OrderDate <= to &&
                        !o.IsDeleted)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

    public async Task<SalesOrder?> GetOrderWithPaymentsAsync(int id)
        => await _context.SalesOrders
            .Include(o => o.Customer)
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == id && !o.IsDeleted);

    public override async Task<IEnumerable<SalesOrder>> GetAllAsync()
        => await _context.SalesOrders
            .Include(o => o.Customer)
            .Include(o => o.Payments)
            .Where(o => !o.IsDeleted)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();
}