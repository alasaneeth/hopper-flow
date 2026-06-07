using HopperFlow.Domain.Enums;

namespace HopperFlow.Application.DTOs.Production;

public class ProductionBatchDto
{
    public int Id { get; set; }
    public ProductType ProductType { get; set; }
    public string ProductTypeName { get; set; } = string.Empty;
    public decimal DoughUsedKg { get; set; }     
    public int HoppersProduced { get; set; }
    public bool IsSpecialOrder { get; set; }
    public DateTime ProductionDate { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}