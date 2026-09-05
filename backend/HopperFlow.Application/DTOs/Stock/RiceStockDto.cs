using HopperFlow.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Application.DTOs.Stock
{
    public class RiceStockDto
    {
        public int Id { get; set; }
        public ProductType RiceType { get; set; }
        public string RiceTypeName { get; set; } = string.Empty;
        public decimal QuantityKg { get; set; }
        public decimal LowStockThresholdKg { get; set; }
        public bool IsLowStock { get; set; }
    }
}
