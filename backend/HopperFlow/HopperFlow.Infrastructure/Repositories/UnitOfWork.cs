using HopperFlow.Application.Common.Interfaces;
using HopperFlow.Application.Common.Interfaces.Repositories;
using HopperFlow.Infrastructure.Data;

namespace HopperFlow.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public ISupplierRepository Suppliers { get; }
    public IRicePurchaseRepository RicePurchases { get; }
    public IRiceStockRepository RiceStocks { get; }
    public IProductionBatchRepository ProductionBatches { get; }
    public IDoughStockRepository DoughStocks { get; }
    public IPreparationBatchRepository PreparationBatches { get; }
    public ICustomerRepository Customers { get; }      // ← add
    public ISalesOrderRepository SalesOrders { get; }  // ← add
    public IPaymentRepository Payments { get; }        // ← add

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        Suppliers = new SupplierRepository(context);
        RicePurchases = new RicePurchaseRepository(context);
        RiceStocks = new RiceStockRepository(context);
        ProductionBatches = new ProductionBatchRepository(context);
        DoughStocks = new DoughStockRepository(context);
        PreparationBatches = new PreparationBatchRepository(context);
        Customers = new CustomerRepository(context);      
        SalesOrders = new SalesOrderRepository(context);   
        Payments = new PaymentRepository(context);         
    }

    public async Task<int> SaveChangesAsync()
        => await _context.SaveChangesAsync();

    public void Dispose()
        => _context.Dispose();
}