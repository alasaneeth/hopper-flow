import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Receipt } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import usePayroll from './usePayroll'

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

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const PayrollPage = () => {
  const isDark = useSelector(state => state.theme.isDark)
  const navigate = useNavigate()
  const { payrolls, loading, fetchPayrolls, generateMonthlyPayroll, markAsPaid } = usePayroll()

  const today = new Date()
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [year, setYear] = useState(today.getFullYear())
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [bonus, setBonus] = useState('0')

  useEffect(() => {
    fetchPayrolls(month, year)
  }, [month, year])

  const handleGenerate = async (e) => {
    e.preventDefault()
    try {
      const res = await generateMonthlyPayroll({
        month, year, bonus: parseFloat(bonus) || 0
      })
      toast.success(res.message)
      setShowGenerateModal(false)
      setBonus('0')
    } catch (err) {
      toast.error(err.message || 'Failed to generate payroll!')
    }
  }

  const handleMarkPaid = async (id) => {
    await markAsPaid(id, month, year)
    toast.success('Marked as paid!')
  }

  const inputClass = `px-3 py-2 rounded-lg text-sm
    focus:outline-none focus:ring-1 focus:ring-green-500/50
    ${isDark
      ? 'bg-[#0f0f0f] border border-[#2a2a2a] text-white'
      : 'bg-gray-50 border border-gray-200 text-gray-900'}`

  const labelClass = `block text-xs mb-1.5 text-gray-500`

  const totalNet = payrolls.reduce((sum, p) => sum + p.netSalary, 0)
  const totalPaid = payrolls.filter(p => p.isPaid).length

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-2xl font-semibold
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Payroll
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Generate and manage monthly salaries
          </p>
        </div>
        <div className="flex gap-3">
          <select value={month} onChange={e => setMonth(parseInt(e.target.value))} className={inputClass}>
            {MONTHS.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select value={year} onChange={e => setYear(parseInt(e.target.value))} className={inputClass}>
            {[2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={() => setShowGenerateModal(true)}
            className={`text-sm font-medium px-4 py-2 rounded-lg
              transition-colors
              ${isDark
                ? 'bg-white text-black hover:bg-gray-100'
                : 'bg-gray-900 text-white hover:bg-gray-800'}`}
          >
            Generate Payroll
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Employees', value: payrolls.length, color: isDark ? 'text-white' : 'text-gray-900' },
          { label: 'Total Net Salary', value: `Rs. ${totalNet.toLocaleString()}`, color: 'text-green-500' },
          { label: 'Paid', value: `${totalPaid} / ${payrolls.length}`, color: isDark ? 'text-white' : 'text-gray-900' },
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
            {MONTHS[month - 1]} {year} — Payroll
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className={`border-b
              ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
              {['Employee', 'Days', 'Basic', 'Bonus', 'Advance', 'Net Salary', 'Status', ''].map(h => (
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
            ) : payrolls.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-12 text-gray-600">
                  No payroll generated for this month yet
                </td>
              </tr>
            ) : (
              payrolls.map(p => (
                <tr key={p.id}
                  className={`border-b transition-colors
                    ${isDark
                      ? 'border-[#1a1a1a] hover:bg-[#171717]'
                      : 'border-gray-50 hover:bg-gray-50'}`}>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-medium
                      ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {p.employeeName}
                    </p>
                    <p className="text-xs text-gray-500">{p.employeeIdCard}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {p.daysWorked}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    Rs. {p.basicSalary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-green-500">
                    Rs. {p.bonus.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-red-400">
                    Rs. {p.advanceDeduction.toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 text-sm font-semibold
                    ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Rs. {p.netSalary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {p.isPaid ? (
                      <span className="inline-flex items-center px-2.5 py-0.5
                        rounded-full text-xs font-medium border
                        bg-green-500/10 text-green-400 border-green-500/20">
                        Paid
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkPaid(p.id)}
                        className="inline-flex items-center px-2.5 py-0.5
                          rounded-full text-xs font-medium border
                          bg-yellow-500/10 text-yellow-400 border-yellow-500/20
                          hover:bg-yellow-500/20"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/payslip/${p.id}`)}
                      className={`p-1.5 rounded-lg transition-colors
                        ${isDark
                          ? 'text-gray-500 hover:text-white hover:bg-[#2a2a2a]'
                          : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
                      title="View Payslip"
                    >
                      <Receipt size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Generate Modal */}
      <Modal show={showGenerateModal} onClose={() => setShowGenerateModal(false)} isDark={isDark}>
        <div className={`px-6 py-5 border-b
          ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <h2 className={`text-base font-semibold
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Generate Payroll
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {MONTHS[month - 1]} {year} — for all active employees
          </p>
        </div>
        <form onSubmit={handleGenerate} className="px-6 py-5 space-y-3">
          <div className={`rounded-lg px-4 py-3 border
            ${isDark
              ? 'bg-[#0f0f0f] border-[#2a2a2a]'
              : 'bg-gray-50 border-gray-200'}`}>
            <p className="text-xs text-gray-500">
              Calculates based on attendance, applies bonus and active advance deductions automatically.
              Already generated employees will be skipped.
            </p>
          </div>
          <div>
            <label className={labelClass}>Bonus (applies to all employees)</label>
            <input
              type="number" min="0" step="0.01"
              value={bonus}
              onChange={e => setBonus(e.target.value)}
              className={inputClass + ' w-full'}
              placeholder="0.00"
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
              {loading ? 'Generating...' : 'Generate'}
            </button>
            <button
              type="button" onClick={() => setShowGenerateModal(false)}
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

export default PayrollPage