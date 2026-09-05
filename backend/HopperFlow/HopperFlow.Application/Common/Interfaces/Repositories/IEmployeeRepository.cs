using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HopperFlow.Domain.Entities;
using HopperFlow.Domain.Enums;

namespace HopperFlow.Application.Common.Interfaces.Repositories;

public interface IEmployeeRepository : IGenericRepository<Employee>
{
    Task<IEnumerable<Employee>> GetActiveEmployeesAsync();
    Task<IEnumerable<Employee>> GetByRoleAsync(EmployeeRole role);
    Task<string> GenerateEmployeeIdAsync();
}