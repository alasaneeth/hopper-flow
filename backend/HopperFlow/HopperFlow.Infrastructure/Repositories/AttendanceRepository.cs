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

public class AttendanceRepository : GenericRepository<Attendance>, IAttendanceRepository
{
    public AttendanceRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Attendance>> GetByEmployeeAsync(int employeeId)
        => await _context.Attendances
            .Where(a => a.EmployeeId == employeeId && !a.IsDeleted)
            .OrderByDescending(a => a.Date)
            .ToListAsync();

    public async Task<IEnumerable<Attendance>> GetByMonthAsync(int month, int year)
        => await _context.Attendances
            .Include(a => a.Employee)
            .Where(a => a.Date.Month == month &&
                        a.Date.Year == year &&
                        !a.IsDeleted)
            .OrderBy(a => a.Date)
            .ToListAsync();

    public async Task<IEnumerable<Attendance>> GetByEmployeeAndMonthAsync(
        int employeeId, int month, int year)
        => await _context.Attendances
            .Where(a => a.EmployeeId == employeeId &&
                        a.Date.Month == month &&
                        a.Date.Year == year &&
                        !a.IsDeleted)
            .OrderBy(a => a.Date)
            .ToListAsync();

    public async Task<int> GetDaysWorkedAsync(int employeeId, int month, int year)
        => await _context.Attendances
            .CountAsync(a => a.EmployeeId == employeeId &&
                             a.Date.Month == month &&
                             a.Date.Year == year &&
                             a.IsPresent &&
                             !a.IsDeleted);

    public async Task<Attendance?> GetByEmployeeAndDateAsync(int employeeId, DateTime date)
        => await _context.Attendances
            .FirstOrDefaultAsync(a => a.EmployeeId == employeeId &&
                                      a.Date.Date == date.Date &&
                                      !a.IsDeleted);
}