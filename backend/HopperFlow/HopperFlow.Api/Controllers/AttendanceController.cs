using HopperFlow.Application.Common.Interfaces;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Application.DTOs.Payroll;
using HopperFlow.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HopperFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AttendanceController> _logger;

    public AttendanceController(IUnitOfWork unitOfWork,
        ILogger<AttendanceController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    // GET: api/Attendance/month/6/2026
    [HttpGet("month/{month}/{year}")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<IActionResult> GetByMonth(int month, int year)
    {
        try
        {
            var attendances = await _unitOfWork.Attendances.GetByMonthAsync(month, year);

            var result = attendances.Select(a => new AttendanceDto
            {
                Id = a.Id,
                EmployeeId = a.EmployeeId,
                EmployeeName = a.Employee?.Name ?? string.Empty,
                Date = a.Date,
                IsPresent = a.IsPresent
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting attendance for {Month}/{Year}", month, year);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // GET: api/Attendance/employee/5/month/6/2026
    [HttpGet("employee/{employeeId}/month/{month}/{year}")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<IActionResult> GetByEmployeeAndMonth(int employeeId, int month, int year)
    {
        try
        {
            var attendances = await _unitOfWork.Attendances
                .GetByEmployeeAndMonthAsync(employeeId, month, year);

            var result = attendances.Select(a => new AttendanceDto
            {
                Id = a.Id,
                EmployeeId = a.EmployeeId,
                EmployeeName = a.Employee?.Name ?? string.Empty,
                Date = a.Date,
                IsPresent = a.IsPresent
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting attendance for employee {Id}", employeeId);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // POST: api/Attendance/mark
    [HttpPost("mark")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<IActionResult> MarkAttendance([FromBody] MarkAttendanceDto dto)
    {
        try
        {
            // Employee exists?
            var employee = await _unitOfWork.Employees.GetByIdAsync(dto.EmployeeId);
            if (employee == null || employee.IsDeleted)
                return BadRequest(new { message = "Invalid employee" });

            // Already marked for this date?
            var existing = await _unitOfWork.Attendances
                .GetByEmployeeAndDateAsync(dto.EmployeeId, dto.Date);

            if (existing != null)
            {
                // Update existing
                existing.IsPresent = dto.IsPresent;
                existing.UpdatedAt = DateTime.UtcNow;
                await _unitOfWork.Attendances.UpdateAsync(existing);
            }
            else
            {
                // Create new
                var attendance = new Attendance
                {
                    EmployeeId = dto.EmployeeId,
                    Date = dto.Date,
                    IsPresent = dto.IsPresent
                };
                await _unitOfWork.Attendances.AddAsync(attendance);
            }

            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation(
                "Attendance marked: Employee {EmployeeId}, Date {Date}, Present: {Present}",
                dto.EmployeeId, dto.Date, dto.IsPresent);

            return Ok(new { message = "Attendance marked successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking attendance");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // POST: api/Attendance/mark-bulk
    [HttpPost("mark-bulk")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<IActionResult> MarkBulkAttendance([FromBody] List<MarkAttendanceDto> dtos)
    {
        try
        {
            foreach (var dto in dtos)
            {
                var existing = await _unitOfWork.Attendances
                    .GetByEmployeeAndDateAsync(dto.EmployeeId, dto.Date);

                if (existing != null)
                {
                    existing.IsPresent = dto.IsPresent;
                    existing.UpdatedAt = DateTime.UtcNow;
                    await _unitOfWork.Attendances.UpdateAsync(existing);
                }
                else
                {
                    var attendance = new Attendance
                    {
                        EmployeeId = dto.EmployeeId,
                        Date = dto.Date,
                        IsPresent = dto.IsPresent
                    };
                    await _unitOfWork.Attendances.AddAsync(attendance);
                }
            }

            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Bulk attendance marked for {Count} employees", dtos.Count);

            return Ok(new { message = $"Attendance marked for {dtos.Count} employees" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking bulk attendance");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }
}