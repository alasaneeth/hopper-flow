import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Trash2 } from 'lucide-react'
import useSales from './useSales'
import NewOrderModal from './NewOrderModal'
import StatCard from '../../components/common/StatCard'
import PageHeader from '../../components/common/PageHeader'

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
    addNewOrder, deleteOrderById,
  } = useSales()

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchOrders()
    fetchCustomers()
  }, [])

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

  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalOrders = orders.length

  return (
    <div>
      <PageHeader
        title="Sales Orders"
        subtitle="Create orders — payments handled in Invoices"
        isDark={isDark}
        action={
          <button
            onClick={() => setShowModal(true)}
            className={`text-sm font-medium px-4 py-2 rounded-lg
              transition-colors
              ${isDark ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
          >
            + New Order
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard label="Total Orders" value={totalOrders} isDark={isDark} />
        <StatCard label="Total Sales Value" value={`Rs. ${totalSales.toLocaleString()}`} color="text-green-500" isDark={isDark} />
      </div>

      <div className={`rounded-xl border overflow-hidden
        ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
        <div className={`px-6 py-4 border-b ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Order History
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
              {['#', 'Date', 'Customer', 'White', 'Red', 'Total', 'Status', ''].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center py-12 text-gray-600">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="8" className="text-center py-12 text-gray-600">No orders yet — create one!</td></tr>
            ) : (
              orders.map((o, i) => (
                <tr key={o.id}
                  className={`border-b transition-colors
                    ${isDark ? 'border-[#1a1a1a] hover:bg-[#171717]' : 'border-gray-50 hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 text-gray-500 text-sm">{i + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(o.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {o.customerName}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{o.whiteHopperCount}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{o.redHopperCount}</td>
                  <td className={`px-6 py-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Rs. {o.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5
                      rounded-full text-xs font-medium border
                      ${STATUS_STYLES[o.paymentStatusName]}`}>
                      {o.paymentStatusName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
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

export default SalesOrderPage