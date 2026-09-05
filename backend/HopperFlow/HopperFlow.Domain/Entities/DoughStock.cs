using HopperFlow.Domain.Common;
using HopperFlow.Domain.Enums;

namespace HopperFlow.Domain.Entities;

public class DoughStock : BaseEntity
{
    public ProductType ProductType { get; set; }
    public decimal QuantityKg { get; set; }
    public decimal LowStockThresholdKg { get; set; } = 5;
    public bool IsLowStock => QuantityKg <= LowStockThresholdKg;
}