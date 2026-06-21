import { useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '../../components/common/Modal'
import InputField from '../../components/common/InputField'

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
        paidAmount: 0,
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

  return (
    <Modal show={show} onClose={resetForm} isDark={isDark}>
      <div className={`px-6 py-5 border-b ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
        <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          New Sales Order
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Payment can be recorded later from Invoices
        </p>
      </div>
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">

        <div>
          <label className="block text-xs mb-1.5 text-gray-500">Customer *</label>
          <select
            required
            value={form.customerId}
            onChange={e => setForm({ ...form, customerId: e.target.value })}
            className={`w-full px-3 py-2.5 rounded-lg text-sm
              focus:outline-none focus:ring-1 focus:ring-green-500/50
              ${isDark ? 'bg-[#0f0f0f] border border-[#2a2a2a] text-white' : 'bg-gray-50 border border-gray-200 text-gray-900'}`}
          >
            <option value="">Select customer</option>
            {customers.filter(c => c.isActive).map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="White Hopper Count"
            type="number" min="0"
            value={form.whiteHopperCount}
            onChange={e => setForm({ ...form, whiteHopperCount: e.target.value })}
            placeholder="0"
            isDark={isDark}
          />
          <InputField
            label="Price per piece"
            type="number" min="0" step="0.01"
            value={form.whiteHopperPrice}
            onChange={e => setForm({ ...form, whiteHopperPrice: e.target.value })}
            placeholder="0.00"
            isDark={isDark}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Red Hopper Count"
            type="number" min="0"
            value={form.redHopperCount}
            onChange={e => setForm({ ...form, redHopperCount: e.target.value })}
            placeholder="0"
            isDark={isDark}
          />
          <InputField
            label="Price per piece"
            type="number" min="0" step="0.01"
            value={form.redHopperPrice}
            onChange={e => setForm({ ...form, redHopperPrice: e.target.value })}
            placeholder="0.00"
            isDark={isDark}
          />
        </div>

        <div className={`rounded-lg px-4 py-3 border
          ${isDark ? 'bg-[#0f0f0f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="text-lg font-semibold text-green-500">
              Rs. {totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <InputField
          label="Order Date *"
          type="date" required
          value={form.orderDate}
          onChange={e => setForm({ ...form, orderDate: e.target.value })}
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
              ${isDark ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
          >
            {loading ? 'Saving...' : 'Create Order'}
          </button>
          <button
            type="button" onClick={resetForm}
            className={`text-sm px-5 py-2 rounded-lg border
              transition-colors
              ${isDark ? 'text-gray-500 border-[#2a2a2a] hover:text-white' : 'text-gray-500 border-gray-200 hover:text-gray-900'}`}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default NewOrderModal