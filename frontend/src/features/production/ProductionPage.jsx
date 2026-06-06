import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Trash2 } from 'lucide-react'
import useProduction from './useProduction'
import useInventory from '../inventory/useInventory'

const Modal = ({ show, onClose, children, isDark }) => {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose} />
      <div className={`relative z-10 w-full max-w-lg rounded-2xl shadow-2xl
        max-h-[90vh] overflow-y-auto
        ${isDark
          ? 'bg-[#141414] border border-[#232323]'
          : 'bg-white border border-gray-200'}`}>
        {children}
      </div>
    </div>
  )
}

const PRODUCT_TYPES = [
  { value: 1, label: 'White String Hopper' },
  { value: 2, label: 'Red String Hopper' },
]

const ProductionPage = () => {
  const isDark = useSelector(state => state.theme.isDark)
  const { batches, loading, fetchBatches, addNewBatch, deleteBatchById } = useProduction()
  const { stocks, fetchStocks } = useInventory()

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    productType: 1,
    riceUsedKg: '',
    hoppersProduced: '',
    wastageKg: '',
    productionDate: new Date().toISOString().split('T')[0],
    isSpecialOrder: false,
    notes: '',
  })

  useEffect(() => {
    fetchBatches()
    fetchStocks()
  }, [])

  // Available stock for selected product type
  const availableStock = stocks.find(
    s => s.riceType === parseInt(form.productType)
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addNewBatch({
        ...form,
        productType: parseInt(form.productType),
        riceUsedKg: parseFloat(form.riceUsedKg),
        hoppersProduced: parseInt(form.hoppersProduced),
        wastageKg: parseFloat(form.wastageKg) || 0,
        productionDate: new Date(form.productionDate).toISOString(),
      })
      toast.success('Production batch recorded & stock updated!')
      resetForm()
    } catch (err) {
      toast.error(err.message || 'Failed to record batch!')
    }
  }

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Delete this batch?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              await deleteBatchById(id)
              toast.success('Batch deleted!')
            }}
            className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 text-gray-800 text-xs px-3 py-1.5 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 })
  }

  const resetForm = () => {
    setForm({
      productType: 1,
      riceUsedKg: '',
      hoppersProduced: '',
      wastageKg: '',
      productionDate: new Date().toISOString().split('T')[0],
      isSpecialOrder: false,
      notes: '',
    })
    setShowModal(false)
  }

  const inputClass = `w-full px-3 py-2.5 rounded-lg text-sm
    focus:outline-none focus:ring-1 focus:ring-green-500/50
    ${isDark
      ? 'bg-[#0f0f0f] border border-[#2a2a2a] text-white placeholder-gray-700'
      : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'}`

  const labelClass = `block text-xs mb-1.5 text-gray-500`

  // Stats
  const totalBatches = batches.length
  const totalHoppers = batches.reduce((sum, b) => sum + b.hoppersProduced, 0)
  const totalWastage = batches.reduce((sum, b) => sum + b.wastageKg, 0)
  const specialOrders = batches.filter(b => b.isSpecialOrder).length

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-2xl font-semibold
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Production
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track string hopper production batches
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className={`text-sm font-medium px-4 py-2 rounded-lg
            transition-colors
            ${isDark
              ? 'bg-white text-black hover:bg-gray-100'
              : 'bg-gray-900 text-white hover:bg-gray-800'}`}
        >
          + New Batch
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Batches', value: totalBatches, color: isDark ? 'text-white' : 'text-gray-900', suffix: '' },
          { label: 'Hoppers Produced', value: totalHoppers.toLocaleString(), color: 'text-green-500', suffix: '' },
          { label: 'Total Wastage', value: totalWastage.toFixed(1), color: 'text-red-400', suffix: 'kg' },
          { label: 'Special Orders', value: specialOrders, color: 'text-yellow-400', suffix: '' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl p-5 border
            ${isDark
              ? 'bg-[#141414] border-[#232323]'
              : 'bg-white border-gray-200'}`}>
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-semibold ${stat.color}`}>
              {stat.value}
              <span className="text-sm ml-1 font-normal text-gray-500">
                {stat.suffix}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Stock status bar */}
      <div className={`rounded-xl p-5 border mb-6 grid grid-cols-2 gap-4
        ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
        <div>
          <p className="text-xs text-gray-500 mb-1">White Hopper Rice Stock</p>
          <p className={`text-xl font-semibold
            ${stocks.find(s => s.riceType === 1)?.isLowStock
              ? 'text-red-400' : 'text-green-500'}`}>
            {stocks.find(s => s.riceType === 1)?.quantityKg ?? 0} kg
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Red Hopper Rice Stock</p>
          <p className={`text-xl font-semibold
            ${stocks.find(s => s.riceType === 2)?.isLowStock
              ? 'text-red-400' : 'text-green-500'}`}>
            {stocks.find(s => s.riceType === 2)?.quantityKg ?? 0} kg
          </p>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-xl border overflow-hidden
        ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
        <div className={`px-6 py-4 border-b
          ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <p className={`text-sm font-medium
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Production History
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className={`border-b
              ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
              {['#', 'Date', 'Type', 'Rice Used',
                'Hoppers', 'Wastage', 'Special', 'Notes', ''].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs
                                       text-gray-500 font-medium uppercase
                                       tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-12 text-gray-600">
                  Loading...
                </td>
              </tr>
            ) : batches.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-12 text-gray-600">
                  No batches yet — start production!
                </td>
              </tr>
            ) : (
              batches.map((b, i) => (
                <tr key={b.id}
                  className={`border-b transition-colors
                    ${isDark
                      ? 'border-[#1a1a1a] hover:bg-[#171717]'
                      : 'border-gray-50 hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 text-gray-500 text-sm">{i + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(b.productionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5
                      rounded-full text-xs font-medium border
                      ${b.productType === 1
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {b.productTypeName}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {b.riceUsedKg} kg
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-500">
                    {b.hoppersProduced.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-red-400">{b.wastageKg} kg</p>
                      <p className="text-xs text-gray-600">
                        {b.wastagePercentage}%
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {b.isSpecialOrder ? (
                      <span className="inline-flex items-center px-2.5 py-0.5
                        rounded-full text-xs font-medium border
                        bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                        ⭐ Special
                      </span>
                    ) : (
                      <span className="text-gray-600 text-xs">Normal</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {b.notes || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(b.id)}
                      className={`p-1.5 rounded-lg transition-colors
                        ${isDark
                          ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal show={showModal} onClose={resetForm} isDark={isDark}>
        <div className={`px-6 py-5 border-b
          ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <h2 className={`text-base font-semibold
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            New Production Batch
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Rice stock will auto deduct on save
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">

          {/* Product Type */}
          <div>
            <label className={labelClass}>Product Type *</label>
            <select
              value={form.productType}
              onChange={e => setForm({ ...form, productType: e.target.value })}
              className={inputClass}
            >
              {PRODUCT_TYPES.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Available stock indicator */}
          {availableStock && (
            <div className={`rounded-lg px-4 py-2.5 border
              ${availableStock.isLowStock
                ? 'bg-red-500/10 border-red-500/20'
                : isDark
                  ? 'bg-[#0f0f0f] border-[#2a2a2a]'
                  : 'bg-gray-50 border-gray-200'}`}>
              <p className="text-xs text-gray-500">Available Stock</p>
              <p className={`text-sm font-semibold mt-0.5
                ${availableStock.isLowStock ? 'text-red-400' : 'text-green-500'}`}>
                {availableStock.quantityKg} kg
                {availableStock.isLowStock && ' ⚠️ Low!'}
              </p>
            </div>
          )}

          {/* Rice Used + Hoppers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Rice Used (Kg) *</label>
              <input
                type="number" required min="0.1" step="0.1"
                value={form.riceUsedKg}
                onChange={e => setForm({ ...form, riceUsedKg: e.target.value })}
                className={inputClass}
                placeholder="0.0"
              />
            </div>
            <div>
              <label className={labelClass}>Hoppers Produced *</label>
              <input
                type="number" required min="1"
                value={form.hoppersProduced}
                onChange={e => setForm({ ...form, hoppersProduced: e.target.value })}
                className={inputClass}
                placeholder="0"
              />
            </div>
          </div>

          {/* Wastage */}
          <div>
            <label className={labelClass}>Wastage (Kg)</label>
            <input
              type="number" min="0" step="0.1"
              value={form.wastageKg}
              onChange={e => setForm({ ...form, wastageKg: e.target.value })}
              className={inputClass}
              placeholder="0.0"
            />
          </div>

          {/* Date */}
          <div>
            <label className={labelClass}>Production Date *</label>
            <input
              type="date" required
              value={form.productionDate}
              onChange={e => setForm({ ...form, productionDate: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Special Order */}
          <div className={`flex items-center justify-between px-4 py-3
            rounded-lg border
            ${isDark
              ? 'bg-[#0f0f0f] border-[#2a2a2a]'
              : 'bg-gray-50 border-gray-200'}`}>
            <div>
              <p className={`text-sm font-medium
                ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Special Order
              </p>
              <p className="text-xs text-gray-500">
                Mark as special customer order
              </p>
            </div>
            <input
              type="checkbox"
              checked={form.isSpecialOrder}
              onChange={e => setForm({ ...form, isSpecialOrder: e.target.checked })}
              className="w-4 h-4 accent-green-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            <input
              type="text"
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              className={inputClass}
              placeholder="Optional notes"
            />
          </div>

          {/* Buttons */}
          <div className={`flex gap-3 pt-2 border-t
            ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
            <button
              type="submit" disabled={loading}
              className={`text-sm font-medium px-5 py-2 rounded-lg
                transition-colors disabled:opacity-40
                ${isDark
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'bg-gray-900 text-white hover:bg-gray-800'}`}
            >
              {loading ? 'Saving...' : 'Record Batch'}
            </button>
            <button
              type="button" onClick={resetForm}
              className={`text-sm px-5 py-2 rounded-lg border
                transition-colors
                ${isDark
                  ? 'text-gray-500 border-[#2a2a2a] hover:text-white'
                  : 'text-gray-500 border-gray-200 hover:text-gray-900'}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ProductionPage