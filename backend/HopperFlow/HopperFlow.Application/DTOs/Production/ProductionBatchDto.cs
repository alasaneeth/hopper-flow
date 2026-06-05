using HopperFlow.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Application.DTOs.Production
{
    public class ProductionBatchDto
    {
        public int Id { get; set; }
        public ProductType ProductType { get; set; }
        public string ProductTypeName { get; set; } = string.Empty;
        public decimal RiceUsedKg { get; set; }
        public int HoppersProduced { get; set; }
        public decimal WastageKg { get; set; }
        public decimal WastagePercentage { get; set; }
        public DateTime ProductionDate { get; set; }
        public bool IsSpecialOrder { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
