using HopperFlow.Application.Common.Interfaces;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Application.DTOs.Stock;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HopperFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RiceStockController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<RiceStockController> _logger;

    public RiceStockController(IUnitOfWork unitOfWork,
        ILogger<RiceStockController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    // GET: api/RiceStock
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var stocks = await _unitOfWork.RiceStocks.GetAllAsync();

            var result = stocks
                .Where(s => !s.IsDeleted)
                .Select(s => new RiceStockDto
                {
                    Id = s.Id,
                    RiceType = s.RiceType,
                    RiceTypeName = s.RiceType.ToString(),
                    QuantityKg = s.QuantityKg,
                    LowStockThresholdKg = s.LowStockThresholdKg,
                    IsLowStock = s.IsLowStock
                });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting stocks");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // GET: api/RiceStock/lowstock
    [HttpGet("lowstock")]
    public async Task<IActionResult> GetLowStock()
    {
        try
        {
            var lowStocks = await _unitOfWork.RiceStocks.GetLowStockItemsAsync();

            var result = lowStocks.Select(s => new RiceStockDto
            {
                Id = s.Id,
                RiceType = s.RiceType,
                RiceTypeName = s.RiceType.ToString(),
                QuantityKg = s.QuantityKg,
                LowStockThresholdKg = s.LowStockThresholdKg,
                IsLowStock = s.IsLowStock
            });

            _logger.LogWarning("Low stock items: {Count}", result.Count());

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting low stock");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // PUT: api/RiceStock/threshold/1
    [HttpPut("threshold/{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> UpdateThreshold(int id,
        [FromBody] decimal thresholdKg)
    {
        try
        {
            var stock = await _unitOfWork.RiceStocks.GetByIdAsync(id);

            if (stock == null || stock.IsDeleted)
                return NotFound(new { message = "Stock not found" });

            stock.LowStockThresholdKg = thresholdKg;
            stock.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.RiceStocks.UpdateAsync(stock);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation(
                "Stock threshold updated: {Id} → {Threshold}kg",
                id, thresholdKg);

            return Ok(new { message = "Threshold updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating threshold {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }
}