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
                    DoughUsedKg = b.DoughUsedKg,
                    HoppersProduced = b.HoppersProduced,
                    IsSpecialOrder = b.IsSpecialOrder,
                    ProductionDate = b.ProductionDate,
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
                DoughUsedKg = batch.DoughUsedKg,
                HoppersProduced = batch.HoppersProduced,
                IsSpecialOrder = batch.IsSpecialOrder,
                ProductionDate = batch.ProductionDate,
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
            // 1. Dough stock check
            var doughStock = await _unitOfWork.DoughStocks
                .GetByProductTypeAsync(dto.ProductType);

            if (doughStock == null || doughStock.QuantityKg < dto.DoughUsedKg)
                return BadRequest(new
                {
                    message = $"Insufficient dough stock! Available: {doughStock?.QuantityKg ?? 0}kg, Required: {dto.DoughUsedKg}kg"
                });

            // 2. Production batch create
            var batch = new ProductionBatch
            {
                ProductType = dto.ProductType,
                DoughUsedKg = dto.DoughUsedKg,
                HoppersProduced = dto.HoppersProduced,
                IsSpecialOrder = dto.IsSpecialOrder,
                ProductionDate = dto.ProductionDate,
                Notes = dto.Notes
            };

            await _unitOfWork.ProductionBatches.AddAsync(batch);

            // 3. Dough stock auto-deduct!
            doughStock.QuantityKg -= dto.DoughUsedKg;
            doughStock.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.DoughStocks.UpdateAsync(doughStock);

            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation(
                "Production batch created: {ProductType} {Hoppers} hoppers, {Dough}kg dough used",
                dto.ProductType, dto.HoppersProduced, dto.DoughUsedKg);

            return CreatedAtAction(nameof(GetById),
                new { id = batch.Id },
                new
                {
                    message = "Production batch recorded and dough stock updated",
                    id = batch.Id,
                    remainingDoughStock = doughStock.QuantityKg
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
                DoughUsedKg = b.DoughUsedKg,
                HoppersProduced = b.HoppersProduced,
                IsSpecialOrder = b.IsSpecialOrder,
                ProductionDate = b.ProductionDate,
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

            // Dough stock restore!
            var doughStock = await _unitOfWork.DoughStocks
                .GetByProductTypeAsync(batch.ProductType);

            if (doughStock != null)
            {
                doughStock.QuantityKg += batch.DoughUsedKg;
                doughStock.UpdatedAt = DateTime.UtcNow;
                await _unitOfWork.DoughStocks.UpdateAsync(doughStock);
            }

            batch.IsDeleted = true;
            batch.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.ProductionBatches.UpdateAsync(batch);

            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation(
                "Production batch deleted: {Id}, Dough restored: {Kg}kg",
                id, batch.DoughUsedKg);

            return Ok(new { message = "Batch deleted and dough stock restored" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting production batch {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }
}