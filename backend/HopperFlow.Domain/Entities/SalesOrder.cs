using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HopperFlow.Domain.Common;
using HopperFlow.Domain.Enums;

namespace HopperFlow.Domain.Entities;

public class SalesOrder : BaseEntity
{
    public int CustomerId { get; set; }
    public DateTime OrderDate { get; set; }

    // White Hopper
    public int WhiteHopperCount { get; set; }
    public decimal WhiteHopperPrice { get; set; }

    // Red Hopper
    public int RedHopperCount { get; set; }
    public decimal RedHopperPrice { get; set; }

    // Payment
    public decimal TotalAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal OutstandingAmount { get; set; }
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

    public string? Notes { get; set; }

    // Navigation
    public Customer Customer { get; set; } = null!;
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}