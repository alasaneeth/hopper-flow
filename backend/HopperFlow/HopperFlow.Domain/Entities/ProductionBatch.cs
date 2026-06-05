using HopperFlow.Domain.Common;
using HopperFlow.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Domain.Entities
{
    public class ProductionBatch : BaseEntity
    {
        public ProductType ProductType { get; set; }
        public decimal RiceUsedKg { get; set; }
        public int HoppersProduced { get; set; }
        public decimal WastageKg { get; set; }
        public DateTime ProductionDate { get; set; }
        public bool IsSpecialOrder { get; set; } = false;
     public string? Notes { get; set; }
    }
}
