using HopperFlow.Domain.Enums;

namespace HopperFlow.Application.DTOs.Production;

public class CreateProductionBatchDto
{
    public ProductType ProductType { get; set; }
    public decimal DoughUsedKg { get; set; }      
    public int HoppersProduced { get; set; }
    public bool IsSpecialOrder { get; set; } = false;
    public DateTime ProductionDate { get; set; }
    public string? Notes { get; set; }
}