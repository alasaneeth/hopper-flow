import { useDispatch, useSelector } from 'react-redux'
import {
  setLoading, setError,
  setBatches, removeBatch,
  setPreparations, removePreparation,
  setDoughStocks,
} from './productionSlice'
import {
  getAllBatches, createBatch, deleteBatch,
  getAllPreparations, createPreparation, deletePreparation,
  getDoughStock,
} from './productionApi'
import { setStocks } from '../inventory/inventorySlice'
import { getAllStocks } from '../inventory/inventoryApi'

const useProduction = () => {
  const dispatch = useDispatch()
  const { batches, preparations, doughStocks, loading, error } =
    useSelector(state => state.production)

  // ===== Production Batches (Team 2) =====
  const fetchBatches = async () => {
    try {
      dispatch(setLoading(true))
      const res = await getAllBatches()
      dispatch(setBatches(res.data))
    } catch {
      dispatch(setError('Failed to fetch batches'))
    }
  }

  const addNewBatch = async (data) => {
    try {
      dispatch(setLoading(true))
      await createBatch(data)
      await fetchBatches()
      await fetchDoughStocks()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create batch'
      dispatch(setError(msg))
      throw new Error(msg)
    }
  }

  const deleteBatchById = async (id) => {
    try {
      dispatch(setLoading(true))
      await deleteBatch(id)
      await fetchBatches()
      await fetchDoughStocks()
    } catch {
      dispatch(setError('Failed to delete batch'))
    }
  }

  // ===== Preparations (Team 1) =====
  const fetchPreparations = async () => {
    try {
      dispatch(setLoading(true))
      const res = await getAllPreparations()
      dispatch(setPreparations(res.data))
    } catch {
      dispatch(setError('Failed to fetch preparations'))
    }
  }

  const addNewPreparation = async (data) => {
    try {
      dispatch(setLoading(true))
      await createPreparation(data)
      await fetchPreparations()
      await fetchDoughStocks()
      // Rice stock refresh
      const stockRes = await getAllStocks()
      dispatch(setStocks(stockRes.data))
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create preparation'
      dispatch(setError(msg))
      throw new Error(msg)
    }
  }

  const deletePreparationById = async (id) => {
    try {
      dispatch(setLoading(true))
      await deletePreparation(id)
      await fetchPreparations()
      await fetchDoughStocks()
      // Rice stock refresh
      const stockRes = await getAllStocks()
      dispatch(setStocks(stockRes.data))
    } catch {
      dispatch(setError('Failed to delete preparation'))
    }
  }

  // ===== Dough Stock =====
  const fetchDoughStocks = async () => {
    try {
      const res = await getDoughStock()
      dispatch(setDoughStocks(res.data))
    } catch {
      dispatch(setError('Failed to fetch dough stocks'))
    }
  }

  return {
    batches, preparations, doughStocks, loading, error,
    fetchBatches, addNewBatch, deleteBatchById,
    fetchPreparations, addNewPreparation, deletePreparationById,
    fetchDoughStocks,
  }
}

export default useProduction