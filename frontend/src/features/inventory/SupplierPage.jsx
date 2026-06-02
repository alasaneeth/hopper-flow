import { useEffect, useState } from 'react'
import useInventory from './useInventory'

const SupplierPage = () => {
  const {
    suppliers, loading, error,
    fetchSuppliers, addNewSupplier,
    editSupplier, deleteSupplierById
  } = useInventory()

  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState({
    name: '', contactNumber: '', address: '', isActive: true
  })

  useEffect(() => { fetchSuppliers() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editMode) await editSupplier(selectedId, form)
    else await addNewSupplier(form)
    resetForm()
  }

  const handleEdit = (s) => {
    setForm({ name: s.name, contactNumber: s.contactNumber, 
              address: s.address, isActive: s.isActive })
    setSelectedId(s.id)
    setEditMode(true)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this supplier?')) 
      await deleteSupplierById(id)
  }

  const resetForm = () => {
    setForm({ name: '', contactNumber: '', address: '', isActive: true })
    setShowForm(false)
    setEditMode(false)
    setSelectedId(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Suppliers</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your rice suppliers
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditMode(false) }}
          className="bg-white text-black text-sm font-medium 
                     px-4 py-2 rounded-lg hover:bg-gray-100 
                     transition-colors"
        >
          + Add Supplier
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 
                        text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-[#141414] border border-[#232323] 
                        rounded-xl p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-400 mb-5 uppercase 
                         tracking-wider">
            {editMode ? 'Edit Supplier' : 'New Supplier'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                Name *
              </label>
              <input
                type="text" required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#0f0f0f] border 
                           border-[#2a2a2a] rounded-lg text-sm text-white
                           focus:outline-none focus:border-green-500/50
                           placeholder-gray-700"
                placeholder="Supplier name"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                Contact Number
              </label>
              <input
                type="text"
                value={form.contactNumber}
                onChange={e => setForm({ ...form, contactNumber: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#0f0f0f] border 
                           border-[#2a2a2a] rounded-lg text-sm text-white
                           focus:outline-none focus:border-green-500/50
                           placeholder-gray-700"
                placeholder="077XXXXXXX"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1.5">
                Address
              </label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#0f0f0f] border 
                           border-[#2a2a2a] rounded-lg text-sm text-white
                           focus:outline-none focus:border-green-500/50
                           placeholder-gray-700"
                placeholder="Address"
              />
            </div>
            <div className="col-span-2 flex gap-3 pt-2">
              <button
                type="submit" disabled={loading}
                className="bg-white text-black text-sm font-medium
                           px-5 py-2 rounded-lg hover:bg-gray-100
                           disabled:opacity-40 transition-colors"
              >
                {loading ? 'Saving...' : editMode ? 'Update' : 'Save'}
              </button>
              <button
                type="button" onClick={resetForm}
                className="text-gray-500 hover:text-white text-sm
                           px-5 py-2 rounded-lg border border-[#2a2a2a]
                           hover:border-[#3a3a3a] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#141414] border border-[#232323] 
                        rounded-xl p-5">
          <p className="text-xs text-gray-600 mb-1">Total Suppliers</p>
          <p className="text-2xl font-semibold text-white">
            {suppliers.length}
          </p>
        </div>
        <div className="bg-[#141414] border border-[#232323] 
                        rounded-xl p-5">
          <p className="text-xs text-gray-600 mb-1">Active</p>
          <p className="text-2xl font-semibold text-green-400">
            {suppliers.filter(s => s.isActive).length}
          </p>
        </div>
        <div className="bg-[#141414] border border-[#232323] 
                        rounded-xl p-5">
          <p className="text-xs text-gray-600 mb-1">Inactive</p>
          <p className="text-2xl font-semibold text-red-400">
            {suppliers.filter(s => !s.isActive).length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#141414] border border-[#232323] rounded-xl 
                      overflow-hidden">
        <div className="px-6 py-4 border-b border-[#232323]">
          <p className="text-sm font-medium text-white">All Suppliers</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e1e1e]">
              <th className="text-left px-6 py-3 text-xs text-gray-600 
                             font-medium uppercase tracking-wider">#</th>
              <th className="text-left px-6 py-3 text-xs text-gray-600 
                             font-medium uppercase tracking-wider">Name</th>
              <th className="text-left px-6 py-3 text-xs text-gray-600 
                             font-medium uppercase tracking-wider">Contact</th>
              <th className="text-left px-6 py-3 text-xs text-gray-600 
                             font-medium uppercase tracking-wider">Address</th>
              <th className="text-left px-6 py-3 text-xs text-gray-600 
                             font-medium uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3 text-xs text-gray-600 
                             font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-700">
                  Loading...
                </td>
              </tr>
            ) : suppliers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-700">
                  No suppliers yet
                </td>
              </tr>
            ) : (
              suppliers.map((s, i) => (
                <tr key={s.id}
                  className="border-b border-[#1a1a1a] hover:bg-[#171717] 
                             transition-colors">
                  <td className="px-6 py-4 text-gray-600 text-sm">{i + 1}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-white">{s.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {s.contactNumber || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {s.address || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 
                      rounded-full text-xs font-medium
                      ${s.isActive
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
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
    </div>
  )
}

export default SupplierPage