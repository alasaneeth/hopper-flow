using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HopperFlow.Domain.Common;
using HopperFlow.Domain.Enums;

namespace HopperFlow.Domain.Entities;

public class Employee : BaseEntity
{
    public string EmployeeId { get; set; } = string.Empty; // EMP-001
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public EmployeeRole Role { get; set; }
    public SalaryType SalaryType { get; set; }
    public decimal SalaryRate { get; set; }
    public DateTime JoinDate { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation
    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    public ICollection<Advance> Advances { get; set; } = new List<Advance>();
    public ICollection<Payroll> Payrolls { get; set; } = new List<Payroll>();
}