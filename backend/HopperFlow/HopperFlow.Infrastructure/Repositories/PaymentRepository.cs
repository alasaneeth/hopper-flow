using Microsoft.EntityFrameworkCore;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Domain.Entities;
using HopperFlow.Infrastructure.Data;

namespace HopperFlow.Infrastructure.Repositories;

public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
{
    public PaymentRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Payment>> GetByOrderAsync(int salesOrderId)
        => await _context.Payments
            .Where(p => p.SalesOrderId == salesOrderId && !p.IsDeleted)
            .OrderByDescending(p => p.PaymentDate)
            .ToListAsync();
}