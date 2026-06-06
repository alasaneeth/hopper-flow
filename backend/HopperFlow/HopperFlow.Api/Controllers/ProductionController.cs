using HopperFlow.Application.Common.Interfaces;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Application.DTOs.Production;
using HopperFlow.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HopperFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductionController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ProductionController> _logger;

    public ProductionController(IUnitOfWork unitOfWork,
        ILogger<ProductionController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    // GET: api/Production
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var batches = await _unitOfWork.ProductionBatches.GetAllAsync();

            var result = batches
                .Where(b => !b.IsDeleted)
                .OrderByDescending(b => b.ProductionDate)
                .Select(b => new ProductionBatchDto
                {
                    Id = b.Id,
                    ProductType = b.ProductType,
                    ProductTypeName = b.ProductType.ToString(),
                    RiceUsedKg = b.RiceUsedKg,
                    HoppersProduced = b.HoppersProduced,
                    WastageKg = b.WastageKg,
                    WastagePercentage = b.RiceUsedKg > 0
                        ? Math.Round((b.WastageKg / b.RiceUsedKg) * 100, 2)
                        : 0,
                    ProductionDate = b.ProductionDate,
                    IsSpecialOrder = b.IsSpecialOrder,
                    Notes = b.Notes,
                    CreatedAt = b.CreatedAt
                });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting production batches");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // GET: api/Production/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var batch = await _unitOfWork.ProductionBatches.GetByIdAsync(id);

            if (batch == null || batch.IsDeleted)
                return NotFound(new { message = "Production batch not found" });

            var result = new ProductionBatchDto
            {
                Id = batch.Id,
                ProductType = batch.ProductType,
                ProductTypeName = batch.ProductType.ToString(),
                RiceUsedKg = batch.RiceUsedKg,
                HoppersProduced = batch.HoppersProduced,
                WastageKg = batch.WastageKg,
                WastagePercentage = batch.RiceUsedKg > 0
                    ? Math.Round((batch.WastageKg / batch.RiceUsedKg) * 100, 2)
                    : 0,
                ProductionDate = batch.ProductionDate,
                IsSpecialOrder = batch.IsSpecialOrder,
                Notes = batch.Notes,
                CreatedAt = batch.CreatedAt
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting production batch {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // POST: api/Production
    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Create([FromBody] CreateProductionBatchDto dto)
    {
        try
        {
            // 1. Stock check பண்ணு
            var stock = await _unitOfWork.RiceStocks
                .GetByRiceTypeAsync(dto.ProductType);

            if (stock == null || stock.QuantityKg < dto.RiceUsedKg)
                return BadRequest(new
                {
                    message = $"Insufficient stock! Available: {stock?.QuantityKg ?? 0}kg, Required: {dto.RiceUsedKg}kg"
                });

            // 2. Production batch create
            var batch = new ProductionBatch
            {
                ProductType = dto.ProductType,
                RiceUsedKg = dto.RiceUsedKg,
                HoppersProduced = dto.HoppersProduced,
                WastageKg = dto.WastageKg,
                ProductionDate = dto.ProductionDate,
                IsSpecialOrder = dto.IsSpecialOrder,
                Notes = dto.Notes
            };

            await _unitOfWork.ProductionBatches.AddAsync(batch);

            // 3. Rice stock auto-deduct!
            stock.QuantityKg -= dto.RiceUsedKg;
            stock.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.RiceStocks.UpdateAsync(stock);

            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation(
                "Production batch created: {ProductType} {Hoppers} hoppers, {Rice}kg rice used",
                dto.ProductType, dto.HoppersProduced, dto.RiceUsedKg);

            return CreatedAtAction(nameof(GetById),
                new { id = batch.Id },
                new
                {
                    message = "Production batch recorded and stock updated",
                    id = batch.Id,
                    remainingStock = stock.QuantityKg
                });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating production batch");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // GET: api/Production/special-orders
    [HttpGet("special-orders")]
    public async Task<IActionResult> GetSpecialOrders()
    {
        try
        {
            var batches = await _unitOfWork.ProductionBatches.GetSpecialOrdersAsync();

            var result = batches.Select(b => new ProductionBatchDto
            {
                Id = b.Id,
                ProductType = b.ProductType,
                ProductTypeName = b.ProductType.ToString(),
                RiceUsedKg = b.RiceUsedKg,
                HoppersProduced = b.HoppersProduced,
                WastageKg = b.WastageKg,
                WastagePercentage = b.RiceUsedKg > 0
                    ? Math.Round((b.WastageKg / b.RiceUsedKg) * 100, 2)
                    : 0,
                ProductionDate = b.ProductionDate,
                IsSpecialOrder = b.IsSpecialOrder,
                Notes = b.Notes,
                CreatedAt = b.CreatedAt
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting special orders");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // DELETE: api/Production/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var batch = await _unitOfWork.ProductionBatches.GetByIdAsync(id);

            if (batch == null || batch.IsDeleted)
                return NotFound(new { message = "Production batch not found" });

            batch.IsDeleted = true;
            batch.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.ProductionBatches.UpdateAsync(batch);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Production batch deleted: {Id}", id);

            return Ok(new { message = "Production batch deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting production batch {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }
}