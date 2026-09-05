using HopperFlow.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Application.DTOs.Purchase
{
    public class RicePurchaseDto
    {
        public int Id { get; set; }
        public int SupplierId { get; set; }
        public string SupplierName { get; set; } = string.Empty;
        public ProductType RiceType { get; set; }
        public string RiceTypeName { get; set; } = string.Empty;
        public decimal QuantityKg { get; set; }
        public decimal PricePerKg { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime PurchaseDate { get; set; }
        public string? Notes { get; set; }
    }
}
