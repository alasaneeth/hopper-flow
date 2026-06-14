import axiosInstance from '../../api/axiosInstance'

// Customer APIs
export const getAllCustomers = () =>
  axiosInstance.get('/Customer')

export const createCustomer = (data) =>
  axiosInstance.post('/Customer', data)

export const updateCustomer = (id, data) =>
  axiosInstance.put(`/Customer/${id}`, data)

export const deleteCustomer = (id) =>
  axiosInstance.delete(`/Customer/${id}`)

// Sales Order APIs
export const getAllOrders = () =>
  axiosInstance.get('/SalesOrder')

export const getOrderById = (id) =>
  axiosInstance.get(`/SalesOrder/${id}`)

export const createOrder = (data) =>
  axiosInstance.post('/SalesOrder', data)

export const addPayment = (id, data) =>
  axiosInstance.post(`/SalesOrder/${id}/payment`, data)

export const getPendingOrders = () =>
  axiosInstance.get('/SalesOrder/pending')

export const deleteOrder = (id) =>
  axiosInstance.delete(`/SalesOrder/${id}`)