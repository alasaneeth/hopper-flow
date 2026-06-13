import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Trash2, Receipt, CreditCard } from 'lucide-react'
import useSales from './useSales'

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

const STATUS_STYLES = {
  Paid: 'bg-green-500/10 text-green-400 border-green-500/20',
  Partial: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Pending: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const SalesOrderPage = () => {
  const isDark = useSelector(state => state.theme.isDark)
  const {
    orders, customers, loading,
    fetchOrders, fetchCustomers,
    addNewOrder, addOrderPayment, deleteOrderById,
  } = useSales()

  const [showModal, setShowModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showInvoice, setShowInvoice] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const [form, setForm] = useState({
    customerId: '',
    orderDate: new Date().toISOString().split('T')[0],
    whiteHopperCount: '',
    whiteHopperPrice: '2.50',
    redHopperCount: '',
    redHopperPrice: '3.00',
    paidAmount: '',
    notes: '',
  })

  const [paymentForm, setPaymentForm] = useState({
    amountPaid: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
  })

  useEffect(() => {
    fetchOrders()
    fetchCustomers()
  }, [])

  const totalAmount =
    (parseFloat(form.whiteHopperCount || 0) * parseFloat(form.whiteHopperPrice || 0)) +
    (parseFloat(form.redHopperCount || 0) * parseFloat(form.redHopperPrice || 0))

  const outstanding = totalAmount - parseFloat(form.paidAmount || 0)

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
        paidAmount: parseFloat(form.paidAmount) || 0,
        orderDate: new Date(form.orderDate).toISOString(),
      })
      toast.success('Order created!')
      resetForm()
    } catch (err) {
      toast.error(err.message || 'Failed to create order!')
    }
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    try {
      await addOrderPayment(selectedOrder.id, {
        amountPaid: parseFloat(paymentForm.amountPaid),
        paymentDate: new Date(paymentForm.paymentDate).toISOString(),
        notes: paymentForm.notes,
      })
      toast.success('Payment recorded!')
      setShowPaymentModal(false)
      setSelectedOrder(null)
      setPaymentForm({ amountPaid: '', paymentDate: new Date().toISOString().split('T')[0], notes: '' })
    } catch (err) {
      toast.error(err.message || 'Failed to add payment!')
    }
  }

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Delete this order?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              await deleteOrderById(id)
              toast.success('Order deleted!')
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
      customerId: '',
      orderDate: new Date().toISOString().split('T')[0],
      whiteHopperCount: '',
      whiteHopperPrice: '2.50',
      redHopperCount: '',
      redHopperPrice: '3.00',
      paidAmount: '',
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
  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalCollected = orders.reduce((sum, o) => sum + o.paidAmount, 0)
  const totalOutstanding = orders.reduce((sum, o) => sum + o.outstandingAmount, 0)

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-2xl font-semibold
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Sales Orders
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track sales, payments and outstanding balances
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
          + New Order
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Sales', value: `Rs. ${totalSales.toLocaleString()}`, color: isDark ? 'text-white' : 'text-gray-900' },
          { label: 'Total Collected', value: `Rs. ${totalCollected.toLocaleString()}`, color: 'text-green-500' },
          { label: 'Total Outstanding', value: `Rs. ${totalOutstanding.toLocaleString()}`, color: totalOutstanding > 0 ? 'text-red-400' : 'text-green-500' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl p-5 border
            ${isDark
              ? 'bg-[#141414] border-[#232323]'
              : 'bg-white border-gray-200'}`}>
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-semibold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className={`rounded-xl border overflow-hidden
        ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
        <div className={`px-6 py-4 border-b
          ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <p className={`text-sm font-medium
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Order History
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className={`border-b
              ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
              {['#', 'Date', 'Customer', 'White', 'Red',
                'Total', 'Paid', 'Outstanding', 'Status', ''].map(h => (
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
                <td colSpan="10" className="text-center py-12 text-gray-600">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-12 text-gray-600">
                  No orders yet — create one!
                </td>
              </tr>
            ) : (
              orders.map((o, i) => (
                <tr key={o.id}
                  className={`border-b transition-colors
                    ${isDark
                      ? 'border-[#1a1a1a] hover:bg-[#171717]'
                      : 'border-gray-50 hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 text-gray-500 text-sm">{i + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(o.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-medium
                      ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {o.customerName}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {o.whiteHopperCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {o.redHopperCount}
                  </td>
                  <td className={`px-6 py-4 text-sm font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Rs. {o.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-green-500">
                    Rs. {o.paidAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold
                    ${o.outstandingAmount > 0 ? 'text-red-400' : 'text-gray-500'}">
                    <span className={o.outstandingAmount > 0 ? 'text-red-400' : 'text-gray-500'}>
                      Rs. {o.outstandingAmount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5
                      rounded-full text-xs font-medium border
                      ${STATUS_STYLES[o.paymentStatusName]}`}>
                      {o.paymentStatusName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {o.outstandingAmount > 0 && (
                        <button
                          onClick={() => { setSelectedOrder(o); setShowPaymentModal(true) }}
                          className={`p-1.5 rounded-lg transition-colors
                            ${isDark
                              ? 'text-gray-500 hover:text-green-400 hover:bg-green-500/10'
                              : 'text-gray-400 hover:text-green-500 hover:bg-green-50'}`}
                          title="Add Payment"
                        >
                          <CreditCard size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => setShowInvoice(o)}
                        className={`p-1.5 rounded-lg transition-colors
                          ${isDark
                            ? 'text-gray-500 hover:text-white hover:bg-[#2a2a2a]'
                            : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
                        title="View Invoice"
                      >
                        <Receipt size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(o.id)}
                        className={`p-1.5 rounded-lg transition-colors
                          ${isDark
                            ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Order Modal */}
      <Modal show={showModal} onClose={resetForm} isDark={isDark}>
        <div className={`px-6 py-5 border-b
          ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <h2 className={`text-base font-semibold
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            New Sales Order
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Total amount auto-calculated
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

          {/* Total / Paid / Outstanding */}
          <div className={`rounded-lg px-4 py-3 border space-y-2
            ${isDark
              ? 'bg-[#0f0f0f] border-[#2a2a2a]'
              : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="text-lg font-semibold text-green-500">
                Rs. {totalAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <label className={labelClass}>Paid Amount</label>
              <input
                type="number" min="0" step="0.01" max={totalAmount}
                value={form.paidAmount}
                onChange={e => setForm({ ...form, paidAmount: e.target.value })}
                className={inputClass}
                placeholder="0.00"
              />
            </div>
            <div className="flex justify-between items-center pt-2 border-t
              ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}">
              <p className="text-xs text-gray-500">Outstanding</p>
              <p className={`text-sm font-semibold
                ${outstanding > 0 ? 'text-red-400' : 'text-green-500'}`}>
                Rs. {Math.max(outstanding, 0).toFixed(2)}
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

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onClose={() => setShowPaymentModal(false)} isDark={isDark}>
        <div className={`px-6 py-5 border-b
          ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <h2 className={`text-base font-semibold
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Add Payment
          </h2>
          {selectedOrder && (
            <p className="text-xs text-gray-500 mt-0.5">
              {selectedOrder.customerName} — Outstanding: Rs. {selectedOrder.outstandingAmount.toLocaleString()}
            </p>
          )}
        </div>
        <form onSubmit={handlePaymentSubmit} className="px-6 py-5 space-y-3">
          <div>
            <label className={labelClass}>Amount Paid *</label>
            <input
              type="number" required min="0.01" step="0.01"
              max={selectedOrder?.outstandingAmount}
              value={paymentForm.amountPaid}
              onChange={e => setPaymentForm({ ...paymentForm, amountPaid: e.target.value })}
              className={inputClass}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className={labelClass}>Payment Date *</label>
            <input
              type="date" required
              value={paymentForm.paymentDate}
              onChange={e => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Notes</label>
            <input
              type="text"
              value={paymentForm.notes}
              onChange={e => setPaymentForm({ ...paymentForm, notes: e.target.value })}
              className={inputClass}
              placeholder="Optional notes"
            />
          </div>
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
              {loading ? 'Saving...' : 'Record Payment'}
            </button>
            <button
              type="button" onClick={() => setShowPaymentModal(false)}
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

      {/* Invoice Modal */}
      <Modal show={!!showInvoice} onClose={() => setShowInvoice(null)} isDark={isDark}>
        {showInvoice && (
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-green-500">HopperFlow</h2>
              <p className="text-xs text-gray-500">String Hopper Business Management</p>
            </div>

            <div className={`flex justify-between text-sm mb-4 pb-4 border-b
              ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
              <div>
                <p className="text-gray-500 text-xs">Invoice #</p>
                <p className={isDark ? 'text-white' : 'text-gray-900'}>INV-{String(showInvoice.id).padStart(4, '0')}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-xs">Date</p>
                <p className={isDark ? 'text-white' : 'text-gray-900'}>
                  {new Date(showInvoice.orderDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-500 text-xs">Customer</p>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {showInvoice.customerName}
              </p>
            </div>

            <table className="w-full text-sm mb-4">
              <thead>
                <tr className={`border-b ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
                  <th className="text-left py-2 text-gray-500 text-xs">Item</th>
                  <th className="text-right py-2 text-gray-500 text-xs">Qty</th>
                  <th className="text-right py-2 text-gray-500 text-xs">Price</th>
                  <th className="text-right py-2 text-gray-500 text-xs">Amount</th>
                </tr>
              </thead>
              <tbody>
                {showInvoice.whiteHopperCount > 0 && (
                  <tr className={`border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-50'}`}>
                    <td className={`py-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>White Hoppers</td>
                    <td className="text-right py-2 text-gray-400">{showInvoice.whiteHopperCount}</td>
                    <td className="text-right py-2 text-gray-400">Rs. {showInvoice.whiteHopperPrice}</td>
                    <td className={`text-right py-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Rs. {(showInvoice.whiteHopperCount * showInvoice.whiteHopperPrice).toFixed(2)}
                    </td>
                  </tr>
                )}
                {showInvoice.redHopperCount > 0 && (
                  <tr className={`border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-50'}`}>
                    <td className={`py-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Red Hoppers</td>
                    <td className="text-right py-2 text-gray-400">{showInvoice.redHopperCount}</td>
                    <td className="text-right py-2 text-gray-400">Rs. {showInvoice.redHopperPrice}</td>
                    <td className={`text-right py-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Rs. {(showInvoice.redHopperCount * showInvoice.redHopperPrice).toFixed(2)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className={`space-y-2 pt-4 border-t
              ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Rs. {showInvoice.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Paid</span>
                <span className="text-green-500">
                  Rs. {showInvoice.paidAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t
                ${isDark ? 'border-[#232323]' : 'border-gray-100'}">
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Outstanding</span>
                <span className={showInvoice.outstandingAmount > 0 ? 'text-red-400' : 'text-green-500'}>
                  Rs. {showInvoice.outstandingAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {showInvoice.payments?.length > 0 && (
              <div className="mt-4 pt-4 border-t ${isDark ? 'border-[#232323]' : 'border-gray-100'}">
                <p className="text-xs text-gray-500 mb-2">Payment History</p>
                {showInvoice.payments.map(p => (
                  <div key={p.id} className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{new Date(p.paymentDate).toLocaleDateString()} — {p.notes || 'Payment'}</span>
                    <span className="text-green-500">Rs. {p.amountPaid.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowInvoice(null)}
              className={`w-full mt-6 text-sm px-5 py-2 rounded-lg border
                transition-colors
                ${isDark
                  ? 'text-gray-500 border-[#2a2a2a] hover:text-white'
                  : 'text-gray-500 border-gray-200 hover:text-gray-900'}`}
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default SalesOrderPage