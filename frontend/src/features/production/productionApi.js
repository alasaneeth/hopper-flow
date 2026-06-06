import axiosInstance from '../../api/axiosInstance'

export const getAllBatches = () =>
  axiosInstance.get('/Production')

export const createBatch = (data) =>
  axiosInstance.post('/Production', data)

export const deleteBatch = (id) =>
  axiosInstance.delete(`/Production/${id}`)

export const getSpecialOrders = () =>
  axiosInstance.get('/Production/special-orders')