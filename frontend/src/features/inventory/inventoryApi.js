import axiosInstance from '../../api/axiosInstance'

// Supplier APIs
export const getAllSuppliers = () => 
  axiosInstance.get('/Supplier')

export const createSupplier = (data) => 
  axiosInstance.post('/Supplier', data)

export const updateSupplier = (id, data) => 
  axiosInstance.put(`/Supplier/${id}`, data)

export const deleteSupplier = (id) => 
  axiosInstance.delete(`/Supplier/${id}`)

// Purchase APIs
export const getAllPurchases = () => 
  axiosInstance.get('/RicePurchase')

export const createPurchase = (data) => 
  axiosInstance.post('/RicePurchase', data)

// Stock APIs
export const getAllStocks = () => 
  axiosInstance.get('/RiceStock')

export const getLowStocks = () => 
  axiosInstance.get('/RiceStock/lowstock')