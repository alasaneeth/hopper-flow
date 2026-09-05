using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Application.DTOs.Payroll;

public class MarkAttendanceDto
{
    public int EmployeeId { get; set; }
    public DateTime Date { get; set; }
    public bool IsPresent { get; set; }
}