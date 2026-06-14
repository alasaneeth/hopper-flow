import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { ArrowLeft, Printer, CreditCard } from 'lucide-react'
import useSales from './useSales'

const Modal = ({ show, onClose, children, isDark }) => {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose} />
      <div className={`relative z-10 w-full max-w-md rounded-2xl shadow-2xl
        ${isDark
          ? 'bg-[#141414] border border-[#232323]'
          : 'bg-white border border-gray-200'}`}>
        {children}
      </div>
    </div>
  )
}

const InvoicePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isDark = useSelector(state => state.theme.isDark)
  const { orders, loading, fetchOrders, addOrderPayment } = useSales()

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentForm, setPaymentForm] = useState({
    amountPaid: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
  })

  useEffect(() => {
    if (orders.length === 0) fetchOrders()
  }, [])

  const order = orders.find(o => o.id === parseInt(id))

  const inputClass = `w-full px-3 py-2.5 rounded-lg text-sm
    focus:outline-none focus:ring-1 focus:ring-green-500/50
    ${isDark
      ? 'bg-[#0f0f0f] border border-[#2a2a2a] text-white placeholder-gray-700'
      : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'}`

  const labelClass = `block text-xs mb-1.5 text-gray-500`

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    try {
      await addOrderPayment(order.id, {
        amountPaid: parseFloat(paymentForm.amountPaid),
        paymentDate: new Date(paymentForm.paymentDate).toISOString(),
        notes: paymentForm.notes,
      })
      toast.success('Payment recorded!')
      setShowPaymentModal(false)
      setPaymentForm({ amountPaid: '', paymentDate: new Date().toISOString().split('T')[0], notes: '' })
    } catch (err) {
      toast.error(err.message || 'Failed to add payment!')
    }
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Loading invoice...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Top bar — hidden on print */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <button
          onClick={() => navigate('/invoices')}
          className={`flex items-center gap-2 text-sm
            ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <ArrowLeft size={16} />
          Back to Invoices
        </button>
        <div className="flex gap-3">
          {order.outstandingAmount > 0 && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg
                bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              <CreditCard size={16} />
              Add Payment
            </button>
          )}
          <button
            onClick={() => window.print()}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg
              transition-colors
              ${isDark
                ? 'bg-white text-black hover:bg-gray-100'
                : 'bg-gray-900 text-white hover:bg-gray-800'}`}
          >
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      {/* Invoice */}
      <div className={`max-w-2xl mx-auto rounded-2xl border p-8
        print:border-none print:shadow-none print:rounded-none
        ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>

        {/* Header */}
        <div className={`text-center mb-8 pb-6 border-b
          ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <h1 className="text-2xl font-bold text-green-500">HopperFlow</h1>
          <p className="text-sm text-gray-500 mt-1">
            String Hopper Business Management
          </p>
        </div>

        {/* Invoice info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Invoice Number</p>
            <p className={`text-lg font-semibold
              ${isDark ? 'text-white' : 'text-gray-900'}`}>
              INV-{String(order.id).padStart(4, '0')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Date</p>
            <p className={`text-lg font-semibold
              ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {new Date(order.orderDate).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'long', year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Customer */}
        <div className={`rounded-lg px-4 py-3 mb-6
          ${isDark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>
          <p className="text-xs text-gray-500 mb-1">Billed To</p>
          <p className={`text-base font-medium
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {order.customerName}
          </p>
        </div>

        {/* Items table */}
        <table className="w-full text-sm mb-6">
          <thead>
            <tr className={`border-b
              ${isDark ? 'border-[#232323]' : 'border-gray-200'}`}>
              <th className="text-left py-3 text-gray-500 text-xs uppercase tracking-wider">
                Item
              </th>
              <th className="text-right py-3 text-gray-500 text-xs uppercase tracking-wider">
                Qty
              </th>
              <th className="text-right py-3 text-gray-500 text-xs uppercase tracking-wider">
                Unit Price
              </th>
              <th className="text-right py-3 text-gray-500 text-xs uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {order.whiteHopperCount > 0 && (
              <tr className={`border-b
                ${isDark ? 'border-[#1a1a1a]' : 'border-gray-50'}`}>
                <td className={`py-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  White String Hopper
                </td>
                <td className="text-right py-3 text-gray-400">
                  {order.whiteHopperCount}
                </td>
                <td className="text-right py-3 text-gray-400">
                  Rs. {order.whiteHopperPrice.toFixed(2)}
                </td>
                <td className={`text-right py-3 font-medium
                  ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Rs. {(order.whiteHopperCount * order.whiteHopperPrice).toFixed(2)}
                </td>
              </tr>
            )}
            {order.redHopperCount > 0 && (
              <tr className={`border-b
                ${isDark ? 'border-[#1a1a1a]' : 'border-gray-50'}`}>
                <td className={`py-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Red String Hopper
                </td>
                <td className="text-right py-3 text-gray-400">
                  {order.redHopperCount}
                </td>
                <td className="text-right py-3 text-gray-400">
                  Rs. {order.redHopperPrice.toFixed(2)}
                </td>
                <td className={`text-right py-3 font-medium
                  ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Rs. {(order.redHopperCount * order.redHopperPrice).toFixed(2)}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className={`space-y-2 pt-4 border-t
          ${isDark ? 'border-[#232323]' : 'border-gray-200'}`}>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className={isDark ? 'text-white' : 'text-gray-900'}>
              Rs. {order.totalAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount Paid</span>
            <span className="text-green-500">
              Rs. {order.paidAmount.toLocaleString()}
            </span>
          </div>
          <div className={`flex justify-between text-lg font-bold pt-3 border-t
            ${isDark ? 'border-[#232323]' : 'border-gray-200'}`}>
            <span className={isDark ? 'text-white' : 'text-gray-900'}>
              Balance Due
            </span>
            <span className={order.outstandingAmount > 0 ? 'text-red-400' : 'text-green-500'}>
              Rs. {order.outstandingAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Payment status badge */}
        <div className="mt-4 flex justify-end">
          <span className={`inline-flex items-center px-3 py-1
            rounded-full text-xs font-medium border
            ${order.paymentStatusName === 'Paid'
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : order.paymentStatusName === 'Partial'
                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {order.paymentStatusName}
          </span>
        </div>

        {/* Payment history */}
        {order.payments?.length > 0 && (
          <div className={`mt-6 pt-6 border-t
            ${isDark ? 'border-[#232323]' : 'border-gray-200'}`}>
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">
              Payment History
            </p>
            <div className="space-y-2">
              {order.payments.map(p => (
                <div key={p.id} className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {new Date(p.paymentDate).toLocaleDateString()}
                    {p.notes && ` — ${p.notes}`}
                  </span>
                  <span className="text-green-500 font-medium">
                    Rs. {p.amountPaid.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className={`mt-6 pt-6 border-t
            ${isDark ? 'border-[#232323]' : 'border-gray-200'}`}>
            <p className="text-xs text-gray-500 mb-1">Notes</p>
            <p className="text-sm text-gray-400">{order.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className={`mt-8 pt-6 border-t text-center
          ${isDark ? 'border-[#232323]' : 'border-gray-200'}`}>
          <p className="text-xs text-gray-500">
            Thank you for your business!
          </p>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onClose={() => setShowPaymentModal(false)} isDark={isDark}>
        <div className={`px-6 py-5 border-b
          ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <h2 className={`text-base font-semibold
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Add Payment
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {order.customerName} — Outstanding: Rs. {order.outstandingAmount.toLocaleString()}
          </p>
        </div>
        <form onSubmit={handlePaymentSubmit} className="px-6 py-5 space-y-3">
          <div>
            <label className={labelClass}>Amount Paid *</label>
            <input
              type="number" required min="0.01" step="0.01"
              max={order.outstandingAmount}
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
    </div>
  )
}

export default InvoicePage