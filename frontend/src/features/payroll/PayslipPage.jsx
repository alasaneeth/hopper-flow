import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ArrowLeft, Printer } from 'lucide-react'
import usePayroll from './usePayroll'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const PayslipPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isDark = useSelector(state => state.theme.isDark)
  const { payrolls, fetchPayrolls } = usePayroll()

  const today = new Date()

  useEffect(() => {
    if (payrolls.length === 0) {
      fetchPayrolls(today.getMonth() + 1, today.getFullYear())
    }
  }, [])

  const payslip = payrolls.find(p => p.id === parseInt(id))

  if (!payslip) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Loading payslip...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 print:hidden">
        <button
          onClick={() => navigate('/payroll')}
          className={`flex items-center gap-2 text-sm
            ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <ArrowLeft size={16} />
          Back to Payroll
        </button>
        <button
          onClick={() => window.print()}
          className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg
            transition-colors
            ${isDark ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
        >
          <Printer size={16} />
          Print Payslip
        </button>
      </div>

      <div className={`max-w-xl mx-auto rounded-2xl border p-8
        print:border-none print:shadow-none print:rounded-none
        ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>

        <div className={`text-center mb-8 pb-6 border-b ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <h1 className="text-2xl font-bold text-green-500">HopperFlow</h1>
          <p className="text-sm text-gray-500 mt-1">
            Payslip — {MONTHS[payslip.month - 1]} {payslip.year}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Employee</p>
            <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {payslip.employeeName}
            </p>
            <p className="text-xs text-gray-500 mt-1">{payslip.employeeIdCard}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Role</p>
            <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {payslip.roleName}
            </p>
            <p className="text-xs text-gray-500 mt-1">{payslip.salaryTypeName} Salary</p>
          </div>
        </div>

        <table className="w-full text-sm mb-6">
          <tbody>
            <tr className={`border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-50'}`}>
              <td className="py-3 text-gray-500">Days Worked</td>
              <td className={`py-3 text-right font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {payslip.daysWorked}
              </td>
            </tr>
            <tr className={`border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-50'}`}>
              <td className="py-3 text-gray-500">Salary Rate</td>
              <td className={`py-3 text-right font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Rs. {payslip.salaryRate.toLocaleString()}
              </td>
            </tr>
            <tr className={`border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-50'}`}>
              <td className="py-3 text-gray-500">Basic Salary</td>
              <td className={`py-3 text-right font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Rs. {payslip.basicSalary.toLocaleString()}
              </td>
            </tr>
            <tr className={`border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-50'}`}>
              <td className="py-3 text-gray-500">Bonus</td>
              <td className="py-3 text-right font-medium text-green-500">
                + Rs. {payslip.bonus.toLocaleString()}
              </td>
            </tr>
            <tr className={`border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-50'}`}>
              <td className="py-3 text-gray-500">Advance Deduction</td>
              <td className="py-3 text-right font-medium text-red-400">
                - Rs. {payslip.advanceDeduction.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>

        <div className={`flex justify-between items-center pt-4 border-t ${isDark ? 'border-[#232323]' : 'border-gray-200'}`}>
          <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Net Salary
          </span>
          <span className="text-2xl font-bold text-green-500">
            Rs. {payslip.netSalary.toLocaleString()}
          </span>
        </div>

        <div className="mt-4 flex justify-end">
          <span className={`inline-flex items-center px-3 py-1
            rounded-full text-xs font-medium border
            ${payslip.isPaid
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
            {payslip.isPaid ? 'Paid' : 'Pending'}
          </span>
        </div>

        <div className={`mt-8 pt-6 border-t text-center ${isDark ? 'border-[#232323]' : 'border-gray-200'}`}>
          <p className="text-xs text-gray-500">
            This is a computer-generated payslip.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PayslipPage