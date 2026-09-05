using HopperFlow.Domain.Enums;

namespace HopperFlow.Application.DTOs.Stock;

public class DoughStockDto
{
    public int Id { get; set; }
    public ProductType ProductType { get; set; }
    public string ProductTypeName { get; set; } = string.Empty;
    public decimal QuantityKg { get; set; }
    public decimal LowStockThresholdKg { get; set; }
    public bool IsLowStock { get; set; }
}