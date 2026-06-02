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

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editMode) {
      await editSupplier(selectedId, form)
    } else {
      await addNewSupplier(form)
    }
    resetForm()
  }

  const handleEdit = (supplier) => {
    setForm({
      name: supplier.name,
      contactNumber: supplier.contactNumber,
      address: supplier.address,
      isActive: supplier.isActive
    })
    setSelectedId(supplier.id)
    setEditMode(true)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this supplier?')) {
      await deleteSupplierById(id)
    }
  }

  const resetForm = () => {
    setForm({ name: '', contactNumber: '', address: '', isActive: true })
    setShowForm(false)
    setEditMode(false)
    setSelectedId(null)
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white 
                     px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add Supplier
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {editMode ? 'Edit Supplier' : 'New Supplier'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 
                           rounded-lg text-sm focus:outline-none 
                           focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Contact Number
              </label>
              <input
                type="text"
                value={form.contactNumber}
                onChange={e => setForm({ ...form, contactNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 
                           rounded-lg text-sm focus:outline-none 
                           focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Address
              </label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 
                           rounded-lg text-sm focus:outline-none 
                           focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white 
                           px-6 py-2 rounded-lg text-sm font-medium
                           disabled:opacity-50"
              >
                {loading ? 'Saving...' : editMode ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 
                           px-6 py-2 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">#</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Contact</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Address</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : suppliers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-400">
                  No suppliers found
                </td>
              </tr>
            ) : (
              suppliers.map((s, i) => (
                <tr key={s.id} className="border-b border-gray-100 
                                          hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.contactNumber}</td>
                  <td className="px-4 py-3 text-gray-600">{s.address}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${s.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'}`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(s)}
                        className="text-blue-600 hover:text-blue-800 
                                   text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-red-600 hover:text-red-800 
                                   text-xs font-medium"
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