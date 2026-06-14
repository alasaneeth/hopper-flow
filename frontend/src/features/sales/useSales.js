import { useDispatch, useSelector } from 'react-redux'
import {
  setLoading, setError,
  setCustomers, removeCustomer,
  setOrders, removeOrder,
} from './salesSlice'
import {
  getAllCustomers, createCustomer, updateCustomer, deleteCustomer,
  getAllOrders, createOrder, addPayment, deleteOrder,
} from './salesApi'

const useSales = () => {
  const dispatch = useDispatch()
  const { customers, orders, loading, error } =
    useSelector(state => state.sales)

  // ===== Customers =====
  const fetchCustomers = async () => {
    try {
      dispatch(setLoading(true))
      const res = await getAllCustomers()
      dispatch(setCustomers(res.data))
    } catch {
      dispatch(setError('Failed to fetch customers'))
    }
  }

  const addNewCustomer = async (data) => {
    try {
      dispatch(setLoading(true))
      await createCustomer(data)
      await fetchCustomers()
    } catch {
      dispatch(setError('Failed to create customer'))
      throw new Error('Failed to create customer')
    }
  }

  const editCustomer = async (id, data) => {
    try {
      dispatch(setLoading(true))
      await updateCustomer(id, data)
      await fetchCustomers()
    } catch {
      dispatch(setError('Failed to update customer'))
      throw new Error('Failed to update customer')
    }
  }

  const deleteCustomerById = async (id) => {
    try {
      dispatch(setLoading(true))
      await deleteCustomer(id)
      await fetchCustomers()
    } catch {
      dispatch(setError('Failed to delete customer'))
    }
  }

  // ===== Sales Orders =====
  const fetchOrders = async () => {
    try {
      dispatch(setLoading(true))
      const res = await getAllOrders()
      dispatch(setOrders(res.data))
    } catch {
      dispatch(setError('Failed to fetch orders'))
    }
  }

  const addNewOrder = async (data) => {
    try {
      dispatch(setLoading(true))
      const res = await createOrder(data)
      await fetchOrders()
      return res.data
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create order'
      dispatch(setError(msg))
      throw new Error(msg)
    }
  }

  const addOrderPayment = async (id, data) => {
    try {
      dispatch(setLoading(true))
      const res = await addPayment(id, data)
      await fetchOrders()
      return res.data
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add payment'
      dispatch(setError(msg))
      throw new Error(msg)
    }
  }

  const deleteOrderById = async (id) => {
    try {
      dispatch(setLoading(true))
      await deleteOrder(id)
      await fetchOrders()
    } catch {
      dispatch(setError('Failed to delete order'))
    }
  }

  return {
    customers, orders, loading, error,
    fetchCustomers, addNewCustomer, editCustomer, deleteCustomerById,
    fetchOrders, addNewOrder, addOrderPayment, deleteOrderById,
  }
}

export default useSales