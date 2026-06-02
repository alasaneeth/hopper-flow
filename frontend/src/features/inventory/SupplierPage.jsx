import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useInventory from './useInventory'
import { useSelector } from 'react-redux'

// Modal Component
const Modal = ({ show, onClose, children, isDark }) => {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className={`relative z-10 w-full max-w-lg rounded-2xl shadow-2xl
        ${isDark
          ? 'bg-[#141414] border border-[#232323]'
          : 'bg-white border border-gray-200'}`}>
        {children}
      </div>
    </div>
  )
}

const SupplierPage = () => {
  const isDark = useSelector(state => state.theme.isDark)
  const {
    suppliers, loading,
    fetchSuppliers, addNewSupplier,
    editSupplier, deleteSupplierById
  } = useInventory()

  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState({
    name: '', contactNumber: '', address: '', isActive: true
  })

  useEffect(() => { fetchSuppliers() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editMode) {
        await editSupplier(selectedId, form)
        toast.success('Supplier updated!')
      } else {
        await addNewSupplier(form)
        toast.success('Supplier added!')
      }
      resetForm()
    } catch {
      toast.error('Something went wrong!')
    }
  }

  const handleEdit = (s) => {
    setForm({ name: s.name, contactNumber: s.contactNumber,
              address: s.address, isActive: s.isActive })
    setSelectedId(s.id)
    setEditMode(true)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Delete this supplier?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              await deleteSupplierById(id)
              toast.success('Supplier deleted!')
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
    setForm({ name: '', contactNumber: '', address: '', isActive: true })
    setShowModal(false)
    setEditMode(false)
    setSelectedId(null)
  }

  const inputClass = `w-full px-3 py-2.5 rounded-lg text-sm
    focus:outline-none focus:ring-1 focus:ring-green-500/50
    ${isDark
      ? 'bg-[#0f0f0f] border border-[#2a2a2a] text-white placeholder-gray-700'
      : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'}`

  const labelClass = `block text-xs mb-1.5
    ${isDark ? 'text-gray-500' : 'text-gray-500'}`

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-2xl font-semibold
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Suppliers
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your rice suppliers
          </p>
        </div>
        <button
          onClick={() => { setEditMode(false); setShowModal(true) }}
          className={`text-sm font-medium px-4 py-2 rounded-lg
            transition-colors
            ${isDark
              ? 'bg-white text-black hover:bg-gray-100'
              : 'bg-gray-900 text-white hover:bg-gray-800'}`}
        >
          + Add Supplier
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: suppliers.length, color: isDark ? 'text-white' : 'text-gray-900' },
          { label: 'Active', value: suppliers.filter(s => s.isActive).length, color: 'text-green-500' },
          { label: 'Inactive', value: suppliers.filter(s => !s.isActive).length, color: 'text-red-400' },
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
            All Suppliers
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className={`border-b
              ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
              {['#', 'Name', 'Contact', 'Address', 'Status', 'Actions'].map(h => (
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
                <td colSpan="6" className="text-center py-12 text-gray-600">
                  Loading...
                </td>
              </tr>
            ) : suppliers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-600">
                  No suppliers yet — add one!
                </td>
              </tr>
            ) : (
              suppliers.map((s, i) => (
                <tr key={s.id}
                  className={`border-b transition-colors
                    ${isDark
                      ? 'border-[#1a1a1a] hover:bg-[#171717]'
                      : 'border-gray-50 hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 text-gray-500 text-sm">{i + 1}</td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-medium
                      ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {s.name}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {s.contactNumber || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {s.address || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5
                      rounded-full text-xs font-medium border
                      ${s.isActive
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(s)}
                        className="text-xs text-gray-500 hover:text-white 
                                   transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-xs text-gray-500 hover:text-red-400 
                                   transition-colors"
                      >
                        Delete
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
            {editMode ? 'Edit Supplier' : 'New Supplier'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {editMode ? 'Update supplier details' : 'Add a new rice supplier'}
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
              placeholder="Supplier name"
            />
          </div>
          <div>
            <label className={labelClass}>Contact Number</label>
            <input
              type="text"
              value={form.contactNumber}
              onChange={e => setForm({ ...form, contactNumber: e.target.value })}
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

export default SupplierPage