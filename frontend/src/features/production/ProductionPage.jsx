import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Trash2 } from 'lucide-react'
import useProduction from './useProduction'
import Modal from '../../components/common/Modal'
import StatCard from '../../components/common/StatCard'
import PageHeader from '../../components/common/PageHeader'
import InputField from '../../components/common/InputField'

const PRODUCT_TYPES = [
  { value: 1, label: 'White String Hopper' },
  { value: 2, label: 'Red String Hopper' },
]

const ProductionPage = () => {
  const isDark = useSelector(state => state.theme.isDark)
  const {
    batches, doughStocks, loading,
    fetchBatches, fetchDoughStocks,
    addNewBatch, deleteBatchById,
  } = useProduction()

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    productType: 1,
    doughUsedKg: '',
    hoppersProduced: '',
    productionDate: new Date().toISOString().split('T')[0],
    isSpecialOrder: false,
    notes: '',
  })

  useEffect(() => {
    fetchBatches()
    fetchDoughStocks()
  }, [])

  const availableDoughStock = doughStocks.find(s => s.productType === parseInt(form.productType))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addNewBatch({
        productType: parseInt(form.productType),
        doughUsedKg: parseFloat(form.doughUsedKg),
        hoppersProduced: parseInt(form.hoppersProduced),
        isSpecialOrder: form.isSpecialOrder,
        productionDate: new Date(form.productionDate).toISOString(),
        notes: form.notes,
      })
      toast.success('Production batch recorded & dough stock updated!')
      resetForm()
    } catch (err) {
      toast.error(err.message || 'Failed to record batch!')
    }
  }

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Delete this batch?</p>
        <p className="text-xs text-gray-500">⚠️ Dough stock will be restored automatically</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              await deleteBatchById(id)
              toast.success('Batch deleted & dough stock restored!')
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
      doughUsedKg: '',
      hoppersProduced: '',
      productionDate: new Date().toISOString().split('T')[0],
      isSpecialOrder: false,
      notes: '',
    })
    setShowModal(false)
  }

  const totalBatches = batches.length
  const totalHoppers = batches.reduce((sum, b) => sum + b.hoppersProduced, 0)
  const specialOrders = batches.filter(b => b.isSpecialOrder).length

  return (
    <div>
      <PageHeader
        title="String Hoppers"
        subtitle="Team 2 — Dough to String Hopper production"
        isDark={isDark}
        action={
          <button
            onClick={() => setShowModal(true)}
            className={`text-sm font-medium px-4 py-2 rounded-lg
              transition-colors
              ${isDark ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
          >
            + New Batch
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Batches" value={totalBatches} isDark={isDark} />
        <StatCard label="Hoppers Produced" value={totalHoppers.toLocaleString()} color="text-green-500" isDark={isDark} />
        <StatCard label="Special Orders" value={specialOrders} color="text-yellow-400" isDark={isDark} />
      </div>

      <div className={`rounded-xl p-5 border mb-6
        ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Dough Stock Available</p>
        {doughStocks.length === 0 ? (
          <p className="text-sm text-gray-600">No dough available — Preparation (Team 1) needed first!</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {doughStocks.map(s => (
              <div key={s.id} className={`rounded-lg px-4 py-3 border
                ${s.isLowStock
                  ? 'bg-red-500/10 border-red-500/20'
                  : isDark ? 'bg-[#0f0f0f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-xs text-gray-500 mb-1">{s.productTypeName}</p>
                <p className={`text-xl font-semibold ${s.isLowStock ? 'text-red-400' : 'text-green-500'}`}>
                  {s.quantityKg} kg{s.isLowStock && ' ⚠️'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`rounded-xl border overflow-hidden
        ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
        <div className={`px-6 py-4 border-b ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Production History
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
              {['#', 'Date', 'Type', 'Dough Used', 'Hoppers', 'Special', 'Notes', ''].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center py-12 text-gray-600">Loading...</td></tr>
            ) : batches.length === 0 ? (
              <tr><td colSpan="8" className="text-center py-12 text-gray-600">No batches yet — start production!</td></tr>
            ) : (
              batches.map((b, i) => (
                <tr key={b.id}
                  className={`border-b transition-colors
                    ${isDark ? 'border-[#1a1a1a] hover:bg-[#171717]' : 'border-gray-50 hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 text-gray-500 text-sm">{i + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(b.productionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5
                      rounded-full text-xs font-medium border
                      ${b.productType === 1
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {b.productTypeName}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {b.doughUsedKg} kg
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-500">
                    {b.hoppersProduced.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {b.isSpecialOrder ? (
                      <span className="inline-flex items-center px-2.5 py-0.5
                        rounded-full text-xs font-medium border
                        bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                        ⭐ Special
                      </span>
                    ) : (
                      <span className="text-gray-600 text-xs">Normal</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {b.notes || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(b.id)}
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

      <Modal show={showModal} onClose={resetForm} isDark={isDark}>
        <div className={`px-6 py-5 border-b ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            New Production Batch
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Team 2 — Dough stock will auto deduct on save</p>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
          <div>
            <label className="block text-xs mb-1.5 text-gray-500">Product Type *</label>
            <select
              value={form.productType}
              onChange={e => setForm({ ...form, productType: e.target.value })}
              className={`w-full px-3 py-2.5 rounded-lg text-sm
                focus:outline-none focus:ring-1 focus:ring-green-500/50
                ${isDark ? 'bg-[#0f0f0f] border border-[#2a2a2a] text-white' : 'bg-gray-50 border border-gray-200 text-gray-900'}`}
            >
              {PRODUCT_TYPES.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {availableDoughStock ? (
            <div className={`rounded-lg px-4 py-2.5 border
              ${availableDoughStock.isLowStock
                ? 'bg-red-500/10 border-red-500/20'
                : isDark ? 'bg-[#0f0f0f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'}`}>
              <p className="text-xs text-gray-500">Available Dough Stock</p>
              <p className={`text-sm font-semibold mt-0.5 ${availableDoughStock.isLowStock ? 'text-red-400' : 'text-green-500'}`}>
                {availableDoughStock.quantityKg} kg{availableDoughStock.isLowStock && ' ⚠️ Low!'}
              </p>
            </div>
          ) : (
            <div className="rounded-lg px-4 py-2.5 border bg-red-500/10 border-red-500/20">
              <p className="text-xs text-red-400">⚠️ No dough stock — Complete Preparation first!</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Dough Used (Kg) *"
              type="number" required min="0.1" step="0.1"
              value={form.doughUsedKg}
              onChange={e => setForm({ ...form, doughUsedKg: e.target.value })}
              placeholder="0.0"
              isDark={isDark}
            />
            <InputField
              label="Hoppers Produced *"
              type="number" required min="1"
              value={form.hoppersProduced}
              onChange={e => setForm({ ...form, hoppersProduced: e.target.value })}
              placeholder="0"
              isDark={isDark}
            />
          </div>

          <InputField
            label="Production Date *"
            type="date" required
            value={form.productionDate}
            onChange={e => setForm({ ...form, productionDate: e.target.value })}
            isDark={isDark}
          />

          <div className={`flex items-center justify-between px-4 py-3 rounded-lg border
            ${isDark ? 'bg-[#0f0f0f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'}`}>
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Special Order</p>
              <p className="text-xs text-gray-500">Mark as special customer order</p>
            </div>
            <input
              type="checkbox"
              checked={form.isSpecialOrder}
              onChange={e => setForm({ ...form, isSpecialOrder: e.target.checked })}
              className="w-4 h-4 accent-green-500"
            />
          </div>

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
              {loading ? 'Saving...' : 'Record Batch'}
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
    </div>
  )
}

export default ProductionPage