using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HopperFlow.Domain.Enums;

namespace HopperFlow.Application.DTOs.Payroll;

public class CreateEmployeeDto
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public EmployeeRole Role { get; set; }
    public SalaryType SalaryType { get; set; }
    public decimal SalaryRate { get; set; }
    public DateTime JoinDate { get; set; }
}