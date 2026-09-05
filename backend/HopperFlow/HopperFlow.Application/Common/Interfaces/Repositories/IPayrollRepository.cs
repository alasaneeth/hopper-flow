using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HopperFlow.Domain.Entities;

namespace HopperFlow.Application.Common.Interfaces.Repositories;

public interface IPayrollRepository : IGenericRepository<Payroll>
{
    Task<IEnumerable<Payroll>> GetByEmployeeAsync(int employeeId);
    Task<IEnumerable<Payroll>> GetByMonthAsync(int month, int year);
    Task<Payroll?> GetByEmployeeAndMonthAsync(int employeeId, int month, int year);
}