using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HopperFlow.Domain.Entities;

namespace HopperFlow.Application.Common.Interfaces.Repositories;

public interface IAdvanceRepository : IGenericRepository<Advance>
{
    Task<IEnumerable<Advance>> GetByEmployeeAsync(int employeeId);
    Task<IEnumerable<Advance>> GetActiveAdvancesAsync();
    Task<Advance?> GetActiveAdvanceByEmployeeAsync(int employeeId);
}