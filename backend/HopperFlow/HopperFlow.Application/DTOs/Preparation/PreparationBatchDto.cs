using HopperFlow.Domain.Enums;

namespace HopperFlow.Application.DTOs.Preparation;

public class PreparationBatchDto
{
    public int Id { get; set; }
    public ProductType ProductType { get; set; }
    public string ProductTypeName { get; set; } = string.Empty;
    public decimal RiceUsedKg { get; set; }
    public bool MillingDone { get; set; }
    public bool SievingDone { get; set; }
    public decimal DoughProducedKg { get; set; }
    public DateTime PreparationDate { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}