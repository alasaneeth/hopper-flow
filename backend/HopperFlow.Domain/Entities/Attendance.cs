using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HopperFlow.Domain.Common;

namespace HopperFlow.Domain.Entities;

public class Attendance : BaseEntity
{
    public int EmployeeId { get; set; }
    public DateTime Date { get; set; }
    public bool IsPresent { get; set; }

    // Navigation
    public Employee Employee { get; set; } = null!;
}