import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Trash2 } from 'lucide-react'
import useProduction from './useProduction'
import useInventory from '../inventory/useInventory'

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

const PRODUCT_TYPES = [
  { value: 1, label: 'White String Hopper' },
  { value: 2, label: 'Red String Hopper' },
]

const PreparationPage = () => {
  const isDark = useSelector(state => state.theme.isDark)
  const {
    preparations, doughStocks, loading,
    fetchPreparations, fetchDoughStocks,
    addNewPreparation, deletePreparationById,
  } = useProduction()
  const { stocks, fetchStocks } = useInventory()

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    productType: 1,
    riceUsedKg: '',
    millingDone: false,
    sievingDone: false,
    doughProducedKg: '',
    preparationDate: new Date().toISOString().split('T')[0],
    notes: '',
  })

  useEffect(() => {
    fetchPreparations()
    fetchDoughStocks()
    fetchStocks()
  }, [])

  // Available rice stock
  const availableRiceStock = stocks.find(
    s => s.riceType === parseInt(form.productType)
  )

  // Available dough stock
  const availableDoughStock = doughStocks.find(
    s => s.productType === parseInt(form.productType)
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addNewPreparation({
        ...form,
        productType: parseInt(form.productType),
        riceUsedKg: parseFloat(form.riceUsedKg),
        doughProducedKg: parseFloat(form.doughProducedKg),
        preparationDate: new Date(form.preparationDate).toISOString(),
      })
      toast.success('Preparation recorded & stocks updated!')
      resetForm()
    } catch (err) {
      toast.error(err.message || 'Failed to record preparation!')
    }
  }

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Delete this preparation?</p>
        <p className="text-xs text-gray-500">
          ⚠️ Rice will be restored, Dough will be deducted
        </p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              await deletePreparationById(id)
              toast.success('Preparation deleted & stocks restored!')
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
      productType: 1,
      riceUsedKg: '',
      millingDone: false,
      sievingDone: false,
      doughProducedKg: '',
      preparationDate: new Date().toISOString().split('T')[0],
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
  const totalPreparations = preparations.length
  const totalRiceUsed = preparations.reduce((sum, p) => sum + p.riceUsedKg, 0)
  const totalDoughProduced = preparations.reduce((sum, p) => sum + p.doughProducedKg, 0)

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-2xl font-semibold
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Preparation
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Team 1 — Rice to Dough preparation
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
          + New Preparation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Preparations', value: totalPreparations, color: isDark ? 'text-white' : 'text-gray-900', suffix: '' },
          { label: 'Total Rice Used', value: totalRiceUsed.toFixed(1), color: 'text-red-400', suffix: 'kg' },
          { label: 'Total Dough Produced', value: totalDoughProduced.toFixed(1), color: 'text-green-500', suffix: 'kg' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl p-5 border
            ${isDark
              ? 'bg-[#141414] border-[#232323]'
              : 'bg-white border-gray-200'}`}>
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-semibold ${stat.color}`}>
              {stat.value}
              <span className="text-sm ml-1 font-normal text-gray-500">
                {stat.suffix}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Stock Status */}
      <div className={`rounded-xl p-5 border mb-6 grid grid-cols-2 gap-6
        ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>

        {/* Rice Stock */}
        <div>
          <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">
            Rice Stock
          </p>
          <div className="space-y-2">
            {stocks.map(s => (
              <div key={s.id} className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{s.riceTypeName}</span>
                <span className={`text-sm font-semibold
                  ${s.isLowStock ? 'text-red-400' : 'text-green-500'}`}>
                  {s.quantityKg} kg
                  {s.isLowStock && ' ⚠️'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dough Stock */}
        <div>
          <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">
            Dough Stock
          </p>
          <div className="space-y-2">
            {doughStocks.length === 0 ? (
              <p className="text-sm text-gray-600">No dough stock yet</p>
            ) : (
              doughStocks.map(s => (
                <div key={s.id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{s.productTypeName}</span>
                  <span className={`text-sm font-semibold
                    ${s.isLowStock ? 'text-red-400' : 'text-green-500'}`}>
                    {s.quantityKg} kg
                    {s.isLowStock && ' ⚠️'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-xl border overflow-hidden
        ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
        <div className={`px-6 py-4 border-b
          ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <p className={`text-sm font-medium
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Preparation History
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className={`border-b
              ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
              {['#', 'Date', 'Type', 'Rice Used',
                'Milling', 'Sieving', 'Dough Produced', 'Notes', ''].map(h => (
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
                <td colSpan="9" className="text-center py-12 text-gray-600">
                  Loading...
                </td>
              </tr>
            ) : preparations.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-12 text-gray-600">
                  No preparations yet — start one!
                </td>
              </tr>
            ) : (
              preparations.map((p, i) => (
                <tr key={p.id}
                  className={`border-b transition-colors
                    ${isDark
                      ? 'border-[#1a1a1a] hover:bg-[#171717]'
                      : 'border-gray-50 hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 text-gray-500 text-sm">{i + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(p.preparationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5
                      rounded-full text-xs font-medium border
                      ${p.productType === 1
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {p.productTypeName}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {p.riceUsedKg} kg
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium
                      ${p.millingDone ? 'text-green-500' : 'text-gray-600'}`}>
                      {p.millingDone ? '✓ Done' : '✗ No'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium
                      ${p.sievingDone ? 'text-green-500' : 'text-gray-600'}`}>
                      {p.sievingDone ? '✓ Done' : '✗ No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-500">
                    {p.doughProducedKg} kg
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {p.notes || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className={`p-1.5 rounded-lg transition-colors
                        ${isDark
                          ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
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

      {/* Modal */}
      <Modal show={showModal} onClose={resetForm} isDark={isDark}>
        <div className={`px-6 py-5 border-b
          ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <h2 className={`text-base font-semibold
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            New Preparation
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Team 1 — Rice to Dough
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">

          {/* Product Type */}
          <div>
            <label className={labelClass}>Product Type *</label>
            <select
              value={form.productType}
              onChange={e => setForm({ ...form, productType: e.target.value })}
              className={inputClass}
            >
              {PRODUCT_TYPES.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Available Rice Stock */}
          {availableRiceStock && (
            <div className={`rounded-lg px-4 py-2.5 border
              ${availableRiceStock.isLowStock
                ? 'bg-red-500/10 border-red-500/20'
                : isDark
                  ? 'bg-[#0f0f0f] border-[#2a2a2a]'
                  : 'bg-gray-50 border-gray-200'}`}>
              <p className="text-xs text-gray-500">Available Rice Stock</p>
              <p className={`text-sm font-semibold mt-0.5
                ${availableRiceStock.isLowStock ? 'text-red-400' : 'text-green-500'}`}>
                {availableRiceStock.quantityKg} kg
                {availableRiceStock.isLowStock && ' ⚠️ Low!'}
              </p>
            </div>
          )}

          {/* Rice Used */}
          <div>
            <label className={labelClass}>Rice Used (Kg) *</label>
            <input
              type="number" required min="0.1" step="0.1"
              value={form.riceUsedKg}
              onChange={e => setForm({ ...form, riceUsedKg: e.target.value })}
              className={inputClass}
              placeholder="0.0"
            />
          </div>

          {/* Milling + Sieving checkboxes */}
          <div className={`grid grid-cols-2 gap-3 p-4 rounded-lg border
            ${isDark ? 'bg-[#0f0f0f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="milling"
                checked={form.millingDone}
                onChange={e => setForm({ ...form, millingDone: e.target.checked })}
                className="w-4 h-4 accent-green-500"
              />
              <label htmlFor="milling" className={`text-sm
                ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Milling Done
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="sieving"
                checked={form.sievingDone}
                onChange={e => setForm({ ...form, sievingDone: e.target.checked })}
                className="w-4 h-4 accent-green-500"
              />
              <label htmlFor="sieving" className={`text-sm
                ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Sieving Done
              </label>
            </div>
          </div>

          {/* Dough Produced */}
          <div>
            <label className={labelClass}>Dough Produced (Kg) *</label>
            <input
              type="number" required min="0.1" step="0.1"
              value={form.doughProducedKg}
              onChange={e => setForm({ ...form, doughProducedKg: e.target.value })}
              className={inputClass}
              placeholder="0.0"
            />
          </div>

          {/* Date */}
          <div>
            <label className={labelClass}>Preparation Date *</label>
            <input
              type="date" required
              value={form.preparationDate}
              onChange={e => setForm({ ...form, preparationDate: e.target.value })}
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
              {loading ? 'Saving...' : 'Record Preparation'}
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

export default PreparationPage