using HopperFlow.Domain.Enums;

namespace HopperFlow.Application.DTOs.Preparation;

public class CreatePreparationBatchDto
{
    public ProductType ProductType { get; set; }
    public decimal RiceUsedKg { get; set; }
    public bool MillingDone { get; set; }
    public bool SievingDone { get; set; }
    public decimal DoughProducedKg { get; set; }
    public DateTime PreparationDate { get; set; }
    public string? Notes { get; set; }
}