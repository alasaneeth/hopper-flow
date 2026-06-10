using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HopperFlow.Domain.Common;

namespace HopperFlow.Domain.Entities;

public class Customer : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    // Navigation
    public ICollection<SalesOrder> SalesOrders { get; set; } = new List<SalesOrder>();
}