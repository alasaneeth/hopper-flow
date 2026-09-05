using HopperFlow.Domain.Common;
using HopperFlow.Domain.Enums;

namespace HopperFlow.Domain.Entities;

public class ProductionBatch : BaseEntity
{
    public ProductType ProductType { get; set; }

    // Team 2 input — Dough (Team 1 output)
    public decimal DoughUsedKg { get; set; }

    // Team 2 output
    public int HoppersProduced { get; set; }

    public bool IsSpecialOrder { get; set; } = false;
    public DateTime ProductionDate { get; set; }
    public string? Notes { get; set; }
}