import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Pencil, Trash2 } from 'lucide-react'
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

const CustomerPage = () => {
  const isDark = useSelector(state => state.theme.isDark)
  const {
    customers, loading,
    fetchCustomers, addNewCustomer,
    editCustomer, deleteCustomerById
  } = useSales()

  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', address: '', isActive: true
  })

  useEffect(() => { fetchCustomers() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editMode) {
        await editCustomer(selectedId, form)
        toast.success('Customer updated!')
      } else {
        await addNewCustomer(form)
        toast.success('Customer added!')
      }
      resetForm()
    } catch {
      toast.error('Something went wrong!')
    }
  }

  const handleEdit = (c) => {
    setForm({ name: c.name, phone: c.phone, address: c.address, isActive: c.isActive })
    setSelectedId(c.id)
    setEditMode(true)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Delete this customer?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              await deleteCustomerById(id)
              toast.success('Customer deleted!')
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
    setForm({ name: '', phone: '', address: '', isActive: true })
    setShowModal(false)
    setEditMode(false)
    setSelectedId(null)
  }

  const inputClass = `w-full px-3 py-2.5 rounded-lg text-sm
    focus:outline-none focus:ring-1 focus:ring-green-500/50
    ${isDark
      ? 'bg-[#0f0f0f] border border-[#2a2a2a] text-white placeholder-gray-700'
      : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'}`

  const labelClass = `block text-xs mb-1.5 text-gray-500`

  const totalOutstanding = customers.reduce((sum, c) => sum + c.totalOutstanding, 0)

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-2xl font-semibold
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Customers
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage customers and credit balances
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAll(!showAll)}
            className={`text-sm px-4 py-2 rounded-lg border transition-colors
              ${showAll
                ? 'border-green-500/50 text-green-400 bg-green-500/10'
                : isDark
                  ? 'border-[#2a2a2a] text-gray-500 hover:text-white'
                  : 'border-gray-200 text-gray-500 hover:text-gray-900'}`}
          >
            {showAll ? '👁 All' : '👁 Active Only'}
          </button>
          <button
            onClick={() => { setEditMode(false); setShowModal(true) }}
            className={`text-sm font-medium px-4 py-2 rounded-lg
              transition-colors
              ${isDark
                ? 'bg-white text-black hover:bg-gray-100'
                : 'bg-gray-900 text-white hover:bg-gray-800'}`}
          >
            + Add Customer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Customers', value: customers.length, color: isDark ? 'text-white' : 'text-gray-900' },
          { label: 'Active', value: customers.filter(c => c.isActive).length, color: 'text-green-500' },
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
            All Customers
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className={`border-b
              ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
              {['#', 'Name', 'Phone', 'Address', 'Outstanding', 'Status', 'Actions'].map(h => (
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
                <td colSpan="7" className="text-center py-12 text-gray-600">
                  Loading...
                </td>
              </tr>
            ) : customers.filter(c => showAll ? true : c.isActive).length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-gray-600">
                  No customers yet — add one!
                </td>
              </tr>
            ) : (
              customers
                .filter(c => showAll ? true : c.isActive)
                .map((c, i) => (
                <tr key={c.id}
                  className={`border-b transition-colors
                    ${isDark
                      ? 'border-[#1a1a1a] hover:bg-[#171717]'
                      : 'border-gray-50 hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 text-gray-500 text-sm">{i + 1}</td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-medium
                      ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {c.name}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {c.phone || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {c.address || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold
                      ${c.totalOutstanding > 0 ? 'text-red-400' : 'text-green-500'}`}>
                      Rs. {c.totalOutstanding.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5
                      rounded-full text-xs font-medium border
                      ${c.isActive
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className={`p-1.5 rounded-lg transition-colors
                          ${isDark
                            ? 'text-gray-500 hover:text-white hover:bg-[#2a2a2a]'
                            : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className={`p-1.5 rounded-lg transition-colors
                          ${isDark
                            ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
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

      {/* Modal */}
      <Modal show={showModal} onClose={resetForm} isDark={isDark}>
        <div className={`px-6 py-5 border-b
          ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <h2 className={`text-base font-semibold
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {editMode ? 'Edit Customer' : 'New Customer'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {editMode ? 'Update customer details' : 'Add a new customer'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className={labelClass}>Name *</label>
            <input
              type="text" required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              placeholder="Customer name"
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
              placeholder="077XXXXXXX"
            />
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input
              type="text"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className={inputClass}
              placeholder="Address"
            />
          </div>
          {editMode && (
            <div className="flex items-center gap-3">
              <label className={labelClass}>Active</label>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={e => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 accent-green-500"
              />
            </div>
          )}
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
              {loading ? 'Saving...' : editMode ? 'Update' : 'Save'}
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

export default CustomerPage