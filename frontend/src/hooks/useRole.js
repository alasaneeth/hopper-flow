import { useSelector } from 'react-redux'

const useRole = () => {
  const role = useSelector(state => state.auth.user?.role)

  return {
    role,
    isAdmin: role === 'Admin',
    isManager: role === 'Manager',
    isCashier: role === 'Cashier',
    isInventoryManager: role === 'InventoryManager',
    isProductionManager: role === 'ProductionManager',
    isHR: role === 'HR',
    canEdit: role === 'Admin',
    canDelete: role === 'Admin',
    canViewInventory: ['Admin', 'Manager', 'InventoryManager'].includes(role),
    canViewProduction: ['Admin', 'Manager', 'ProductionManager'].includes(role),
    canViewSales: ['Admin', 'Manager', 'Cashier'].includes(role),
    canViewPayroll: ['Admin', 'HR'].includes(role),
    canCreateInventory: ['Admin', 'InventoryManager'].includes(role),
    canCreateProduction: ['Admin', 'ProductionManager'].includes(role),
    canCreateSales: ['Admin', 'Manager', 'Cashier'].includes(role),
    canCreatePayroll: ['Admin', 'HR'].includes(role),
  }
}

export default useRole