using HopperFlow.Application.Common.Interfaces;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Application.DTOs.Payroll;
using HopperFlow.Domain.Entities;
using HopperFlow.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HopperFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PayrollController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<PayrollController> _logger;

    public PayrollController(IUnitOfWork unitOfWork,
        ILogger<PayrollController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    // GET: api/Payroll/month/6/2026
    [HttpGet("month/{month}/{year}")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<IActionResult> GetByMonth(int month, int year)
    {
        try
        {
            var payrolls = await _unitOfWork.Payrolls.GetByMonthAsync(month, year);

            var result = payrolls.Select(p => MapToDto(p));

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting payroll for {Month}/{Year}", month, year);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // GET: api/Payroll/employee/5
    [HttpGet("employee/{employeeId}")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<IActionResult> GetByEmployee(int employeeId)
    {
        try
        {
            var payrolls = await _unitOfWork.Payrolls.GetByEmployeeAsync(employeeId);

            var result = payrolls.Select(p => MapToDto(p));

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting payroll for employee {Id}", employeeId);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // POST: api/Payroll/generate
    // Generates payroll for ALL active employees for a given month
    [HttpPost("generate")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<IActionResult> GeneratePayroll([FromBody] GeneratePayrollDto dto)
    {
        try
        {
            var employees = await _unitOfWork.Employees.GetActiveEmployeesAsync();
            var generated = new List<PayrollDto>();
            var skipped = new List<string>();

            foreach (var employee in employees)
            {
                // Already generated for this month?
                var existing = await _unitOfWork.Payrolls
                    .GetByEmployeeAndMonthAsync(employee.Id, dto.Month, dto.Year);

                if (existing != null)
                {
                    skipped.Add(employee.Name);
                    continue;
                }

                // 1. Days worked
                var daysWorked = await _unitOfWork.Attendances
                    .GetDaysWorkedAsync(employee.Id, dto.Month, dto.Year);

                // 2. Basic salary calculate based on salary type
                decimal basicSalary = employee.SalaryType switch
                {
                    SalaryType.Daily => daysWorked * employee.SalaryRate,
                    SalaryType.Weekly => (daysWorked / 7m) * employee.SalaryRate,
                    SalaryType.Monthly => employee.SalaryRate,
                    _ => 0
                };

                // 3. Advance deduction
                decimal advanceDeduction = 0;
                var activeAdvance = await _unitOfWork.Advances
                    .GetActiveAdvanceByEmployeeAsync(employee.Id);

                if (activeAdvance != null)
                {
                    advanceDeduction = Math.Min(
                        activeAdvance.MonthlyInstallment,
                        activeAdvance.RemainingAmount);

                    activeAdvance.RemainingAmount -= advanceDeduction;
                    activeAdvance.PaidMonths += 1;
                    activeAdvance.UpdatedAt = DateTime.UtcNow;

                    if (activeAdvance.RemainingAmount <= 0 ||
                        activeAdvance.PaidMonths >= activeAdvance.TotalMonths)
                    {
                        activeAdvance.IsCompleted = true;
                    }

                    await _unitOfWork.Advances.UpdateAsync(activeAdvance);
                }

                // 4. Net salary
                var netSalary = basicSalary + dto.Bonus - advanceDeduction;

                // 5. Create payroll record
                var payroll = new Payroll
                {
                    EmployeeId = employee.Id,
                    Month = dto.Month,
                    Year = dto.Year,
                    DaysWorked = daysWorked,
                    BasicSalary = basicSalary,
                    Bonus = dto.Bonus,
                    AdvanceDeduction = advanceDeduction,
                    NetSalary = netSalary > 0 ? netSalary : 0,
                    IsPaid = false
                };

                await _unitOfWork.Payrolls.AddAsync(payroll);
                generated.Add(MapToDto(payroll, employee));
            }

            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation(
                "Payroll generated for {Month}/{Year}: {Generated} employees, {Skipped} skipped",
                dto.Month, dto.Year, generated.Count, skipped.Count);

            return Ok(new
            {
                message = $"Payroll generated for {generated.Count} employees",
                generatedCount = generated.Count,
                skipped
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating payroll: {Message} | Inner: {Inner}",
                ex.Message, ex.InnerException?.Message);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // PUT: api/Payroll/5/mark-paid
    [HttpPut("{id}/mark-paid")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> MarkAsPaid(int id)
    {
        try
        {
            var payroll = await _unitOfWork.Payrolls.GetByIdAsync(id);

            if (payroll == null || payroll.IsDeleted)
                return NotFound(new { message = "Payroll record not found" });

            payroll.IsPaid = true;
            payroll.PaidDate = DateTime.UtcNow;
            payroll.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Payrolls.UpdateAsync(payroll);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Payroll marked as paid: {Id}", id);

            return Ok(new { message = "Payroll marked as paid" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking payroll as paid {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    private static PayrollDto MapToDto(Payroll p, Employee? employee = null)
    {
        var emp = employee ?? p.Employee;
        return new PayrollDto
        {
            Id = p.Id,
            EmployeeId = p.EmployeeId,
            EmployeeName = emp?.Name ?? string.Empty,
            EmployeeIdCard = emp?.EmployeeId ?? string.Empty,
            Role = emp?.Role ?? EmployeeRole.Other,
            RoleName = emp?.Role.ToString() ?? string.Empty,
            SalaryType = emp?.SalaryType ?? SalaryType.Monthly,
            SalaryTypeName = emp?.SalaryType.ToString() ?? string.Empty,
            Month = p.Month,
            Year = p.Year,
            DaysWorked = p.DaysWorked,
            SalaryRate = emp?.SalaryRate ?? 0,
            BasicSalary = p.BasicSalary,
            Bonus = p.Bonus,
            AdvanceDeduction = p.AdvanceDeduction,
            NetSalary = p.NetSalary,
            IsPaid = p.IsPaid,
            PaidDate = p.PaidDate
        };
    }
}