using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Application.DTOs.Payroll;

public class CreateAdvanceDto
{
    public int EmployeeId { get; set; }
    public decimal TotalAmount { get; set; }
    public int TotalMonths { get; set; } = 3;
    public DateTime StartDate { get; set; }
}