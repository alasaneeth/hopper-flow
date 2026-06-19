using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Domain.Entities;
using HopperFlow.Domain.Enums;
using HopperFlow.Infrastructure.Data;

namespace HopperFlow.Infrastructure.Repositories;

public class EmployeeRepository : GenericRepository<Employee>, IEmployeeRepository
{
    public EmployeeRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Employee>> GetActiveEmployeesAsync()
        => await _context.Employees
            .Where(e => e.IsActive && !e.IsDeleted)
            .OrderBy(e => e.Name)
            .ToListAsync();

    public async Task<IEnumerable<Employee>> GetByRoleAsync(EmployeeRole role)
        => await _context.Employees
            .Where(e => e.Role == role && !e.IsDeleted)
            .ToListAsync();

    public async Task<string> GenerateEmployeeIdAsync()
    {
        var count = await _context.Employees.CountAsync();
        return $"EMP-{(count + 1):D3}";
    }
}