import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import useInventory from '../inventory/useInventory'
import useSales from '../sales/useSales'
import useProduction from '../production/useProduction'
import usePayroll from '../payroll/usePayroll'
import StatCard from '../../components/common/StatCard'
import PageHeader from '../../components/common/PageHeader'

const DashboardPage = () => {
  const isDark = useSelector(state => state.theme.isDark)

  const { stocks, purchases, fetchStocks, fetchPurchases } = useInventory()
  const { orders, fetchOrders } = useSales()
  const { batches, fetchBatches } = useProduction()
  const { employees, fetchEmployees } = usePayroll()

  useEffect(() => {
    fetchStocks()
    fetchPurchases()
    fetchOrders()
    fetchBatches()
    fetchEmployees()
  }, [])

  // ===== Stats =====
  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalOutstanding = orders.reduce((sum, o) => sum + o.outstandingAmount, 0)
  const totalHoppers = batches.reduce((sum, b) => sum + b.hoppersProduced, 0)
  const activeEmployees = employees.filter(e => e.isActive).length

  // ===== Sales Chart Data (by month) =====
  const salesByMonth = orders.reduce((acc, o) => {
    const month = new Date(o.orderDate).toLocaleString('default', { month: 'short' })
    const existing = acc.find(a => a.month === month)
    if (existing) {
      existing.sales += o.totalAmount
      existing.collected += o.paidAmount
    } else {
      acc.push({ month, sales: o.totalAmount, collected: o.paidAmount })
    }
    return acc
  }, [])

  // ===== Production Chart Data (by month) =====
  const productionByMonth = batches.reduce((acc, b) => {
    const month = new Date(b.productionDate).toLocaleString('default', { month: 'short' })
    const existing = acc.find(a => a.month === month)
    if (existing) {
      existing.hoppers += b.hoppersProduced
    } else {
      acc.push({ month, hoppers: b.hoppersProduced })
    }
    return acc
  }, [])

  // ===== Stock Chart Data =====
  const stockData = stocks.map(s => ({
    name: s.riceTypeName,
    quantity: s.quantityKg,
    threshold: s.lowStockThresholdKg
  }))

  // ===== Purchase Chart Data (by month) =====
  const purchaseByMonth = purchases.reduce((acc, p) => {
    const month = new Date(p.purchaseDate).toLocaleString('default', { month: 'short' })
    const existing = acc.find(a => a.month === month)
    if (existing) {
      existing.amount += p.totalAmount
      existing.quantity += p.quantityKg
    } else {
      acc.push({ month, amount: p.totalAmount, quantity: p.quantityKg })
    }
    return acc
  }, [])

  // ===== Recent Orders =====
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 5)

  const chartColors = {
    primary: '#22c55e',
    secondary: '#3b82f6',
    danger: '#ef4444',
    warning: '#eab308',
    grid: isDark ? '#232323' : '#f0f0f0',
    text: isDark ? '#6b7280' : '#9ca3af',
  }

  const tooltipStyle = {
    backgroundColor: isDark ? '#141414' : '#ffffff',
    border: `1px solid ${isDark ? '#232323' : '#e5e7eb'}`,
    borderRadius: '8px',
    color: isDark ? '#ffffff' : '#111827',
    fontSize: '12px',
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="HopperFlow business overview"
        isDark={isDark}
      />

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Sales"
          value={`Rs. ${totalSales.toLocaleString()}`}
          color="text-green-500"
          isDark={isDark}
        />
        <StatCard
          label="Outstanding"
          value={`Rs. ${totalOutstanding.toLocaleString()}`}
          color={totalOutstanding > 0 ? 'text-red-400' : 'text-green-500'}
          isDark={isDark}
        />
        <StatCard
          label="Hoppers Produced"
          value={totalHoppers.toLocaleString()}
          color="text-blue-400"
          isDark={isDark}
        />
        <StatCard
          label="Active Employees"
          value={activeEmployees}
          color="text-yellow-400"
          isDark={isDark}
        />
      </div>

      {/* Row 1 — Sales + Production charts */}
      <div className="grid grid-cols-2 gap-4 mb-4">

        {/* Sales Chart */}
        <div className={`rounded-xl p-5 border
          ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm font-medium mb-4
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Sales Overview
          </p>
          {salesByMonth.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No sales data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="month" tick={{ fill: chartColors.text, fontSize: 11 }} />
                <YAxis tick={{ fill: chartColors.text, fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke={chartColors.primary}
                  strokeWidth={2}
                  dot={{ fill: chartColors.primary }}
                  name="Total Sales"
                />
                <Line
                  type="monotone"
                  dataKey="collected"
                  stroke={chartColors.secondary}
                  strokeWidth={2}
                  dot={{ fill: chartColors.secondary }}
                  name="Collected"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Production Chart */}
        <div className={`rounded-xl p-5 border
          ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm font-medium mb-4
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Production Overview
          </p>
          {productionByMonth.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No production data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={productionByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="month" tick={{ fill: chartColors.text, fontSize: 11 }} />
                <YAxis tick={{ fill: chartColors.text, fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="hoppers" fill={chartColors.primary} name="Hoppers Produced" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Row 2 — Stock + Purchase charts */}
      <div className="grid grid-cols-2 gap-4 mb-4">

        {/* Stock Chart */}
        <div className={`rounded-xl p-5 border
          ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm font-medium mb-4
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Rice Stock Levels
          </p>
          {stockData.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No stock data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="name" tick={{ fill: chartColors.text, fontSize: 11 }} />
                <YAxis tick={{ fill: chartColors.text, fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="quantity" fill={chartColors.primary} name="Current (kg)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="threshold" fill={chartColors.danger} name="Threshold (kg)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Purchase Chart */}
        <div className={`rounded-xl p-5 border
          ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm font-medium mb-4
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Purchase Trend
          </p>
          {purchaseByMonth.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No purchase data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={purchaseByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="month" tick={{ fill: chartColors.text, fontSize: 11 }} />
                <YAxis tick={{ fill: chartColors.text, fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke={chartColors.warning}
                  strokeWidth={2}
                  dot={{ fill: chartColors.warning }}
                  name="Amount (Rs.)"
                />
                <Line
                  type="monotone"
                  dataKey="quantity"
                  stroke={chartColors.secondary}
                  strokeWidth={2}
                  dot={{ fill: chartColors.secondary }}
                  name="Quantity (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className={`rounded-xl border overflow-hidden
        ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
        <div className={`px-6 py-4 border-b
          ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <p className={`text-sm font-medium
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Recent Orders
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
              {['Date', 'Customer', 'Total', 'Paid', 'Status'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-600">
                  No orders yet
                </td>
              </tr>
            ) : (
              recentOrders.map(o => (
                <tr key={o.id}
                  className={`border-b transition-colors
                    ${isDark ? 'border-[#1a1a1a] hover:bg-[#171717]' : 'border-gray-50 hover:bg-gray-50'}`}>
                  <td className="px-6 py-3 text-sm text-gray-400">
                    {new Date(o.orderDate).toLocaleDateString()}
                  </td>
                  <td className={`px-6 py-3 text-sm font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {o.customerName}
                  </td>
                  <td className={`px-6 py-3 text-sm font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Rs. {o.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-sm text-green-500">
                    Rs. {o.paidAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5
                      rounded-full text-xs font-medium border
                      ${o.paymentStatusName === 'Paid'
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : o.paymentStatusName === 'Partial'
                          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {o.paymentStatusName}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DashboardPage