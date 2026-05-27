import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axiosInstance from '../../api/axiosInstance'
import { setAuth } from './authSlice'

const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError('')

      const response = await axiosInstance.post('/Auth/login', {
        email,
        password,
      })

      const { token, fullName, role, expiresAt } = response.data

      dispatch(setAuth({
        token,
        user: { fullName, role, expiresAt }
      }))

      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}

export default useAuth