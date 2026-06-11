using HopperFlow.Application.Common.Interfaces;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Application.DTOs.Sales;
using HopperFlow.Domain.Entities;
using HopperFlow.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HopperFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SalesOrderController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<SalesOrderController> _logger;

    public SalesOrderController(IUnitOfWork unitOfWork,
        ILogger<SalesOrderController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    // GET: api/SalesOrder
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var orders = await _unitOfWork.SalesOrders.GetAllAsync();

            var result = orders.Select(o => new SalesOrderDto
            {
                Id = o.Id,
                CustomerId = o.CustomerId,
                CustomerName = o.Customer?.Name ?? string.Empty,
                OrderDate = o.OrderDate,
                WhiteHopperCount = o.WhiteHopperCount,
                WhiteHopperPrice = o.WhiteHopperPrice,
                RedHopperCount = o.RedHopperCount,
                RedHopperPrice = o.RedHopperPrice,
                TotalAmount = o.TotalAmount,
                PaidAmount = o.PaidAmount,
                OutstandingAmount = o.OutstandingAmount,
                PaymentStatus = o.PaymentStatus,
                PaymentStatusName = o.PaymentStatus.ToString(),
                Notes = o.Notes,
                CreatedAt = o.CreatedAt,
                Payments = o.Payments
                    .Where(p => !p.IsDeleted)
                    .Select(p => new PaymentDto
                    {
                        Id = p.Id,
                        SalesOrderId = p.SalesOrderId,
                        AmountPaid = p.AmountPaid,
                        PaymentDate = p.PaymentDate,
                        Notes = p.Notes
                    }).ToList()
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting sales orders");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // GET: api/SalesOrder/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var order = await _unitOfWork.SalesOrders.GetOrderWithPaymentsAsync(id);

            if (order == null)
                return NotFound(new { message = "Order not found" });

            var result = new SalesOrderDto
            {
                Id = order.Id,
                CustomerId = order.CustomerId,
                CustomerName = order.Customer?.Name ?? string.Empty,
                OrderDate = order.OrderDate,
                WhiteHopperCount = order.WhiteHopperCount,
                WhiteHopperPrice = order.WhiteHopperPrice,
                RedHopperCount = order.RedHopperCount,
                RedHopperPrice = order.RedHopperPrice,
                TotalAmount = order.TotalAmount,
                PaidAmount = order.PaidAmount,
                OutstandingAmount = order.OutstandingAmount,
                PaymentStatus = order.PaymentStatus,
                PaymentStatusName = order.PaymentStatus.ToString(),
                Notes = order.Notes,
                CreatedAt = order.CreatedAt,
                Payments = order.Payments
                    .Where(p => !p.IsDeleted)
                    .Select(p => new PaymentDto
                    {
                        Id = p.Id,
                        SalesOrderId = p.SalesOrderId,
                        AmountPaid = p.AmountPaid,
                        PaymentDate = p.PaymentDate,
                        Notes = p.Notes
                    }).ToList()
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting order {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // POST: api/SalesOrder
    [HttpPost]
    [Authorize(Roles = "Admin,Manager,Cashier")]
    public async Task<IActionResult> Create([FromBody] CreateSalesOrderDto dto)
    {
        try
        {
            // 1. Customer exists?
            var customer = await _unitOfWork.Customers.GetByIdAsync(dto.CustomerId);
            if (customer == null || customer.IsDeleted)
                return BadRequest(new { message = "Invalid customer" });

            // 2. Total amount calculate
            var totalAmount =
                (dto.WhiteHopperCount * dto.WhiteHopperPrice) +
                (dto.RedHopperCount * dto.RedHopperPrice);

            // 3. Outstanding calculate
            var outstandingAmount = totalAmount - dto.PaidAmount;

            // 4. Payment status determine
            var paymentStatus = outstandingAmount <= 0
                ? PaymentStatus.Paid
                : dto.PaidAmount > 0
                    ? PaymentStatus.Partial
                    : PaymentStatus.Pending;

            // 5. Order create
            var order = new SalesOrder
            {
                CustomerId = dto.CustomerId,
                OrderDate = dto.OrderDate,
                WhiteHopperCount = dto.WhiteHopperCount,
                WhiteHopperPrice = dto.WhiteHopperPrice,
                RedHopperCount = dto.RedHopperCount,
                RedHopperPrice = dto.RedHopperPrice,
                TotalAmount = totalAmount,
                PaidAmount = dto.PaidAmount,
                OutstandingAmount = outstandingAmount > 0 ? outstandingAmount : 0,
                PaymentStatus = paymentStatus,
                Notes = dto.Notes
            };

            await _unitOfWork.SalesOrders.AddAsync(order);

            // 6. Initial payment record (if paid)
            if (dto.PaidAmount > 0)
            {
                var payment = new Payment
                {
                    SalesOrderId = order.Id,
                    AmountPaid = dto.PaidAmount,
                    PaymentDate = dto.OrderDate,
                    Notes = "Initial payment"
                };
                await _unitOfWork.Payments.AddAsync(payment);
            }

            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation(
                "Sales order created: Customer {CustomerId}, Total: {Total}, Outstanding: {Outstanding}",
                dto.CustomerId, totalAmount, outstandingAmount);

            return CreatedAtAction(nameof(GetById),
                new { id = order.Id },
                new
                {
                    message = "Sales order created successfully",
                    id = order.Id,
                    totalAmount,
                    outstandingAmount = order.OutstandingAmount,
                    paymentStatus = paymentStatus.ToString()
                });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating sales order");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // POST: api/SalesOrder/5/payment
    [HttpPost("{id}/payment")]
    [Authorize(Roles = "Admin,Manager,Cashier")]
    public async Task<IActionResult> AddPayment(int id, [FromBody] AddPaymentDto dto)
    {
        try
        {
            var order = await _unitOfWork.SalesOrders.GetOrderWithPaymentsAsync(id);

            if (order == null)
                return NotFound(new { message = "Order not found" });

            if (order.PaymentStatus == PaymentStatus.Paid)
                return BadRequest(new { message = "Order already fully paid" });

            if (dto.AmountPaid > order.OutstandingAmount)
                return BadRequest(new
                {
                    message = $"Payment exceeds outstanding amount! Outstanding: Rs.{order.OutstandingAmount}"
                });

            // Payment record
            var payment = new Payment
            {
                SalesOrderId = id,
                AmountPaid = dto.AmountPaid,
                PaymentDate = dto.PaymentDate,
                Notes = dto.Notes
            };

            await _unitOfWork.Payments.AddAsync(payment);

            // Update order
            order.PaidAmount += dto.AmountPaid;
            order.OutstandingAmount -= dto.AmountPaid;
            order.UpdatedAt = DateTime.UtcNow;

            // Update payment status
            order.PaymentStatus = order.OutstandingAmount <= 0
                ? PaymentStatus.Paid
                : PaymentStatus.Partial;

            await _unitOfWork.SalesOrders.UpdateAsync(order);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation(
                "Payment added: Order {Id}, Amount: {Amount}, Remaining: {Remaining}",
                id, dto.AmountPaid, order.OutstandingAmount);

            return Ok(new
            {
                message = "Payment recorded successfully",
                paidAmount = dto.AmountPaid,
                totalPaid = order.PaidAmount,
                remainingOutstanding = order.OutstandingAmount,
                paymentStatus = order.PaymentStatus.ToString()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding payment to order {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // GET: api/SalesOrder/pending
    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingOrders()
    {
        try
        {
            var pending = await _unitOfWork.SalesOrders
                .GetByPaymentStatusAsync(PaymentStatus.Pending);
            var partial = await _unitOfWork.SalesOrders
                .GetByPaymentStatusAsync(PaymentStatus.Partial);

            var result = pending.Concat(partial)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new SalesOrderDto
                {
                    Id = o.Id,
                    CustomerId = o.CustomerId,
                    CustomerName = o.Customer?.Name ?? string.Empty,
                    OrderDate = o.OrderDate,
                    WhiteHopperCount = o.WhiteHopperCount,
                    WhiteHopperPrice = o.WhiteHopperPrice,
                    RedHopperCount = o.RedHopperCount,
                    RedHopperPrice = o.RedHopperPrice,
                    TotalAmount = o.TotalAmount,
                    PaidAmount = o.PaidAmount,
                    OutstandingAmount = o.OutstandingAmount,
                    PaymentStatus = o.PaymentStatus,
                    PaymentStatusName = o.PaymentStatus.ToString(),
                    Notes = o.Notes,
                    CreatedAt = o.CreatedAt,
                });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting pending orders");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    // DELETE: api/SalesOrder/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var order = await _unitOfWork.SalesOrders.GetByIdAsync(id);

            if (order == null || order.IsDeleted)
                return NotFound(new { message = "Order not found" });

            order.IsDeleted = true;
            order.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.SalesOrders.UpdateAsync(order);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Sales order deleted: {Id}", id);

            return Ok(new { message = "Order deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting order {Id}", id);
            return StatusCode(500, new { message = "An error occurred" });
        }
    }
}