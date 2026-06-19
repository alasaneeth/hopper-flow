using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Application.DTOs.Payroll;

public class AdvanceDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public decimal MonthlyInstallment { get; set; }
    public decimal RemainingAmount { get; set; }
    public int TotalMonths { get; set; }
    public int PaidMonths { get; set; }
    public DateTime StartDate { get; set; }
    public bool IsCompleted { get; set; }
}