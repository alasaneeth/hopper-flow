using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HopperFlow.Domain.Enums;

public enum EmployeeRole
{
    MillingTeam = 1,      // Team 1 — Rice to Dough
    ProductionTeam = 2,   // Team 2 — Dough to Hoppers
    SalesTeam = 3,        // Sales
    Management = 4,       // Manager/Admin
    Other = 5
}