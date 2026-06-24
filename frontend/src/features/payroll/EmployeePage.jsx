import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Pencil, Trash2 } from 'lucide-react'
import usePayroll from './usePayroll'
import Modal from '../../components/common/Modal'
import StatCard from '../../components/common/StatCard'
import PageHeader from '../../components/common/PageHeader'
import InputField from '../../components/common/InputField'

const ROLES = [
  { value: 1, label: 'Milling Team' },
  { value: 2, label: 'Production Team' },
  { value: 3, label: 'Sales Team' },
  { value: 4, label: 'Management' },
  { value: 5, label: 'Other' },
]

const SALARY_TYPES = [
  { value: 1, label: 'Daily' },
  { value: 2, label: 'Weekly' },
  { value: 3, label: 'Monthly' },
]

const EmployeePage = () => {
  const isDark = useSelector(state => state.theme.isDark)
  const {
    employees, loading,
    fetchEmployees, addNewEmployee,
    editEmployee, deleteEmployeeById
  } = usePayroll()

  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', role: 1, salaryType: 1,
    salaryRate: '', joinDate: new Date().toISOString().split('T')[0],
    isActive: true
  })

  useEffect(() => { fetchEmployees() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        role: parseInt(form.role),
        salaryType: parseInt(form.salaryType),
        salaryRate: parseFloat(form.salaryRate),
      }
      if (editMode) {
        await editEmployee(selectedId, payload)
        toast.success('Employee updated!')
      } else {
        await addNewEmployee(payload)
        toast.success('Employee added!')
      }
      resetForm()
    } catch (err) {
      toast.error(err.message || 'Something went wrong!')
    }
  }

  const handleEdit = (emp) => {
    setForm({
      name: emp.name,
      phone: emp.phone,
      role: emp.role,
      salaryType: emp.salaryType,
      salaryRate: emp.salaryRate,
      joinDate: emp.joinDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      isActive: emp.isActive
    })
    setSelectedId(emp.id)
    setEditMode(true)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Delete this employee?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              await deleteEmployeeById(id)
              toast.success('Employee deleted!')
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
      name: '', phone: '', role: 1, salaryType: 1,
      salaryRate: '', joinDate: new Date().toISOString().split('T')[0],
      isActive: true
    })
    setShowModal(false)
    setEditMode(false)
    setSelectedId(null)
  }

  return (
    <div>
      <PageHeader
        title="Employees"
        subtitle="Manage employees and salary settings"
        isDark={isDark}
        action={
          <>
            <button
              onClick={() => setShowAll(!showAll)}
              className={`text-sm px-4 py-2 rounded-lg border transition-colors
                ${showAll
                  ? 'border-green-500/50 text-green-400 bg-green-500/10'
                  : isDark
                    ? 'border-[#2a2a2a] text-gray-500 hover:text-white'
                    : 'border-gray-200 text-gray-500 hover:text-gray-900'}`}
            >
              {showAll ? '👁 All' : '👁 Active Only'}
            </button>
            <button
              onClick={() => { setEditMode(false); setShowModal(true) }}
              className={`text-sm font-medium px-4 py-2 rounded-lg
                transition-colors
                ${isDark ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
            >
              + Add Employee
            </button>
          </>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Employees" value={employees.length} isDark={isDark} />
        <StatCard label="Active" value={employees.filter(e => e.isActive).length} color="text-green-500" isDark={isDark} />
        <StatCard label="Inactive" value={employees.filter(e => !e.isActive).length} color="text-red-400" isDark={isDark} />
      </div>

      <div className={`rounded-xl border overflow-hidden
        ${isDark ? 'bg-[#141414] border-[#232323]' : 'bg-white border-gray-200'}`}>
        <div className={`px-6 py-4 border-b ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            All Employees
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
              {['Emp ID', 'Name', 'Phone', 'Role', 'Salary Type', 'Rate', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center py-12 text-gray-600">Loading...</td></tr>
            ) : employees.filter(e => showAll ? true : e.isActive).length === 0 ? (
              <tr><td colSpan="8" className="text-center py-12 text-gray-600">No employees yet — add one!</td></tr>
            ) : (
              employees
                .filter(e => showAll ? true : e.isActive)
                .map(e => (
                <tr key={e.id}
                  className={`border-b transition-colors
                    ${isDark ? 'border-[#1a1a1a] hover:bg-[#171717]' : 'border-gray-50 hover:bg-gray-50'}`}>
                  <td className={`px-6 py-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {e.employeeId}
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {e.name}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{e.phone || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{e.roleName}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{e.salaryTypeName}</td>
                  <td className="px-6 py-4 text-sm text-green-500">
                    Rs. {e.salaryRate.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5
                      rounded-full text-xs font-medium border
                      ${e.isActive
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {e.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(e)}
                        className={`p-1.5 rounded-lg transition-colors
                          ${isDark
                            ? 'text-gray-500 hover:text-white hover:bg-[#2a2a2a]'
                            : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
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

      <Modal show={showModal} onClose={resetForm} isDark={isDark}>
        <div className={`px-6 py-5 border-b ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
          <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {editMode ? 'Edit Employee' : 'New Employee'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {editMode ? 'Update employee details' : 'Employee ID auto-generated'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
          <InputField
            label="Name *"
            type="text" required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Employee name"
            isDark={isDark}
          />
          <InputField
            label="Phone"
            type="text"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            placeholder="077XXXXXXX"
            isDark={isDark}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1.5 text-gray-500">Role *</label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-lg text-sm
                  focus:outline-none focus:ring-1 focus:ring-green-500/50
                  ${isDark ? 'bg-[#0f0f0f] border border-[#2a2a2a] text-white' : 'bg-gray-50 border border-gray-200 text-gray-900'}`}
              >
                {ROLES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1.5 text-gray-500">Salary Type *</label>
              <select
                value={form.salaryType}
                onChange={e => setForm({ ...form, salaryType: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-lg text-sm
                  focus:outline-none focus:ring-1 focus:ring-green-500/50
                  ${isDark ? 'bg-[#0f0f0f] border border-[#2a2a2a] text-white' : 'bg-gray-50 border border-gray-200 text-gray-900'}`}
              >
                {SALARY_TYPES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
          <InputField
            label={`Salary Rate * (${SALARY_TYPES.find(s => s.value === parseInt(form.salaryType))?.label} rate)`}
            type="number" required min="0" step="0.01"
            value={form.salaryRate}
            onChange={e => setForm({ ...form, salaryRate: e.target.value })}
            placeholder="0.00"
            isDark={isDark}
          />
          {!editMode && (
            <InputField
              label="Join Date *"
              type="date" required
              value={form.joinDate}
              onChange={e => setForm({ ...form, joinDate: e.target.value })}
              isDark={isDark}
            />
          )}
          {editMode && (
            <div className="flex items-center gap-3">
              <label className="block text-xs mb-1.5 text-gray-500">Active</label>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={e => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 accent-green-500"
              />
            </div>
          )}
          <div className={`flex gap-3 pt-2 border-t ${isDark ? 'border-[#232323]' : 'border-gray-100'}`}>
            <button
              type="submit" disabled={loading}
              className={`text-sm font-medium px-5 py-2 rounded-lg
                transition-colors disabled:opacity-40
                ${isDark ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
            >
              {loading ? 'Saving...' : editMode ? 'Update' : 'Save'}
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

export default EmployeePage