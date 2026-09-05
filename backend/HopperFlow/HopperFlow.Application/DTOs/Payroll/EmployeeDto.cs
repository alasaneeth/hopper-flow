using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HopperFlow.Domain.Enums;

namespace HopperFlow.Application.DTOs.Payroll;

public class EmployeeDto
{
    public int Id { get; set; }
    public string EmployeeId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public EmployeeRole Role { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public SalaryType SalaryType { get; set; }
    public string SalaryTypeName { get; set; } = string.Empty;
    public decimal SalaryRate { get; set; }
    public DateTime JoinDate { get; set; }
    public bool IsActive { get; set; }
}
