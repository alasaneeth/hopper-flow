using HopperFlow.Application.Common.Interfaces;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Application.DTOs.Supplier;
using HopperFlow.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HopperFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SupplierController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<SupplierController> _logger;

    public SupplierController(IUnitOfWork unitOfWork,
        ILogger<SupplierController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    // GET: api/Supplier
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var suppliers = await _unitOfWork.Suppliers.GetAllAsync();

            var result = suppliers
                .Where(s => !s.IsDeleted)
                .Select(s => new SupplierDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    ContactNumber = s.ContactNumber,
                    Address = s.Address,
                    IsActive = s.IsActive
                });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting suppliers");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // GET: api/Supplier/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var supplier = await _unitOfWork.Suppliers.GetByIdAsync(id);

            if (supplier == null || supplier.IsDeleted)
                return NotFound(new { message = "Supplier not found" });

            var result = new SupplierDto
            {
                Id = supplier.Id,
                Name = supplier.Name,
                ContactNumber = supplier.ContactNumber,
                Address = supplier.Address,
                IsActive = supplier.IsActive
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting supplier {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // POST: api/Supplier
    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Create([FromBody] CreateSupplierDto dto)
    {
        try
        {
            var supplier = new Supplier
            {
                Name = dto.Name,
                ContactNumber = dto.ContactNumber,
                Address = dto.Address,
                IsActive = true
            };

            await _unitOfWork.Suppliers.AddAsync(supplier);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Supplier created: {Name}", dto.Name);

            return CreatedAtAction(nameof(GetById),
                new { id = supplier.Id },
                new { message = "Supplier created successfully", id = supplier.Id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating supplier");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // PUT: api/Supplier/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSupplierDto dto)
    {
        try
        {
            var supplier = await _unitOfWork.Suppliers.GetByIdAsync(id);

            if (supplier == null || supplier.IsDeleted)
                return NotFound(new { message = "Supplier not found" });

            supplier.Name = dto.Name;
            supplier.ContactNumber = dto.ContactNumber;
            supplier.Address = dto.Address;
            supplier.IsActive = dto.IsActive;
            supplier.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Suppliers.UpdateAsync(supplier);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Supplier updated: {Id}", id);

            return Ok(new { message = "Supplier updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating supplier {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // DELETE: api/Supplier/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var supplier = await _unitOfWork.Suppliers.GetByIdAsync(id);

            if (supplier == null || supplier.IsDeleted)
                return NotFound(new { message = "Supplier not found" });

            // Soft delete
            supplier.IsDeleted = true;
            supplier.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Suppliers.UpdateAsync(supplier);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Supplier deleted: {Id}", id);

            return Ok(new { message = "Supplier deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting supplier {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }
}