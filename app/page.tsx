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
  const [isLoading, setIsLoading] = useState(false)

  const { register: registerForm, handleSubmit: handleRegisterSubmit, reset: resetRegister } = useForm<AuthFormData>()
  const { register: loginForm, handleSubmit: handleLoginSubmit, reset: resetLogin } = useForm<LoginFormData>()

  const onRegister = async (data: AuthFormData) => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/auth/register', data)
      if (response.data.success) {
        toast.success('Registration successful! Please login.')
        resetRegister()
        setActiveTab('login')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
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
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Auth Service Testing
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Test your authentication microservice with our beautiful, interactive interface
          </p>
        </div>
        
        {/* Enhanced Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-2 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-xl border border-gray-200/50">
            <button
              onClick={() => setActiveTab('register')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'register' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>📝</span>
                <span>Register</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'login' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>🔑</span>
                <span>Login</span>
              </span>
            </button>
            {isLoggedIn && (
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'profile' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>👤</span>
                  <span>Profile</span>
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Register Form */}
        {activeTab === 'register' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-8 transform transition-all duration-500 hover:scale-[1.02]">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl mb-4 shadow-lg">
                <span className="text-2xl">📝</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">Join our platform and start your journey</p>
            </div>
            <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors">
                    <span className="flex items-center space-x-2">
                      <span>👤</span>
                      <span>First Name</span>
                    </span>
                  </label>
                  <input 
                    {...registerForm('firstName')} 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80" 
                    placeholder="Enter your first name"
                    required 
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors">
                    <span className="flex items-center space-x-2">
                      <span>👤</span>
                      <span>Last Name</span>
                    </span>
                  </label>
                  <input 
                    {...registerForm('lastName')} 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80" 
                    placeholder="Enter your last name"
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors">
                    <span className="flex items-center space-x-2">
                      <span>📧</span>
                      <span>Email</span>
                    </span>
                  </label>
                  <input 
                    type="email" 
                    {...registerForm('email')} 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80" 
                    placeholder="your.email@example.com"
                    required 
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors">
                    <span className="flex items-center space-x-2">
                      <span>🔒</span>
                      <span>Password</span>
                    </span>
                  </label>
                  <input 
                    type="password" 
                    {...registerForm('password')} 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80" 
                    placeholder="Create a strong password"
                    required 
                  />
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

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <span>🚀</span>
                    <span>Create Account</span>
                  </span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Enhanced Login Form */}
        {activeTab === 'login' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-8 transform transition-all duration-500 hover:scale-[1.02]">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl mb-4 shadow-lg">
                <span className="text-2xl">🔑</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-orange-600 transition-colors">
                  <span className="flex items-center space-x-2">
                    <span>📧</span>
                    <span>Email</span>
                  </span>
                </label>
                <input 
                  type="email" 
                  {...loginForm('email')} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80" 
                  placeholder="your.email@example.com"
                  required 
                />
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-orange-600 transition-colors">
                  <span className="flex items-center space-x-2">
                    <span>🔒</span>
                    <span>Password</span>
                  </span>
                </label>
                <input 
                  type="password" 
                  {...loginForm('password')} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80" 
                  placeholder="Enter your password"
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <span>🚀</span>
                    <span>Sign In</span>
                  </span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Enhanced Profile Section */}
        {activeTab === 'profile' && isLoggedIn && user && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-8 transform transition-all duration-500 hover:scale-[1.02]">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mb-4 shadow-lg">
                <span className="text-3xl">👤</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                User Profile
              </h2>
              <p className="text-gray-600">Welcome back, {user.firstName}! Here's your account information</p>
            </div>
            
            <div className="flex justify-end mb-6">
              <button 
                onClick={logout} 
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center space-x-2">
                  <span>🚪</span>
                  <span>Logout</span>
                </span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                <h3 className="text-xl font-bold text-blue-800 mb-6 flex items-center space-x-2">
                  <span>👤</span>
                  <span>Personal Information</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-blue-200/30">
                    <span className="font-semibold text-blue-700">Name:</span>
                    <span className="text-blue-900 font-medium">{user.firstName} {user.lastName}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-blue-200/30">
                    <span className="font-semibold text-blue-700">Email:</span>
                    <span className="text-blue-900 font-medium">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-blue-200/30">
                    <span className="font-semibold text-blue-700">Role:</span>
                    <span className="text-blue-900 font-medium capitalize">{user.role}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-blue-200/30">
                    <span className="font-semibold text-blue-700">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {user.isActive ? '✅ Active' : '❌ Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center space-x-2">
                  <span>🔐</span>
                  <span>Verification Status</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-green-200/30">
                    <span className="font-semibold text-green-700">Email Verified:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.isEmailVerified 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {user.isEmailVerified ? '✅ Verified' : '⏳ Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-green-200/30">
                    <span className="font-semibold text-green-700">Phone Verified:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.isPhoneVerified 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {user.isPhoneVerified ? '✅ Verified' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <span>🔑</span>
                <span>Authentication Tokens</span>
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-purple-700 flex items-center space-x-2">
                      <span>🎫</span>
                      <span>Access Token</span>
                    </span>
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">JWT</span>
                  </div>
                  <div className="p-3 bg-white/60 rounded-xl border border-purple-200/30 font-mono text-sm text-purple-900 break-all">
                    {accessToken.substring(0, 50)}...
                  </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-indigo-700 flex items-center space-x-2">
                      <span>🔄</span>
                      <span>Refresh Token</span>
                    </span>
                    <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">UUID</span>
                  </div>
                  <div className="p-3 bg-white/60 rounded-xl border border-indigo-200/30 font-mono text-sm text-indigo-900 break-all">
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

        {/* Enhanced Status Bar */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-xl border border-gray-200/50">
            <div className={`w-4 h-4 rounded-full ${isLoggedIn ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`}></div>
            <span className={`text-sm font-medium ${isLoggedIn ? 'text-green-700' : 'text-gray-600'}`}>
              {isLoggedIn ? '✅ Authenticated' : '⏳ Not Authenticated'}
            </span>
            {isLoggedIn && (
              <div className="flex items-center space-x-2 text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full">
                <span>🔒</span>
                <span>Secure Session</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>🔐 Ecommerce Authentication Testing Platform</p>
          <p className="mt-1">Built with Next.js, TypeScript & Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}
