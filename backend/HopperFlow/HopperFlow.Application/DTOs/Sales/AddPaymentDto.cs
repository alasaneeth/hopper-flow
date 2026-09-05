using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Application.DTOs.Sales;

public class AddPaymentDto
{
    public decimal AmountPaid { get; set; }
    public DateTime PaymentDate { get; set; }
    public string? Notes { get; set; }
}