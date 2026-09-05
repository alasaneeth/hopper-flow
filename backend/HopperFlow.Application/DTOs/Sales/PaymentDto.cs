using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Application.DTOs.Sales;

public class PaymentDto
{
    public int Id { get; set; }
    public int SalesOrderId { get; set; }
    public decimal AmountPaid { get; set; }
    public DateTime PaymentDate { get; set; }
    public string? Notes { get; set; }
}
