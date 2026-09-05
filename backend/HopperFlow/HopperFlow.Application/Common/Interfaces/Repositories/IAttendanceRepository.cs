using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HopperFlow.Domain.Entities;

namespace HopperFlow.Application.Common.Interfaces.Repositories;

public interface IAttendanceRepository : IGenericRepository<Attendance>
{
    Task<IEnumerable<Attendance>> GetByEmployeeAsync(int employeeId);
    Task<IEnumerable<Attendance>> GetByMonthAsync(int month, int year);
    Task<IEnumerable<Attendance>> GetByEmployeeAndMonthAsync(int employeeId, int month, int year);
    Task<int> GetDaysWorkedAsync(int employeeId, int month, int year);
    Task<Attendance?> GetByEmployeeAndDateAsync(int employeeId, DateTime date);
}