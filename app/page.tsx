'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'

interface AuthFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
  }
}

interface LoginFormData {
  email: string
  password: string
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isActive: boolean
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string>('')
  const [refreshToken, setRefreshToken] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'register' | 'login' | 'profile'>('register')

  const { register: registerForm, handleSubmit: handleRegisterSubmit, reset: resetRegister } = useForm<AuthFormData>()
  const { register: loginForm, handleSubmit: handleLoginSubmit, reset: resetLogin } = useForm<LoginFormData>()

  const onRegister = async (data: AuthFormData) => {
    try {
      const response = await axios.post('/api/auth/register', data)
      if (response.data.success) {
        toast.success('Registration successful! Please login.')
        resetRegister()
        setActiveTab('login')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed')
    }
  }

  const onLogin = async (data: LoginFormData) => {
    try {
      const response = await axios.post('/api/auth/login', data)
      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data
        setUser(user)
        setAccessToken(accessToken)
        setRefreshToken(refreshToken)
        setIsLoggedIn(true)
        setActiveTab('profile')
        toast.success('Login successful!')
        resetLogin()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed')
    }
  }

  const getProfile = async () => {
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (response.data.success) {
        setUser(response.data.data.user)
        toast.success('Profile updated!')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to get profile')
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', { refreshToken })
      setIsLoggedIn(false)
      setUser(null)
      setAccessToken('')
      setRefreshToken('')
      setActiveTab('login')
      toast.success('Logged out successfully!')
    } catch (error: any) {
      toast.error('Logout failed')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🔐 Auth Service Testing
        </h1>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('register')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'register' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Register
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'login' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Login
            </button>
            {isLoggedIn && (
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'profile' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Profile
              </button>
            )}
          </div>
        </div>

        {/* Register Form */}
        {activeTab === 'register' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Create Account</h2>
            <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name</label>
                  <input {...registerForm('firstName')} className="input-field" required />
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <input {...registerForm('lastName')} className="input-field" required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" {...registerForm('email')} className="input-field" required />
                </div>
                <div>
                  <label className="form-label">Password</label>
                  <input type="password" {...registerForm('password')} className="input-field" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Phone</label>
                  <input {...registerForm('phone')} className="input-field" placeholder="+1234567890" />
                </div>
                <div>
                  <label className="form-label">Date of Birth</label>
                  <input type="date" {...registerForm('dateOfBirth')} className="input-field" />
                </div>
                <div>
                  <label className="form-label">Gender</label>
                  <select {...registerForm('gender')} className="input-field">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Street</label>
                  <input {...registerForm('address.street')} className="input-field" />
                </div>
                <div>
                  <label className="form-label">City</label>
                  <input {...registerForm('address.city')} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">State</label>
                  <input {...registerForm('address.state')} className="input-field" />
                </div>
                <div>
                  <label className="form-label">Country</label>
                  <input {...registerForm('address.country')} className="input-field" />
                </div>
                <div>
                  <label className="form-label">ZIP Code</label>
                  <input {...registerForm('address.zipCode')} className="input-field" />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">
                Create Account
              </button>
            </form>
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Login</h2>
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
              <div>
                <label className="form-label">Email</label>
                <input type="email" {...loginForm('email')} className="input-field" required />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input type="password" {...loginForm('password')} className="input-field" required />
              </div>
              <button type="submit" className="btn-primary w-full">
                Login
              </button>
            </form>
          </div>
        )}

        {/* Profile Section */}
        {activeTab === 'profile' && isLoggedIn && user && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">User Profile</h2>
              <button onClick={logout} className="btn-secondary">
                Logout
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="ml-2">{user.firstName} {user.lastName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2">{user.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Role:</span>
                    <span className="ml-2 capitalize">{user.role}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Verification Status</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Email Verified:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      user.isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.isEmailVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone Verified:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      user.isPhoneVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.isPhoneVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Auth Tokens</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Access Token:</span>
                  <div className="mt-1 p-2 bg-gray-100 rounded text-xs font-mono break-all">
                    {accessToken.substring(0, 50)}...
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Refresh Token:</span>
                  <div className="mt-1 p-2 bg-gray-100 rounded text-xs font-mono break-all">
                    {refreshToken.substring(0, 50)}...
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button onClick={getProfile} className="btn-primary">
                Refresh Profile Data
              </button>
            </div>
          </div>
        )}

        {/* Status Bar */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
            <div className={`w-3 h-3 rounded-full ${isLoggedIn ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {isLoggedIn ? 'Authenticated' : 'Not Authenticated'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
