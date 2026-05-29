using HopperFlow.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Domain.Entities
{
    public class RiceStock
    {
        public ProductType RiceType { get; set; }
        public decimal QuantityKg { get; set; }
        public decimal LowStockThresholdKg { get; set; } = 10;
        public bool IsLowStock => QuantityKg <= LowStockThresholdKg;
    }
}
