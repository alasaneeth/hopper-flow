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

public class PayrollRepository : GenericRepository<Payroll>, IPayrollRepository
{
    public PayrollRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Payroll>> GetByEmployeeAsync(int employeeId)
        => await _context.Payrolls
            .Include(p => p.Employee)
            .Where(p => p.EmployeeId == employeeId && !p.IsDeleted)
            .OrderByDescending(p => p.Year)
            .ThenByDescending(p => p.Month)
            .ToListAsync();

    public async Task<IEnumerable<Payroll>> GetByMonthAsync(int month, int year)
        => await _context.Payrolls
            .Include(p => p.Employee)
            .Where(p => p.Month == month && p.Year == year && !p.IsDeleted)
            .ToListAsync();

    public async Task<Payroll?> GetByEmployeeAndMonthAsync(int employeeId, int month, int year)
        => await _context.Payrolls
            .Include(p => p.Employee)
            .FirstOrDefaultAsync(p => p.EmployeeId == employeeId &&
                                      p.Month == month &&
                                      p.Year == year &&
                                      !p.IsDeleted);
}
