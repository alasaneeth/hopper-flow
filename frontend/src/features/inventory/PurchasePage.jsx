import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import useInventory from './useInventory'
import Modal from '../../components/common/Modal'
import StatCard from '../../components/common/StatCard'
import PageHeader from '../../components/common/PageHeader'
import InputField from '../../components/common/InputField'

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

  const totalKg = purchases.reduce((sum, p) => sum + p.quantityKg, 0)
  const totalSpent = purchases.reduce((sum, p) => sum + p.totalAmount, 0)
  const whiteKg = purchases.filter(p => p.riceType === 1).reduce((sum, p) => sum + p.quantityKg, 0)
  const redKg = purchases.filter(p => p.riceType === 2).reduce((sum, p) => sum + p.quantityKg, 0)

  return (
    <div>
      <PageHeader
        title="Rice Purchases"
        subtitle="Track all rice purchases and stock updates"
        isDark={isDark}
        action={
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
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Purchases" value={purchases.length} isDark={isDark} />
        <StatCard label="Total Rice (Kg)" value={totalKg.toFixed(1)} suffix="kg" color="text-green-500" isDark={isDark} />
        <StatCard label="White Hopper Rice" value={whiteKg.toFixed(1)} suffix="kg" color="text-blue-400" isDark={isDark} />
        <StatCard label="Red Hopper Rice" value={redKg.toFixed(1)} suffix="kg" color="text-red-400" isDark={isDark} />
      </div>

      <div className={`rounded-xl p-5 border mb-6
        ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
        <p className="text-xs text-gray-500 mb-1">Total Amount Spent</p>
        <p className="text-3xl font-semibold text-green-500">
          Rs. {totalSpent.toLocaleString()}
        </p>
      </div>

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
              <tr><td colSpan="8" className="text-center py-12 text-gray-600">Loading...</td></tr>
            ) : purchases.length === 0 ? (
              <tr><td colSpan="8" className="text-center py-12 text-gray-600">No purchases yet — add one!</td></tr>
            ) : (
              purchases.map((p, i) => (
                <tr key={p.id}
                  className={`border-b transition-colors
                    ${isDark ? 'border-[#1a1a1a] hover:bg-[#171717]' : 'border-gray-50 hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 text-gray-500 text-sm">{i + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(p.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
                  <td className={`px-6 py-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
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

      <Modal show={showModal} onClose={resetForm} isDark={isDark}>
        <div className={`px-6 py-5 border-b ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            New Purchase
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Record a rice purchase — stock will auto update
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-3">
          <div>
            <label className="block text-xs mb-1.5 text-gray-500">Supplier *</label>
            <select
              required
              value={form.supplierId}
              onChange={e => setForm({ ...form, supplierId: e.target.value })}
              className={`w-full px-3 py-2.5 rounded-lg text-sm
                focus:outline-none focus:ring-1 focus:ring-green-500/50
                ${isDark
                  ? 'bg-[#0f0f0f] border border-[#2a2a2a] text-white'
                  : 'bg-gray-50 border border-gray-200 text-gray-900'}`}
            >
              <option value="">Select supplier</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1.5 text-gray-500">Rice Type *</label>
            <select
              value={form.riceType}
              onChange={e => setForm({ ...form, riceType: e.target.value })}
              className={`w-full px-3 py-2.5 rounded-lg text-sm
                focus:outline-none focus:ring-1 focus:ring-green-500/50
                ${isDark
                  ? 'bg-[#0f0f0f] border border-[#2a2a2a] text-white'
                  : 'bg-gray-50 border border-gray-200 text-gray-900'}`}
            >
              {RICE_TYPES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Quantity (Kg) *"
              type="number" required min="0.1" step="0.1"
              value={form.quantityKg}
              onChange={e => setForm({ ...form, quantityKg: e.target.value })}
              placeholder="0.0"
              isDark={isDark}
            />
            <InputField
              label="Price per Kg (Rs.) *"
              type="number" required min="0.1" step="0.01"
              value={form.pricePerKg}
              onChange={e => setForm({ ...form, pricePerKg: e.target.value })}
              placeholder="0.00"
              isDark={isDark}
            />
          </div>

          <div className={`rounded-lg px-4 py-3 border
            ${isDark ? 'bg-[#0f0f0f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'}`}>
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="text-xl font-semibold text-green-500 mt-0.5">
              Rs. {parseFloat(totalAmount).toLocaleString()}
            </p>
          </div>

          <InputField
            label="Purchase Date *"
            type="date" required
            value={form.purchaseDate}
            onChange={e => setForm({ ...form, purchaseDate: e.target.value })}
            isDark={isDark}
          />

          <InputField
            label="Notes"
            type="text"
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            placeholder="Optional notes"
            isDark={isDark}
          />

          <div className={`flex gap-3 pt-2 border-t ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
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