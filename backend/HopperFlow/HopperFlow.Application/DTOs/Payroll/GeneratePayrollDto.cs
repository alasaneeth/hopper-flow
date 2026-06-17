using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Application.DTOs.Payroll;

public class GeneratePayrollDto
{
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal Bonus { get; set; } = 0;
}