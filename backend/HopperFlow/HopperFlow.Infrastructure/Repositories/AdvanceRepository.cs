using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Domain.Entities;
using HopperFlow.Infrastructure.Data;

namespace HopperFlow.Infrastructure.Repositories;

public class AdvanceRepository : GenericRepository<Advance>, IAdvanceRepository
{
    public AdvanceRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Advance>> GetByEmployeeAsync(int employeeId)
        => await _context.Advances
            .Where(a => a.EmployeeId == employeeId && !a.IsDeleted)
            .OrderByDescending(a => a.StartDate)
            .ToListAsync();

    public async Task<IEnumerable<Advance>> GetActiveAdvancesAsync()
        => await _context.Advances
            .Include(a => a.Employee)
            .Where(a => !a.IsCompleted && !a.IsDeleted)
            .ToListAsync();

    public async Task<Advance?> GetActiveAdvanceByEmployeeAsync(int employeeId)
        => await _context.Advances
            .FirstOrDefaultAsync(a => a.EmployeeId == employeeId &&
                                      !a.IsCompleted &&
                                      !a.IsDeleted);
}