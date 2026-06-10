using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HopperFlow.Domain.Common;

namespace HopperFlow.Domain.Entities;

public class Payment : BaseEntity
{
    public int SalesOrderId { get; set; }
    public decimal AmountPaid { get; set; }
    public DateTime PaymentDate { get; set; }
    public string? Notes { get; set; }

    // Navigation
    public SalesOrder SalesOrder { get; set; } = null!;
}