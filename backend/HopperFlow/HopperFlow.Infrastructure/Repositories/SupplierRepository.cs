using Microsoft.EntityFrameworkCore;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Domain.Entities;
using HopperFlow.Infrastructure.Data;

namespace HopperFlow.Infrastructure.Repositories;

public class SupplierRepository : GenericRepository<Supplier>, ISupplierRepository
{
    public SupplierRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Supplier>> GetActiveSupplersAsync()
        => await _context.Suppliers
            .Where(s => s.IsActive && !s.IsDeleted)
            .OrderBy(s => s.Name)
            .ToListAsync();
}