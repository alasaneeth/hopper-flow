import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useInventory from './useInventory'
import { useSelector } from 'react-redux'

const Modal = ({ show, onClose, children, isDark }) => {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose} />
      <div className={`relative z-10 w-full max-w-lg rounded-2xl shadow-2xl  max-h-[90vh]
        ${isDark
          ? 'bg-[#141414] border border-[#232323]'
          : 'bg-white border border-gray-200'}`}>
        {children}
      </div>
    </div>
  )
}

const RICE_TYPES = [
  { value: 1, label: 'White String Hopper' },
  { value: 2, label: 'Red String Hopper' },
]

const PurchasePage = () => {
  const isDark = useSelector(state => state.theme.isDark)
  const {
    purchases, suppliers, loading,
    fetchPurchases, fetchSuppliers, addNewPurchase,
  } = useInventory()

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    supplierId: '',
    riceType: 1,
    quantityKg: '',
    pricePerKg: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: '',
  })

  useEffect(() => {
    fetchPurchases()
    fetchSuppliers()
  }, [])

  const totalAmount = form.quantityKg && form.pricePerKg
    ? (parseFloat(form.quantityKg) * parseFloat(form.pricePerKg)).toFixed(2)
    : '0.00'

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addNewPurchase({
        ...form,
        supplierId: parseInt(form.supplierId),
        riceType: parseInt(form.riceType),
        quantityKg: parseFloat(form.quantityKg),
        pricePerKg: parseFloat(form.pricePerKg),
        purchaseDate: new Date(form.purchaseDate).toISOString(),
      })
      toast.success('Purchase recorded & stock updated!')
      resetForm()
    } catch {
      toast.error('Failed to record purchase!')
    }
  }

  const resetForm = () => {
    setForm({
      supplierId: '',
      riceType: 1,
      quantityKg: '',
      pricePerKg: '',
      purchaseDate: new Date().toISOString().split('T')[0],
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
  const totalKg = purchases.reduce((sum, p) => sum + p.quantityKg, 0)
  const totalSpent = purchases.reduce((sum, p) => sum + p.totalAmount, 0)
  const whiteKg = purchases
    .filter(p => p.riceType === 1)
    .reduce((sum, p) => sum + p.quantityKg, 0)
  const redKg = purchases
    .filter(p => p.riceType === 2)
    .reduce((sum, p) => sum + p.quantityKg, 0)

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-2xl font-semibold
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Rice Purchases
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track all rice purchases and stock updates
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
          + New Purchase
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Purchases', value: purchases.length, color: isDark ? 'text-white' : 'text-gray-900', suffix: '' },
          { label: 'Total Rice (Kg)', value: totalKg.toFixed(1), color: 'text-green-500', suffix: 'kg' },
          { label: 'White Hopper Rice', value: whiteKg.toFixed(1), color: 'text-blue-400', suffix: 'kg' },
          { label: 'Red Hopper Rice', value: redKg.toFixed(1), color: 'text-red-400', suffix: 'kg' },
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

      {/* Total Spent */}
      <div className={`rounded-xl p-5 border mb-6
        ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
        <p className="text-xs text-gray-500 mb-1">Total Amount Spent</p>
        <p className="text-3xl font-semibold text-green-500">
          Rs. {totalSpent.toLocaleString()}
        </p>
      </div>

      {/* Table */}
      <div className={`rounded-xl border overflow-hidden
        ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
        <div className={`px-6 py-4 border-b
          ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <p className={`text-sm font-medium
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Purchase History
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className={`border-b
              ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
              {['#', 'Date', 'Supplier', 'Rice Type', 'Qty (Kg)',
                'Price/Kg', 'Total', 'Notes'].map(h => (
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
                <td colSpan="8" className="text-center py-12 text-gray-600">
                  Loading...
                </td>
              </tr>
            ) : purchases.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-12 text-gray-600">
                  No purchases yet — add one!
                </td>
              </tr>
            ) : (
              purchases.map((p, i) => (
                <tr key={p.id}
                  className={`border-b transition-colors
                    ${isDark
                      ? 'border-[#1a1a1a] hover:bg-[#171717]'
                      : 'border-gray-50 hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 text-gray-500 text-sm">{i + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(p.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-medium
                      ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {p.supplierName || '—'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5
                      rounded-full text-xs font-medium border
                      ${p.riceType === 1
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {p.riceTypeName}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {p.quantityKg} kg
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    Rs. {p.pricePerKg}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-500">
                    Rs. {p.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {p.notes || '—'}
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
            New Purchase
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Record a rice purchase — stock will auto update
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
          {/* Supplier */}
          <div>
            <label className={labelClass}>Supplier *</label>
            <select
              required
              value={form.supplierId}
              onChange={e => setForm({ ...form, supplierId: e.target.value })}
              className={inputClass}
            >
              <option value="">Select supplier</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Rice Type */}
          <div>
            <label className={labelClass}>Rice Type *</label>
            <select
              value={form.riceType}
              onChange={e => setForm({ ...form, riceType: e.target.value })}
              className={inputClass}
            >
              {RICE_TYPES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Qty + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Quantity (Kg) *</label>
              <input
                type="number" required min="0.1" step="0.1"
                value={form.quantityKg}
                onChange={e => setForm({ ...form, quantityKg: e.target.value })}
                className={inputClass}
                placeholder="0.0"
              />
            </div>
            <div>
              <label className={labelClass}>Price per Kg (Rs.) *</label>
              <input
                type="number" required min="0.1" step="0.01"
                value={form.pricePerKg}
                onChange={e => setForm({ ...form, pricePerKg: e.target.value })}
                className={inputClass}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Total Amount — Auto calculate */}
          <div className={`rounded-lg px-4 py-3 border
            ${isDark
              ? 'bg-[#0f0f0f] border-[#2a2a2a]'
              : 'bg-gray-50 border-gray-200'}`}>
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="text-xl font-semibold text-green-500 mt-0.5">
              Rs. {parseFloat(totalAmount).toLocaleString()}
            </p>
          </div>

          {/* Date */}
          <div>
            <label className={labelClass}>Purchase Date *</label>
            <input
              type="date" required
              value={form.purchaseDate}
              onChange={e => setForm({ ...form, purchaseDate: e.target.value })}
              className={inputClass}
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
              {loading ? 'Saving...' : 'Record Purchase'}
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

export default PurchasePage