using HopperFlow.Application.Common.Interfaces;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Application.DTOs.Customer;
using HopperFlow.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HopperFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CustomerController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CustomerController> _logger;

    public CustomerController(IUnitOfWork unitOfWork,
        ILogger<CustomerController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    // GET: api/Customer
    [HttpGet]
    [Authorize(Roles = "Admin,Manager,Cashier")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var customers = await _unitOfWork.Customers.GetAllAsync();

            var result = customers
                .Where(c => !c.IsDeleted)
                .Select(c => new CustomerDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Phone = c.Phone,
                    Address = c.Address,
                    IsActive = c.IsActive,
                    TotalOutstanding = c.SalesOrders
                        .Where(o => !o.IsDeleted)
                        .Sum(o => o.OutstandingAmount)
                });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting customers");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // GET: api/Customer/5
    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Manager,Cashier")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var customer = await _unitOfWork.Customers
                .GetCustomerWithOrdersAsync(id);

            if (customer == null)
                return NotFound(new { message = "Customer not found" });

            var result = new CustomerDto
            {
                Id = customer.Id,
                Name = customer.Name,
                Phone = customer.Phone,
                Address = customer.Address,
                IsActive = customer.IsActive,
                TotalOutstanding = customer.SalesOrders
                    .Where(o => !o.IsDeleted)
                    .Sum(o => o.OutstandingAmount)
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting customer {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // POST: api/Customer
    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Create([FromBody] CreateCustomerDto dto)
    {
        try
        {
            var customer = new Customer
            {
                Name = dto.Name,
                Phone = dto.Phone,
                Address = dto.Address,
                IsActive = true
            };

            await _unitOfWork.Customers.AddAsync(customer);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Customer created: {Name}", dto.Name);

            return CreatedAtAction(nameof(GetById),
                new { id = customer.Id },
                new { message = "Customer created successfully", id = customer.Id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating customer");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // PUT: api/Customer/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCustomerDto dto)
    {
        try
        {
            var customer = await _unitOfWork.Customers.GetByIdAsync(id);

            if (customer == null || customer.IsDeleted)
                return NotFound(new { message = "Customer not found" });

            customer.Name = dto.Name;
            customer.Phone = dto.Phone;
            customer.Address = dto.Address;
            customer.IsActive = dto.IsActive;
            customer.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Customers.UpdateAsync(customer);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Customer updated: {Id}", id);

            return Ok(new { message = "Customer updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating customer {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // DELETE: api/Customer/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var customer = await _unitOfWork.Customers.GetByIdAsync(id);

            if (customer == null || customer.IsDeleted)
                return NotFound(new { message = "Customer not found" });

            customer.IsDeleted = true;
            customer.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Customers.UpdateAsync(customer);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Customer deleted: {Id}", id);

            return Ok(new { message = "Customer deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting customer {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }
}