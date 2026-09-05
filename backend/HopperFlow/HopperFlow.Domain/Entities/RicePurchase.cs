using HopperFlow.Domain.Common;
using HopperFlow.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Domain.Entities
{
    public class RicePurchase : BaseEntity
    {
        public int SupplierId { get; set; }
        public ProductType RiceType { get; set; }
        public decimal QuantityKg { get; set; }
        public decimal PricePerKg { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime PurchaseDate { get; set; }
        public string? Notes { get; set; }

        public Supplier Supplier { get; set; } = null!;
    }
}
