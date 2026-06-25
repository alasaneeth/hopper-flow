using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Application.DTOs.Purchase;
using HopperFlow.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HopperFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RicePurchaseController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<RicePurchaseController> _logger;

        public RicePurchaseController(IUnitOfWork unitOfWork,
         ILogger<RicePurchaseController> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        // GET: api/RicePurchase
        [HttpGet]
        [Authorize(Roles = "Admin,Manager,InventoryManager")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var purchases = await _unitOfWork.RicePurchases.GetAllAsync();

                var result = purchases
                    .Where(p => !p.IsDeleted)
                    .Select(p => new RicePurchaseDto
                    {
                        Id = p.Id,
                        SupplierId = p.SupplierId,
                        SupplierName = p.Supplier?.Name ?? string.Empty,
                        RiceType = p.RiceType,
                        RiceTypeName = p.RiceType.ToString(),
                        QuantityKg = p.QuantityKg,
                        PricePerKg = p.PricePerKg,
                        TotalAmount = p.TotalAmount,
                        PurchaseDate = p.PurchaseDate,
                        Notes = p.Notes
                    });

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting purchases");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }

        // GET: api/RicePurchase/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Manager,InventoryManager")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var purchase = await _unitOfWork.RicePurchases.GetByIdAsync(id);

                if (purchase == null || purchase.IsDeleted)
                    return NotFound(new { message = "Purchase not found" });

                var result = new RicePurchaseDto
                {
                    Id = purchase.Id,
                    SupplierId = purchase.SupplierId,
                    SupplierName = purchase.Supplier?.Name ?? string.Empty,
                    RiceType = purchase.RiceType,
                    RiceTypeName = purchase.RiceType.ToString(),
                    QuantityKg = purchase.QuantityKg,
                    PricePerKg = purchase.PricePerKg,
                    TotalAmount = purchase.TotalAmount,
                    PurchaseDate = purchase.PurchaseDate,
                    Notes = purchase.Notes
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting purchase {Id}", id);
                return StatusCode(500, new { message = "An error occurred" });
            }
        }

        // POST: api/RicePurchase
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateRicePurchaseDto dto)
        {
            try
            {
                // 1. Supplier exists?
                var supplier = await _unitOfWork.Suppliers.GetByIdAsync(dto.SupplierId);
                if (supplier == null || supplier.IsDeleted)
                    return BadRequest(new { message = "Invalid supplier" });

                // 2. Total amount calculate
                var totalAmount = dto.QuantityKg * dto.PricePerKg;

                // 3. Purchase create
                var purchase = new RicePurchase
                {
                    SupplierId = dto.SupplierId,
                    RiceType = dto.RiceType,
                    QuantityKg = dto.QuantityKg,
                    PricePerKg = dto.PricePerKg,
                    TotalAmount = totalAmount,
                    PurchaseDate = dto.PurchaseDate,
                    Notes = dto.Notes
                };

                await _unitOfWork.RicePurchases.AddAsync(purchase);

                // 4. Stock update — auto!
                var stock = await _unitOfWork.RiceStocks
                    .GetByRiceTypeAsync(dto.RiceType);

                if (stock == null)
                {
                    // First time — new stock record create
                    var newStock = new RiceStock
                    {
                        RiceType = dto.RiceType,
                        QuantityKg = dto.QuantityKg,
                        LowStockThresholdKg = 10
                    };
                    await _unitOfWork.RiceStocks.AddAsync(newStock);
                }
                else
                {
                    // Existing stock — add பண்ணு
                    stock.QuantityKg += dto.QuantityKg;
                    stock.UpdatedAt = DateTime.UtcNow;
                    await _unitOfWork.RiceStocks.UpdateAsync(stock);
                }

                await _unitOfWork.SaveChangesAsync();

                _logger.LogInformation(
                    "Rice purchase created: {RiceType} {Quantity}kg",
                    dto.RiceType, dto.QuantityKg);

                return CreatedAtAction(nameof(GetById),
                    new { id = purchase.Id },
                    new { message = "Purchase created and stock updated", id = purchase.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating purchase");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }

        // DELETE: api/RicePurchase/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var purchase = await _unitOfWork.RicePurchases.GetByIdAsync(id);

                if (purchase == null || purchase.IsDeleted)
                    return NotFound(new { message = "Purchase not found" });

                // Soft delete
                purchase.IsDeleted = true;
                purchase.UpdatedAt = DateTime.UtcNow;

                await _unitOfWork.RicePurchases.UpdateAsync(purchase);
                await _unitOfWork.SaveChangesAsync();

                _logger.LogInformation("Purchase deleted: {Id}", id);

                return Ok(new { message = "Purchase deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting purchase {Id}", id);
                return StatusCode(500, new { message = "An error occurred" });
            }
        }
    }
}