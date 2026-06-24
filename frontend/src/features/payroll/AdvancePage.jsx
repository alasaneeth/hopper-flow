import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Trash2, Settings } from 'lucide-react'
import usePayroll from './usePayroll'
import Modal from '../../components/common/Modal'
import StatCard from '../../components/common/StatCard'
import PageHeader from '../../components/common/PageHeader'
import InputField from '../../components/common/InputField'

const AdvancePage = () => {
  const isDark = useSelector(state => state.theme.isDark)
  const {
    employees, advances, loading,
    fetchEmployees, fetchAdvances,
    addNewAdvance, editInstallment, deleteAdvanceById
  } = usePayroll()

  const [showModal, setShowModal] = useState(false)
  const [showAdjustModal, setShowAdjustModal] = useState(false)
  const [selectedAdvance, setSelectedAdvance] = useState(null)
  const [newInstallment, setNewInstallment] = useState('')

  const [form, setForm] = useState({
    employeeId: '',
    totalAmount: '',
    totalMonths: '3',
    startDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchEmployees()
    fetchAdvances()
  }, [])

  const monthlyInstallment = form.totalAmount && form.totalMonths
    ? (parseFloat(form.totalAmount) / parseInt(form.totalMonths)).toFixed(2)
    : '0.00'

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addNewAdvance({
        ...form,
        employeeId: parseInt(form.employeeId),
        totalAmount: parseFloat(form.totalAmount),
        totalMonths: parseInt(form.totalMonths),
        startDate: new Date(form.startDate).toISOString(),
      })
      toast.success('Advance created!')
      resetForm()
    } catch (err) {
      toast.error(err.message || 'Failed to create advance!')
    }
  }

  const handleAdjustSubmit = async (e) => {
    e.preventDefault()
    try {
      await editInstallment(selectedAdvance.id, parseFloat(newInstallment))
      toast.success('Installment adjusted!')
      setShowAdjustModal(false)
      setSelectedAdvance(null)
      setNewInstallment('')
    } catch (err) {
      toast.error(err.message || 'Failed to adjust installment!')
    }
  }

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Delete this advance?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              await deleteAdvanceById(id)
              toast.success('Advance deleted!')
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
      employeeId: '',
      totalAmount: '',
      totalMonths: '3',
      startDate: new Date().toISOString().split('T')[0],
    })
    setShowModal(false)
  }

  const activeEmployees = employees.filter(e => e.isActive)
  const totalOutstanding = advances.reduce((sum, a) => sum + a.remainingAmount, 0)

  return (
    <div>
      <PageHeader
        title="Advances"
        subtitle="Manage employee advances and installments"
        isDark={isDark}
        action={
          <button
            onClick={() => setShowModal(true)}
            className={`text-sm font-medium px-4 py-2 rounded-lg
              transition-colors
              ${isDark ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
          >
            + New Advance
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard label="Active Advances" value={advances.filter(a => !a.isCompleted).length} isDark={isDark} />
        <StatCard label="Total Outstanding" value={`Rs. ${totalOutstanding.toLocaleString()}`} color="text-red-400" isDark={isDark} />
      </div>

      <div className={`rounded-xl border overflow-hidden
        ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
        <div className={`px-6 py-4 border-b ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Active Advances
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
              {['Employee', 'Total', 'Monthly', 'Remaining', 'Progress', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center py-12 text-gray-600">Loading...</td></tr>
            ) : advances.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-12 text-gray-600">No advances yet — add one!</td></tr>
            ) : (
              advances.map(a => (
                <tr key={a.id}
                  className={`border-b transition-colors
                    ${isDark ? 'border-[#1a1a1a] hover:bg-[#171717]' : 'border-gray-50 hover:bg-gray-50'}`}>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {a.employeeName}
                    </p>
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Rs. {a.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    Rs. {a.monthlyInstallment.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-red-400">
                    Rs. {a.remainingAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {a.paidMonths} / {a.totalMonths} months
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5
                      rounded-full text-xs font-medium border
                      ${a.isCompleted
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                      {a.isCompleted ? 'Completed' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {!a.isCompleted && (
                        <button
                          onClick={() => {
                            setSelectedAdvance(a)
                            setNewInstallment(a.monthlyInstallment.toString())
                            setShowAdjustModal(true)
                          }}
                          className={`p-1.5 rounded-lg transition-colors
                            ${isDark
                              ? 'text-gray-500 hover:text-white hover:bg-[#2a2a2a]'
                              : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
                          title="Adjust Installment"
                        >
                          <Settings size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(a.id)}
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

      <Modal show={showModal} onClose={resetForm} isDark={isDark} maxWidth="max-w-md">
        <div className={`px-6 py-5 border-b ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            New Advance
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Default 3 months — can be adjusted later
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
          <div>
            <label className="block text-xs mb-1.5 text-gray-500">Employee *</label>
            <select
              required
              value={form.employeeId}
              onChange={e => setForm({ ...form, employeeId: e.target.value })}
              className={`w-full px-3 py-2.5 rounded-lg text-sm
                focus:outline-none focus:ring-1 focus:ring-green-500/50
                ${isDark ? 'bg-[#0f0f0f] border border-[#2a2a2a] text-white' : 'bg-gray-50 border border-gray-200 text-gray-900'}`}
            >
              <option value="">Select employee</option>
              {activeEmployees.map(e => (
                <option key={e.id} value={e.id}>{e.name} ({e.employeeId})</option>
              ))}
            </select>
          </div>
          <InputField
            label="Total Amount *"
            type="number" required min="1" step="0.01"
            value={form.totalAmount}
            onChange={e => setForm({ ...form, totalAmount: e.target.value })}
            placeholder="0.00"
            isDark={isDark}
          />
          <InputField
            label="Total Months *"
            type="number" required min="1" max="12"
            value={form.totalMonths}
            onChange={e => setForm({ ...form, totalMonths: e.target.value })}
            isDark={isDark}
          />

          <div className={`rounded-lg px-4 py-3 border
            ${isDark ? 'bg-[#0f0f0f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'}`}>
            <p className="text-xs text-gray-500">Monthly Installment</p>
            <p className="text-lg font-semibold text-green-500 mt-0.5">
              Rs. {parseFloat(monthlyInstallment).toLocaleString()}
            </p>
          </div>

          <InputField
            label="Start Date *"
            type="date" required
            value={form.startDate}
            onChange={e => setForm({ ...form, startDate: e.target.value })}
            isDark={isDark}
          />

          <div className={`flex gap-3 pt-2 border-t ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
            <button
              type="submit" disabled={loading}
              className={`text-sm font-medium px-5 py-2 rounded-lg
                transition-colors disabled:opacity-40
                ${isDark ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
            >
              {loading ? 'Saving...' : 'Create Advance'}
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

      <Modal show={showAdjustModal} onClose={() => setShowAdjustModal(false)} isDark={isDark} maxWidth="max-w-md">
        <div className={`px-6 py-5 border-b ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Adjust Installment
          </h2>
          {selectedAdvance && (
            <p className="text-xs text-gray-500 mt-0.5">
              {selectedAdvance.employeeName} — Remaining: Rs. {selectedAdvance.remainingAmount.toLocaleString()}
            </p>
          )}
        </div>
        <form onSubmit={handleAdjustSubmit} className="px-6 py-5 space-y-3">
          <InputField
            label="New Monthly Installment *"
            type="number" required min="0.01" step="0.01"
            max={selectedAdvance?.remainingAmount}
            value={newInstallment}
            onChange={e => setNewInstallment(e.target.value)}
            placeholder="0.00"
            isDark={isDark}
          />
          <div className={`flex gap-3 pt-2 border-t ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
            <button
              type="submit" disabled={loading}
              className={`text-sm font-medium px-5 py-2 rounded-lg
                transition-colors disabled:opacity-40
                ${isDark ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
            >
              {loading ? 'Saving...' : 'Update'}
            </button>
            <button
              type="button" onClick={() => setShowAdjustModal(false)}
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

export default AdvancePage