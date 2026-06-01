import { useDispatch, useSelector } from 'react-redux'
import {
  setLoading, setError,
  setSuppliers, addSupplier, updateSupplier, removeSupplier,
  setPurchases, addPurchase,
  setStocks,
} from './inventorySlice'
import {
  getAllSuppliers, createSupplier, updateSupplier as updateSupplierApi,
  deleteSupplier,
  getAllPurchases, createPurchase,
  getAllStocks,
} from './inventoryApi'

const useInventory = () => {
  const dispatch = useDispatch()
  const { suppliers, purchases, stocks, loading, error } = 
    useSelector(state => state.inventory)

  // ===== Suppliers =====
  const fetchSuppliers = async () => {
    try {
      dispatch(setLoading(true))
      const res = await getAllSuppliers()
      dispatch(setSuppliers(res.data))
    } catch {
      dispatch(setError('Failed to fetch suppliers'))
    }
  }

  const addNewSupplier = async (data) => {
    try {
      dispatch(setLoading(true))
      await createSupplier(data)
      await fetchSuppliers()
    } catch {
      dispatch(setError('Failed to create supplier'))
    }
  }

  const editSupplier = async (id, data) => {
    try {
      dispatch(setLoading(true))
      await updateSupplierApi(id, data)
      await fetchSuppliers()
    } catch {
      dispatch(setError('Failed to update supplier'))
    }
  }

  const deleteSupplierById = async (id) => {
    try {
      dispatch(setLoading(true))
      await deleteSupplier(id)
      dispatch(removeSupplier(id))
    } catch {
      dispatch(setError('Failed to delete supplier'))
    }
  }

  // ===== Purchases =====
  const fetchPurchases = async () => {
    try {
      dispatch(setLoading(true))
      const res = await getAllPurchases()
      dispatch(setPurchases(res.data))
    } catch {
      dispatch(setError('Failed to fetch purchases'))
    }
  }

  const addNewPurchase = async (data) => {
    try {
      dispatch(setLoading(true))
      await createPurchase(data)
      await fetchPurchases()
      await fetchStocks() // Stock auto refresh!
    } catch {
      dispatch(setError('Failed to create purchase'))
    }
  }

  // ===== Stocks =====
  const fetchStocks = async () => {
    try {
      dispatch(setLoading(true))
      const res = await getAllStocks()
      dispatch(setStocks(res.data))
    } catch {
      dispatch(setError('Failed to fetch stocks'))
    }
  }

  return {
    // State
    suppliers, purchases, stocks, loading, error,
    // Actions
    fetchSuppliers, addNewSupplier, editSupplier, deleteSupplierById,
    fetchPurchases, addNewPurchase,
    fetchStocks,
  }
}

export default useInventory