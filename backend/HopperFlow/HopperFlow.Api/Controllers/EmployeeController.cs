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
public class EmployeeController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<EmployeeController> _logger;

    public EmployeeController(IUnitOfWork unitOfWork,
        ILogger<EmployeeController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    // GET: api/Employee
    [HttpGet]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var employees = await _unitOfWork.Employees.GetAllAsync();

            var result = employees
                .Where(e => !e.IsDeleted)
                .OrderBy(e => e.Name)
                .Select(e => new EmployeeDto
                {
                    Id = e.Id,
                    EmployeeId = e.EmployeeId,
                    Name = e.Name,
                    Phone = e.Phone,
                    Role = e.Role,
                    RoleName = e.Role.ToString(),
                    SalaryType = e.SalaryType,
                    SalaryTypeName = e.SalaryType.ToString(),
                    SalaryRate = e.SalaryRate,
                    JoinDate = e.JoinDate,
                    IsActive = e.IsActive
                });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting employees");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // GET: api/Employee/5
    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var employee = await _unitOfWork.Employees.GetByIdAsync(id);

            if (employee == null || employee.IsDeleted)
                return NotFound(new { message = "Employee not found" });

            var result = new EmployeeDto
            {
                Id = employee.Id,
                EmployeeId = employee.EmployeeId,
                Name = employee.Name,
                Phone = employee.Phone,
                Role = employee.Role,
                RoleName = employee.Role.ToString(),
                SalaryType = employee.SalaryType,
                SalaryTypeName = employee.SalaryType.ToString(),
                SalaryRate = employee.SalaryRate,
                JoinDate = employee.JoinDate,
                IsActive = employee.IsActive
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting employee {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // POST: api/Employee
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
    {
        try
        {
            // Auto-generate EmployeeId
            var employeeId = await _unitOfWork.Employees.GenerateEmployeeIdAsync();

            var employee = new Employee
            {
                EmployeeId = employeeId,
                Name = dto.Name,
                Phone = dto.Phone,
                Role = dto.Role,
                SalaryType = dto.SalaryType,
                SalaryRate = dto.SalaryRate,
                JoinDate = dto.JoinDate,
                IsActive = true
            };

            await _unitOfWork.Employees.AddAsync(employee);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Employee created: {EmployeeId} - {Name}",
                employeeId, dto.Name);

            return CreatedAtAction(nameof(GetById),
                new { id = employee.Id },
                new { message = "Employee created successfully", id = employee.Id, employeeId });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating employee");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // PUT: api/Employee/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEmployeeDto dto)
    {
        try
        {
            var employee = await _unitOfWork.Employees.GetByIdAsync(id);

            if (employee == null || employee.IsDeleted)
                return NotFound(new { message = "Employee not found" });

            employee.Name = dto.Name;
            employee.Phone = dto.Phone;
            employee.Role = dto.Role;
            employee.SalaryType = dto.SalaryType;
            employee.SalaryRate = dto.SalaryRate;
            employee.IsActive = dto.IsActive;
            employee.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Employees.UpdateAsync(employee);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Employee updated: {Id}", id);

            return Ok(new { message = "Employee updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating employee {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // DELETE: api/Employee/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var employee = await _unitOfWork.Employees.GetByIdAsync(id);

            if (employee == null || employee.IsDeleted)
                return NotFound(new { message = "Employee not found" });

            employee.IsDeleted = true;
            employee.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Employees.UpdateAsync(employee);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Employee deleted: {Id}", id);

            return Ok(new { message = "Employee deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting employee {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }
}