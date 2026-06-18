import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import usePayroll from './usePayroll'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const AttendancePage = () => {
  const isDark = useSelector(state => state.theme.isDark)
  const {
    employees, attendance, loading,
    fetchEmployees, fetchAttendance, markAttendanceBulk
  } = usePayroll()

  const today = new Date()
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [year, setYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split('T')[0]
  )
  const [dailyMarks, setDailyMarks] = useState({})

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    fetchAttendance(month, year)
  }, [month, year])

  // Get days in month
  const daysInMonth = new Date(year, month, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // Get attendance for specific employee + day
  const getAttendanceStatus = (employeeId, day) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const record = attendance.find(a =>
      a.employeeId === employeeId &&
      a.date.split('T')[0] === dateStr
    )
    return record ? record.isPresent : null
  }

  const handleToggle = (employeeId) => {
    setDailyMarks(prev => ({
      ...prev,
      [employeeId]: prev[employeeId] === undefined ? true :
        prev[employeeId] === true ? false : true
    }))
  }

  const handleSaveDaily = async () => {
    const entries = Object.entries(dailyMarks)
    if (entries.length === 0) {
      toast.error('Mark at least one employee first!')
      return
    }
    try {
      const payload = entries.map(([employeeId, isPresent]) => ({
        employeeId: parseInt(employeeId),
        date: new Date(selectedDate).toISOString(),
        isPresent
      }))
      await markAttendanceBulk(payload)
      toast.success('Attendance saved!')
      setDailyMarks({})
      fetchAttendance(month, year)
    } catch (err) {
      toast.error(err.message || 'Failed to save attendance!')
    }
  }

  const inputClass = `px-3 py-2 rounded-lg text-sm
    focus:outline-none focus:ring-1 focus:ring-green-500/50
    ${isDark
      ? 'bg-[#0f0f0f] border border-[#2a2a2a] text-white'
      : 'bg-gray-50 border border-gray-200 text-gray-900'}`

  const activeEmployees = employees.filter(e => e.isActive)

  useEffect(() => {
  const existingMarks = {}
  activeEmployees.forEach(emp => {
    const dateStr = selectedDate
    const record = attendance.find(a =>
      a.employeeId === emp.id &&
      a.date.split('T')[0] === dateStr
    )
    if (record) {
      existingMarks[emp.id] = record.isPresent
    }
  })
  setDailyMarks(existingMarks)
}, [selectedDate, attendance])

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-2xl font-semibold
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Attendance
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Mark daily attendance and view monthly records
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
        </div>
      </div>

      {/* Mark Today's Attendance */}
      <div className={`rounded-xl p-6 border mb-6
        ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <p className={`text-sm font-medium
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Mark Attendance
          </p>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {activeEmployees.map(emp => {
            const current = dailyMarks[emp.id]
            return (
              <button
                key={emp.id}
                onClick={() => handleToggle(emp.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg
                  border transition-colors text-left
                  ${current === true
                    ? 'bg-green-500/10 border-green-500/30'
                    : current === false
                      ? 'bg-red-500/10 border-red-500/30'
                      : isDark
                        ? 'bg-[#0f0f0f] border-[#2a2a2a]'
                        : 'bg-gray-50 border-gray-200'}`}
              >
                <div>
                  <p className={`text-sm font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {emp.name}
                  </p>
                  <p className="text-xs text-gray-500">{emp.employeeId}</p>
                </div>
                <span className={`text-xs font-medium
                  ${current === true ? 'text-green-400' :
                    current === false ? 'text-red-400' : 'text-gray-500'}`}>
                  {current === true ? '✓ Present' :
                    current === false ? '✗ Absent' : 'Tap to mark'}
                </span>
              </button>
            )
          })}
        </div>

        <button
          onClick={handleSaveDaily}
          disabled={loading}
          className={`text-sm font-medium px-5 py-2 rounded-lg
            transition-colors disabled:opacity-40
            ${isDark
              ? 'bg-white text-black hover:bg-gray-100'
              : 'bg-gray-900 text-white hover:bg-gray-800'}`}
        >
          {loading ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>

      {/* Monthly Grid */}
      <div className={`rounded-xl border overflow-hidden
        ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
        <div className={`px-6 py-4 border-b
          ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <p className={`text-sm font-medium
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {MONTHS[month - 1]} {year} — Attendance Sheet
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b
                ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
                <th className="text-left px-4 py-3 text-xs text-gray-500
                               font-medium uppercase tracking-wider sticky left-0
                               ${isDark ? 'bg-[#141414]' : 'bg-white'}">
                  Employee
                </th>
                {days.map(d => (
                  <th key={d} className="text-center px-2 py-3 text-xs
                                         text-gray-500 font-medium min-w-[32px]">
                    {d}
                  </th>
                ))}
                <th className="text-center px-4 py-3 text-xs text-gray-500
                               font-medium uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {activeEmployees.map(emp => {
                const presentDays = days.filter(d =>
                  getAttendanceStatus(emp.id, d) === true
                ).length

                return (
                  <tr key={emp.id}
                    className={`border-b
                      ${isDark ? 'border-[#1a1a1a]' : 'border-gray-50'}`}>
                    <td className={`px-4 py-3 text-sm font-medium sticky left-0
                      ${isDark ? 'text-white bg-[#141414]' : 'text-gray-900 bg-white'}`}>
                      {emp.name}
                    </td>
                    {days.map(d => {
                      const status = getAttendanceStatus(emp.id, d)
                      return (
                        <td key={d} className="text-center px-2 py-3">
                          <span className={`inline-block w-2 h-2 rounded-full
                            ${status === true ? 'bg-green-500' :
                              status === false ? 'bg-red-500' :
                              isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'}`}>
                          </span>
                        </td>
                      )
                    })}
                    <td className="text-center px-4 py-3 text-sm font-semibold text-green-500">
                      {presentDays}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AttendancePage