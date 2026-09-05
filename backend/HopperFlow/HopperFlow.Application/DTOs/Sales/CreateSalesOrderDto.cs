using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Application.DTOs.Sales;

public class CreateSalesOrderDto
{
    public int CustomerId { get; set; }
    public DateTime OrderDate { get; set; }
    public int WhiteHopperCount { get; set; }
    public decimal WhiteHopperPrice { get; set; }
    public int RedHopperCount { get; set; }
    public decimal RedHopperPrice { get; set; }
    public decimal PaidAmount { get; set; }
    public string? Notes { get; set; }
}