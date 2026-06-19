import { useDispatch, useSelector } from 'react-redux'
import {
  setLoading, setError,
  setEmployees,
  setAttendance,
  setAdvances, removeAdvance,
  setPayrolls,
} from './payrollSlice'
import {
  getAllEmployees, createEmployee, updateEmployee, deleteEmployee,
  getAttendanceByMonth, markAttendance, markBulkAttendance,
  getAllAdvances, createAdvance, adjustInstallment, deleteAdvance,
  getPayrollByMonth, generatePayroll, markPayrollAsPaid,
} from './payrollApi'

const usePayroll = () => {
  const dispatch = useDispatch()
  const { employees, attendance, advances, payrolls, loading, error } =
    useSelector(state => state.payroll)

  // ===== Employees =====
  const fetchEmployees = async () => {
    try {
      dispatch(setLoading(true))
      const res = await getAllEmployees()
      dispatch(setEmployees(res.data))
    } catch {
      dispatch(setError('Failed to fetch employees'))
    }
  }

  const addNewEmployee = async (data) => {
    try {
      dispatch(setLoading(true))
      await createEmployee(data)
      await fetchEmployees()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create employee'
      dispatch(setError(msg))
      throw new Error(msg)
    }
  }

  const editEmployee = async (id, data) => {
    try {
      dispatch(setLoading(true))
      await updateEmployee(id, data)
      await fetchEmployees()
    } catch {
      dispatch(setError('Failed to update employee'))
      throw new Error('Failed to update employee')
    }
  }

  const deleteEmployeeById = async (id) => {
    try {
      dispatch(setLoading(true))
      await deleteEmployee(id)
      await fetchEmployees()
    } catch {
      dispatch(setError('Failed to delete employee'))
    }
  }

  // ===== Attendance =====
  const fetchAttendance = async (month, year) => {
    try {
      dispatch(setLoading(true))
      const res = await getAttendanceByMonth(month, year)
      dispatch(setAttendance(res.data))
    } catch {
      dispatch(setError('Failed to fetch attendance'))
    }
  }

  const markSingleAttendance = async (data) => {
    try {
      await markAttendance(data)
    } catch {
      dispatch(setError('Failed to mark attendance'))
      throw new Error('Failed to mark attendance')
    }
  }

  const markAttendanceBulk = async (data) => {
    try {
      dispatch(setLoading(true))
      await markBulkAttendance(data)
    } catch {
      dispatch(setError('Failed to mark attendance'))
      throw new Error('Failed to mark attendance')
    }
  }

  // ===== Advances =====
  const fetchAdvances = async () => {
    try {
      dispatch(setLoading(true))
      const res = await getAllAdvances()
      dispatch(setAdvances(res.data))
    } catch {
      dispatch(setError('Failed to fetch advances'))
    }
  }

  const addNewAdvance = async (data) => {
    try {
      dispatch(setLoading(true))
      const res = await createAdvance(data)
      await fetchAdvances()
      return res.data
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create advance'
      dispatch(setError(msg))
      throw new Error(msg)
    }
  }

  const editInstallment = async (id, newInstallment) => {
    try {
      dispatch(setLoading(true))
      await adjustInstallment(id, newInstallment)
      await fetchAdvances()
    } catch {
      dispatch(setError('Failed to adjust installment'))
      throw new Error('Failed to adjust installment')
    }
  }

  const deleteAdvanceById = async (id) => {
    try {
      dispatch(setLoading(true))
      await deleteAdvance(id)
      await fetchAdvances()
    } catch {
      dispatch(setError('Failed to delete advance'))
    }
  }

  // ===== Payroll =====
  const fetchPayrolls = async (month, year) => {
    try {
      dispatch(setLoading(true))
      const res = await getPayrollByMonth(month, year)
      dispatch(setPayrolls(res.data))
    } catch {
      dispatch(setError('Failed to fetch payroll'))
    }
  }

  const generateMonthlyPayroll = async (data) => {
    try {
      dispatch(setLoading(true))
      const res = await generatePayroll(data)
      await fetchPayrolls(data.month, data.year)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to generate payroll'
      dispatch(setError(msg))
      throw new Error(msg)
    }
  }

  const markAsPaid = async (id, month, year) => {
    try {
      dispatch(setLoading(true))
      await markPayrollAsPaid(id)
      await fetchPayrolls(month, year)
    } catch {
      dispatch(setError('Failed to mark as paid'))
    }
  }

  return {
    employees, attendance, advances, payrolls, loading, error,
    fetchEmployees, addNewEmployee, editEmployee, deleteEmployeeById,
    fetchAttendance, markSingleAttendance, markAttendanceBulk,
    fetchAdvances, addNewAdvance, editInstallment, deleteAdvanceById,
    fetchPayrolls, generateMonthlyPayroll, markAsPaid,
  }
}

export default usePayroll