using HopperFlow.Application.Common.Interfaces;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Application.DTOs.Preparation;
using HopperFlow.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HopperFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PreparationController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<PreparationController> _logger;

    public PreparationController(IUnitOfWork unitOfWork,
        ILogger<PreparationController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    // GET: api/Preparation
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var batches = await _unitOfWork.PreparationBatches.GetAllAsync();

            var result = batches
                .Where(b => !b.IsDeleted)
                .OrderByDescending(b => b.PreparationDate)
                .Select(b => new PreparationBatchDto
                {
                    Id = b.Id,
                    ProductType = b.ProductType,
                    ProductTypeName = b.ProductType.ToString(),
                    RiceUsedKg = b.RiceUsedKg,
                    MillingDone = b.MillingDone,
                    SievingDone = b.SievingDone,
                    DoughProducedKg = b.DoughProducedKg,
                    PreparationDate = b.PreparationDate,
                    Notes = b.Notes,
                    CreatedAt = b.CreatedAt
                });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting preparation batches");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // GET: api/Preparation/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var batch = await _unitOfWork.PreparationBatches.GetByIdAsync(id);

            if (batch == null || batch.IsDeleted)
                return NotFound(new { message = "Preparation batch not found" });

            var result = new PreparationBatchDto
            {
                Id = batch.Id,
                ProductType = batch.ProductType,
                ProductTypeName = batch.ProductType.ToString(),
                RiceUsedKg = batch.RiceUsedKg,
                MillingDone = batch.MillingDone,
                SievingDone = batch.SievingDone,
                DoughProducedKg = batch.DoughProducedKg,
                PreparationDate = batch.PreparationDate,
                Notes = batch.Notes,
                CreatedAt = batch.CreatedAt
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting preparation batch {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // POST: api/Preparation
    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Create([FromBody] CreatePreparationBatchDto dto)
    {
        try
        {
            // 1. Rice stock check
            var riceStock = await _unitOfWork.RiceStocks
                .GetByRiceTypeAsync(dto.ProductType);

            if (riceStock == null || riceStock.QuantityKg < dto.RiceUsedKg)
                return BadRequest(new
                {
                    message = $"Insufficient rice stock! Available: {riceStock?.QuantityKg ?? 0}kg, Required: {dto.RiceUsedKg}kg"
                });

            // 2. Preparation batch create
            var batch = new PreparationBatch
            {
                ProductType = dto.ProductType,
                RiceUsedKg = dto.RiceUsedKg,
                MillingDone = dto.MillingDone,
                SievingDone = dto.SievingDone,
                DoughProducedKg = dto.DoughProducedKg,
                PreparationDate = dto.PreparationDate,
                Notes = dto.Notes
            };

            await _unitOfWork.PreparationBatches.AddAsync(batch);

            // 3. Rice stock auto-deduct!
            riceStock.QuantityKg -= dto.RiceUsedKg;
            riceStock.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.RiceStocks.UpdateAsync(riceStock);

            // 4. Dough stock auto-update!
            var doughStock = await _unitOfWork.DoughStocks
                .GetByProductTypeAsync(dto.ProductType);

            if (doughStock == null)
            {
                // First time — new dough stock create
                var newDoughStock = new DoughStock
                {
                    ProductType = dto.ProductType,
                    QuantityKg = dto.DoughProducedKg,
                    LowStockThresholdKg = 5
                };
                await _unitOfWork.DoughStocks.AddAsync(newDoughStock);
            }
            else
            {
                // Existing — add பண்ணு
                doughStock.QuantityKg += dto.DoughProducedKg;
                doughStock.UpdatedAt = DateTime.UtcNow;
                await _unitOfWork.DoughStocks.UpdateAsync(doughStock);
            }

            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation(
                "Preparation batch created: {ProductType}, Rice: {Rice}kg, Dough: {Dough}kg",
                dto.ProductType, dto.RiceUsedKg, dto.DoughProducedKg);

            return CreatedAtAction(nameof(GetById),
                new { id = batch.Id },
                new
                {
                    message = "Preparation recorded, rice deducted and dough stock updated",
                    id = batch.Id,
                    remainingRiceStock = riceStock.QuantityKg,
                    doughStock = dto.DoughProducedKg
                });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating preparation batch");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // GET: api/Preparation/doughstock
    [HttpGet("doughstock")]
    public async Task<IActionResult> GetDoughStock()
    {
        try
        {
            var stocks = await _unitOfWork.DoughStocks.GetAllAsync();

            var result = stocks
                .Where(s => !s.IsDeleted)
                .Select(s => new
                {
                    s.Id,
                    s.ProductType,
                    ProductTypeName = s.ProductType.ToString(),
                    s.QuantityKg,
                    s.LowStockThresholdKg,
                    s.IsLowStock
                });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dough stock");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // DELETE: api/Preparation/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var batch = await _unitOfWork.PreparationBatches.GetByIdAsync(id);

            if (batch == null || batch.IsDeleted)
                return NotFound(new { message = "Preparation batch not found" });

            // Rice stock restore!
            var riceStock = await _unitOfWork.RiceStocks
                .GetByRiceTypeAsync(batch.ProductType);

            if (riceStock != null)
            {
                riceStock.QuantityKg += batch.RiceUsedKg;
                riceStock.UpdatedAt = DateTime.UtcNow;
                await _unitOfWork.RiceStocks.UpdateAsync(riceStock);
            }

            // Dough stock deduct!
            var doughStock = await _unitOfWork.DoughStocks
                .GetByProductTypeAsync(batch.ProductType);

            if (doughStock != null)
            {
                doughStock.QuantityKg -= batch.DoughProducedKg;
                doughStock.UpdatedAt = DateTime.UtcNow;
                await _unitOfWork.DoughStocks.UpdateAsync(doughStock);
            }

            // Soft delete
            batch.IsDeleted = true;
            batch.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.PreparationBatches.UpdateAsync(batch);

            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation(
                "Preparation batch deleted: {Id}, Rice restored: {Rice}kg, Dough deducted: {Dough}kg",
                id, batch.RiceUsedKg, batch.DoughProducedKg);

            return Ok(new { message = "Preparation deleted, rice restored and dough deducted" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting preparation batch {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }
}