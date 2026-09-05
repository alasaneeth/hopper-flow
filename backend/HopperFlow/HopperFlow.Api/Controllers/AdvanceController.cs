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
public class AdvanceController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AdvanceController> _logger;

    public AdvanceController(IUnitOfWork unitOfWork,
        ILogger<AdvanceController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    // GET: api/Advance
    [HttpGet]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var advances = await _unitOfWork.Advances.GetActiveAdvancesAsync();

            var result = advances.Select(a => new AdvanceDto
            {
                Id = a.Id,
                EmployeeId = a.EmployeeId,
                EmployeeName = a.Employee?.Name ?? string.Empty,
                TotalAmount = a.TotalAmount,
                MonthlyInstallment = a.MonthlyInstallment,
                RemainingAmount = a.RemainingAmount,
                TotalMonths = a.TotalMonths,
                PaidMonths = a.PaidMonths,
                StartDate = a.StartDate,
                IsCompleted = a.IsCompleted
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting advances");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // GET: api/Advance/employee/5
    [HttpGet("employee/{employeeId}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> GetByEmployee(int employeeId)
    {
        try
        {
            var advances = await _unitOfWork.Advances.GetByEmployeeAsync(employeeId);

            var result = advances.Select(a => new AdvanceDto
            {
                Id = a.Id,
                EmployeeId = a.EmployeeId,
                EmployeeName = a.Employee?.Name ?? string.Empty,
                TotalAmount = a.TotalAmount,
                MonthlyInstallment = a.MonthlyInstallment,
                RemainingAmount = a.RemainingAmount,
                TotalMonths = a.TotalMonths,
                PaidMonths = a.PaidMonths,
                StartDate = a.StartDate,
                IsCompleted = a.IsCompleted
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting advances for employee {Id}", employeeId);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // POST: api/Advance
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateAdvanceDto dto)
    {
        try
        {
            // 1. Employee exists?
            var employee = await _unitOfWork.Employees.GetByIdAsync(dto.EmployeeId);
            if (employee == null || employee.IsDeleted)
                return BadRequest(new { message = "Invalid employee" });

            // 2. Already has active advance?
            var existing = await _unitOfWork.Advances
                .GetActiveAdvanceByEmployeeAsync(dto.EmployeeId);
            if (existing != null)
                return BadRequest(new
                {
                    message = $"Employee already has an active advance with Rs.{existing.RemainingAmount} remaining"
                });

            // 3. Calculate monthly installment
            var monthlyInstallment = Math.Round(dto.TotalAmount / dto.TotalMonths, 2);

            var advance = new Advance
            {
                EmployeeId = dto.EmployeeId,
                TotalAmount = dto.TotalAmount,
                MonthlyInstallment = monthlyInstallment,
                RemainingAmount = dto.TotalAmount,
                TotalMonths = dto.TotalMonths,
                PaidMonths = 0,
                StartDate = dto.StartDate,
                IsCompleted = false
            };

            await _unitOfWork.Advances.AddAsync(advance);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation(
                "Advance created: Employee {EmployeeId}, Total: {Total}, Monthly: {Monthly}",
                dto.EmployeeId, dto.TotalAmount, monthlyInstallment);

            return CreatedAtAction(nameof(GetByEmployee),
                new { employeeId = dto.EmployeeId },
                new
                {
                    message = "Advance created successfully",
                    id = advance.Id,
                    monthlyInstallment
                });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating advance");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // PUT: api/Advance/5/adjust-installment
    // Admin can make installment flexible
    [HttpPut("{id}/adjust-installment")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AdjustInstallment(int id, [FromBody] decimal newInstallment)
    {
        try
        {
            var advance = await _unitOfWork.Advances.GetByIdAsync(id);

            if (advance == null || advance.IsDeleted || advance.IsCompleted)
                return NotFound(new { message = "Active advance not found" });

            if (newInstallment <= 0 || newInstallment > advance.RemainingAmount)
                return BadRequest(new { message = "Invalid installment amount" });

            advance.MonthlyInstallment = newInstallment;
            advance.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Advances.UpdateAsync(advance);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation(
                "Advance installment adjusted: {Id} → Rs.{Amount}", id, newInstallment);

            return Ok(new { message = "Installment adjusted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adjusting advance {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // DELETE: api/Advance/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var advance = await _unitOfWork.Advances.GetByIdAsync(id);

            if (advance == null || advance.IsDeleted)
                return NotFound(new { message = "Advance not found" });

            advance.IsDeleted = true;
            advance.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Advances.UpdateAsync(advance);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Advance deleted: {Id}", id);

            return Ok(new { message = "Advance deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting advance {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }
}