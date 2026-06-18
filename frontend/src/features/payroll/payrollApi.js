import axiosInstance from '../../api/axiosInstance'

// Employee APIs
export const getAllEmployees = () =>
  axiosInstance.get('/Employee')

export const createEmployee = (data) =>
  axiosInstance.post('/Employee', data)

export const updateEmployee = (id, data) =>
  axiosInstance.put(`/Employee/${id}`, data)

export const deleteEmployee = (id) =>
  axiosInstance.delete(`/Employee/${id}`)

// Attendance APIs
export const getAttendanceByMonth = (month, year) =>
  axiosInstance.get(`/Attendance/month/${month}/${year}`)

export const markAttendance = (data) =>
  axiosInstance.post('/Attendance/mark', data)

export const markBulkAttendance = (data) =>
  axiosInstance.post('/Attendance/mark-bulk', data)

// Advance APIs
export const getAllAdvances = () =>
  axiosInstance.get('/Advance')

export const createAdvance = (data) =>
  axiosInstance.post('/Advance', data)

export const adjustInstallment = (id, newInstallment) =>
  axiosInstance.put(`/Advance/${id}/adjust-installment`, newInstallment)

export const deleteAdvance = (id) =>
  axiosInstance.delete(`/Advance/${id}`)

// Payroll APIs
export const getPayrollByMonth = (month, year) =>
  axiosInstance.get(`/Payroll/month/${month}/${year}`)

export const getPayrollByEmployee = (employeeId) =>
  axiosInstance.get(`/Payroll/employee/${employeeId}`)

export const generatePayroll = (data) =>
  axiosInstance.post('/Payroll/generate', data)

export const markPayrollAsPaid = (id) =>
  axiosInstance.put(`/Payroll/${id}/mark-paid`)