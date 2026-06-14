import { useState } from 'react'
import toast from 'react-hot-toast'

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

const NewOrderModal = ({ show, onClose, isDark, customers, loading, addNewOrder }) => {
  const [form, setForm] = useState({
    customerId: '',
    orderDate: new Date().toISOString().split('T')[0],
    whiteHopperCount: '',
    whiteHopperPrice: '2.50',
    redHopperCount: '',
    redHopperPrice: '3.00',
    notes: '',
  })

  const totalAmount =
    (parseFloat(form.whiteHopperCount || 0) * parseFloat(form.whiteHopperPrice || 0)) +
    (parseFloat(form.redHopperCount || 0) * parseFloat(form.redHopperPrice || 0))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addNewOrder({
        ...form,
        customerId: parseInt(form.customerId),
        whiteHopperCount: parseInt(form.whiteHopperCount) || 0,
        whiteHopperPrice: parseFloat(form.whiteHopperPrice) || 0,
        redHopperCount: parseInt(form.redHopperCount) || 0,
        redHopperPrice: parseFloat(form.redHopperPrice) || 0,
        paidAmount: 0, // Always 0 — payment happens in Invoice page
        orderDate: new Date(form.orderDate).toISOString(),
      })
      toast.success('Order created! Go to Invoices to record payment.')
      resetForm()
    } catch (err) {
      toast.error(err.message || 'Failed to create order!')
    }
  }

  const resetForm = () => {
    setForm({
      customerId: '',
      orderDate: new Date().toISOString().split('T')[0],
      whiteHopperCount: '',
      whiteHopperPrice: '2.50',
      redHopperCount: '',
      redHopperPrice: '3.00',
      notes: '',
    })
    onClose()
  }

  const inputClass = `w-full px-3 py-2.5 rounded-lg text-sm
    focus:outline-none focus:ring-1 focus:ring-green-500/50
    ${isDark
      ? 'bg-[#0f0f0f] border border-[#2a2a2a] text-white placeholder-gray-700'
      : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'}`

  const labelClass = `block text-xs mb-1.5 text-gray-500`

  return (
    <Modal show={show} onClose={resetForm} isDark={isDark}>
      <div className={`px-6 py-5 border-b
        ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
        <h2 className={`text-base font-semibold
          ${isDark ? 'text-white' : 'text-gray-900'}`}>
          New Sales Order
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Payment can be recorded later from Invoices
        </p>
      </div>
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">

        {/* Customer */}
        <div>
          <label className={labelClass}>Customer *</label>
          <select
            required
            value={form.customerId}
            onChange={e => setForm({ ...form, customerId: e.target.value })}
            className={inputClass}
          >
            <option value="">Select customer</option>
            {customers.filter(c => c.isActive).map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* White Hopper */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>White Hopper Count</label>
            <input
              type="number" min="0"
              value={form.whiteHopperCount}
              onChange={e => setForm({ ...form, whiteHopperCount: e.target.value })}
              className={inputClass}
              placeholder="0"
            />
          </div>
          <div>
            <label className={labelClass}>Price per piece</label>
            <input
              type="number" min="0" step="0.01"
              value={form.whiteHopperPrice}
              onChange={e => setForm({ ...form, whiteHopperPrice: e.target.value })}
              className={inputClass}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Red Hopper */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Red Hopper Count</label>
            <input
              type="number" min="0"
              value={form.redHopperCount}
              onChange={e => setForm({ ...form, redHopperCount: e.target.value })}
              className={inputClass}
              placeholder="0"
            />
          </div>
          <div>
            <label className={labelClass}>Price per piece</label>
            <input
              type="number" min="0" step="0.01"
              value={form.redHopperPrice}
              onChange={e => setForm({ ...form, redHopperPrice: e.target.value })}
              className={inputClass}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Total */}
        <div className={`rounded-lg px-4 py-3 border
          ${isDark
            ? 'bg-[#0f0f0f] border-[#2a2a2a]'
            : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="text-lg font-semibold text-green-500">
              Rs. {totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className={labelClass}>Order Date *</label>
          <input
            type="date" required
            value={form.orderDate}
            onChange={e => setForm({ ...form, orderDate: e.target.value })}
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
            {loading ? 'Saving...' : 'Create Order'}
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
  )
}

export default NewOrderModal