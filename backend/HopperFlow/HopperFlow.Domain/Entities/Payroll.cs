using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HopperFlow.Domain.Common;

namespace HopperFlow.Domain.Entities;

public class Payroll : BaseEntity
{
    public int EmployeeId { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public int DaysWorked { get; set; }
    public decimal BasicSalary { get; set; }
    public decimal Bonus { get; set; } = 0;
    public decimal AdvanceDeduction { get; set; } = 0;
    public decimal NetSalary { get; set; }
    public bool IsPaid { get; set; } = false;
    public DateTime? PaidDate { get; set; }

    // Navigation
    public Employee Employee { get; set; } = null!;
}