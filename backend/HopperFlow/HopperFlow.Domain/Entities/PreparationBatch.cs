using HopperFlow.Domain.Common;
using HopperFlow.Domain.Enums;

namespace HopperFlow.Domain.Entities;

public class PreparationBatch : BaseEntity
{
    public ProductType ProductType { get; set; }

    // Team 1 inputs
    public decimal RiceUsedKg { get; set; }
    public bool MillingDone { get; set; } = false;
    public bool SievingDone { get; set; } = false;

    // Team 1 output
    public decimal DoughProducedKg { get; set; }

    public DateTime PreparationDate { get; set; }
    public string? Notes { get; set; }
}