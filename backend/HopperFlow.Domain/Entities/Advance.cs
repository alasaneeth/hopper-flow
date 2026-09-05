using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HopperFlow.Domain.Common;

namespace HopperFlow.Domain.Entities;

public class Advance : BaseEntity
{
    public int EmployeeId { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal MonthlyInstallment { get; set; }
    public decimal RemainingAmount { get; set; }
    public int TotalMonths { get; set; } = 3;
    public int PaidMonths { get; set; } = 0;
    public DateTime StartDate { get; set; }
    public bool IsCompleted { get; set; } = false;

    // Navigation
    public Employee Employee { get; set; } = null!;
}