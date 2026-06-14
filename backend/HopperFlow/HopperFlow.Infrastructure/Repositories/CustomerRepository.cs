using Microsoft.EntityFrameworkCore;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Domain.Entities;
using HopperFlow.Infrastructure.Data;

namespace HopperFlow.Infrastructure.Repositories;

public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
{
    public CustomerRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Customer>> GetActiveCustomersAsync()
        => await _context.Customers
            .Where(c => c.IsActive && !c.IsDeleted)
            .OrderBy(c => c.Name)
            .ToListAsync();

    public async Task<Customer?> GetCustomerWithOrdersAsync(int id)
        => await _context.Customers
            .Include(c => c.SalesOrders)
            .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);
}