import axiosInstance from '../../api/axiosInstance'

// Production APIs
export const getAllBatches = () =>
  axiosInstance.get('/Production')

export const createBatch = (data) =>
  axiosInstance.post('/Production', data)

export const deleteBatch = (id) =>
  axiosInstance.delete(`/Production/${id}`)

export const getSpecialOrders = () =>
  axiosInstance.get('/Production/special-orders')

// Preparation APIs
export const getAllPreparations = () =>
  axiosInstance.get('/Preparation')

export const createPreparation = (data) =>
  axiosInstance.post('/Preparation', data)

export const deletePreparation = (id) =>
  axiosInstance.delete(`/Preparation/${id}`)

export const getDoughStock = () =>
  axiosInstance.get('/Preparation/doughstock')