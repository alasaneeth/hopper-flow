import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useInventory from './useInventory'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'

const StockPage = () => {
  const isDark = useSelector(state => state.theme.isDark)
  const { stocks, loading, fetchStocks } = useInventory()

  useEffect(() => { fetchStocks() }, [])

  const totalKg = stocks.reduce((sum, s) => sum + s.quantityKg, 0)
  const lowStockItems = stocks.filter(s => s.isLowStock)

  return (
    <div>
      <PageHeader
        title="Rice Stock"
        subtitle="Current stock levels and alerts"
        isDark={isDark}
        action={
          lowStockItems.length > 0 && (
            <div className="flex items-center gap-2 bg-red-500/10
                            border border-red-500/20 px-4 py-2 rounded-lg">
              <span className="text-red-400 text-sm">⚠️</span>
              <p className="text-red-400 text-sm font-medium">
                {lowStockItems.length} item(s) low on stock!
              </p>
            </div>
          )
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Stock" value={`${totalKg.toFixed(1)} kg`} isDark={isDark} />
        <StatCard label="Stock Types" value={stocks.length} color="text-green-500" isDark={isDark} />
        <StatCard
          label="Low Stock Alerts"
          value={lowStockItems.length}
          color={lowStockItems.length > 0 ? 'text-red-400' : 'text-green-500'}
          isDark={isDark}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {loading ? (
          <div className={`col-span-2 rounded-xl p-12 border text-center
            ${isDark ? 'bg-[#141414] border-[#232323] text-gray-600' : 'bg-white border-gray-200 text-gray-400'}`}>
            Loading...
          </div>
        ) : stocks.length === 0 ? (
          <div className={`col-span-2 rounded-xl p-12 border text-center
            ${isDark ? 'bg-[#141414] border-[#232323] text-gray-600' : 'bg-white border-gray-200 text-gray-400'}`}>
            No stock data — make a purchase first!
          </div>
        ) : (
          stocks.map(s => (
            <div key={s.id} className={`rounded-xl p-6 border
              ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}
              ${s.isLowStock ? 'border-red-500/30' : ''}`}>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {s.riceTypeName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Rice Type {s.riceType === 1 ? '— White' : '— Red'}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5
                  rounded-full text-xs font-medium border
                  ${s.isLowStock
                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                    : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                  {s.isLowStock ? '⚠️ Low Stock' : '✓ In Stock'}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Current Stock</span>
                  <span>{s.quantityKg} kg / Threshold: {s.lowStockThresholdKg} kg</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden
                  ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100'}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500
                      ${s.isLowStock ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{
                      width: `${Math.min((s.quantityKg / (s.lowStockThresholdKg * 5)) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className={`rounded-lg px-3 py-2.5 ${isDark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>
                  <p className="text-xs text-gray-500">Available</p>
                  <p className={`text-lg font-semibold mt-0.5
                    ${s.isLowStock ? 'text-red-400' : 'text-green-500'}`}>
                    {s.quantityKg} kg
                  </p>
                </div>
                <div className={`rounded-lg px-3 py-2.5 ${isDark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>
                  <p className="text-xs text-gray-500">Min. Threshold</p>
                  <p className={`text-lg font-semibold mt-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {s.lowStockThresholdKg} kg
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default StockPage