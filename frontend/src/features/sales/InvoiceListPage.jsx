import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useSales from './useSales'
import NewOrderModal from './NewOrderModal'

const STATUS_STYLES = {
  Paid: 'bg-green-500/10 text-green-400 border-green-500/20',
  Partial: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Pending: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const InvoiceListPage = () => {
  const isDark = useSelector(state => state.theme.isDark)
  const navigate = useNavigate()
  const {
    orders, customers, loading,
    fetchOrders, fetchCustomers, addNewOrder,
  } = useSales()

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchOrders()
    fetchCustomers()
  }, [])

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
            Invoices
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            View invoices and record payments
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
            All Invoices
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className={`border-b
              ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
              {['#', 'Invoice', 'Date', 'Customer', 'Total', 'Paid', 'Outstanding', 'Status'].map(h => (
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
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-12 text-gray-600">
                  No invoices yet — create an order!
                </td>
              </tr>
            ) : (
              orders.map((o, i) => (
                <tr key={o.id}
                  onClick={() => navigate(`/invoices/${o.id}`)}
                  className={`border-b transition-colors cursor-pointer
                    ${isDark
                      ? 'border-[#1a1a1a] hover:bg-[#171717]'
                      : 'border-gray-50 hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 text-gray-500 text-sm">{i + 1}</td>
                  <td className={`px-6 py-4 text-sm font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    INV-{String(o.id).padStart(4, '0')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(o.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-medium
                      ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {o.customerName}
                    </p>
                  </td>
                  <td className={`px-6 py-4 text-sm font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Rs. {o.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-green-500">
                    Rs. {o.paidAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <NewOrderModal
        show={showModal}
        onClose={() => setShowModal(false)}
        isDark={isDark}
        customers={customers}
        loading={loading}
        addNewOrder={addNewOrder}
      />
    </div>
  )
}

export default InvoiceListPage