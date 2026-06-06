import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import {
  setLoading, setError, setBatches, removeBatch
} from './productionSlice'
import {
  getAllBatches, createBatch, deleteBatch
} from './productionApi'
import { setStocks } from '../inventory/inventorySlice'
import { getAllStocks } from '../inventory/inventoryApi'

const useProduction = () => {
  const dispatch = useDispatch()
  const { batches, loading, error } =
    useSelector(state => state.production)

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
      // Stock refresh
      const stockRes = await getAllStocks()
      dispatch(setStocks(stockRes.data))
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
      dispatch(removeBatch(id))
      await fetchBatches()
    } catch {
      dispatch(setError('Failed to delete batch'))
    }
  }

  return {
    batches, loading, error,
    fetchBatches, addNewBatch, deleteBatchById,
  }
}

export default useProduction