using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HopperFlow.Domain.Enums;

namespace HopperFlow.Application.DTOs.Payroll;

public class PayrollDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string EmployeeIdCard { get; set; } = string.Empty;
    public EmployeeRole Role { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public SalaryType SalaryType { get; set; }
    public string SalaryTypeName { get; set; } = string.Empty;
    public int Month { get; set; }
    public int Year { get; set; }
    public int DaysWorked { get; set; }
    public decimal SalaryRate { get; set; }
    public decimal BasicSalary { get; set; }
    public decimal Bonus { get; set; }
    public decimal AdvanceDeduction { get; set; }
    public decimal NetSalary { get; set; }
    public bool IsPaid { get; set; }
    public DateTime? PaidDate { get; set; }
}