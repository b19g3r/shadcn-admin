import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import { useAuthStore } from '../stores/authStore'

// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
const ACCESS_TOKEN = 'thisisjustarandomstring'

// 通用响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 创建axios实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加认证token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get(ACCESS_TOKEN)
    
    if (token) {
      try {
        const parsedToken = JSON.parse(token)
        config.headers.Authorization = `Bearer ${parsedToken}`
      } catch (_error) {
        // 解析token失败处理
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误和token刷新
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 处理标准API响应格式
    if (response.data && typeof response.data === 'object') {
      if ('data' in response.data) {
        // 标准格式：{ code, message, data }
        return response.data.data
      }
      // 直接返回数据对象
      return response.data
    }
    return response.data
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
    
    // 处理401未授权错误 - 可能是token过期
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // 尝试刷新token
        const refreshToken = Cookies.get('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          })
          
          const { accessToken } = response.data.data || response.data
          // 更新token
          const { auth } = useAuthStore.getState()
          auth.setAccessToken(accessToken)
          
          // 重试原始请求
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }
          return axiosInstance(originalRequest)
        }
      } catch (_refreshError) {
        // 刷新token失败，需要重新登录
        const { auth } = useAuthStore.getState()
        auth.reset()
        // 重定向到登录页
        window.location.href = '/sign-in'
      }
    }
    
    // 提取错误信息
    let errorMessage = 'Request failed'
    if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
      errorMessage = error.response.data.message as string
    }
    
    // 安全地提取错误信息
    const responseData = error.response?.data as Record<string, unknown> | undefined
    const errors = responseData && 'errors' in responseData 
      ? (responseData.errors as Array<{field: string, message: string}>) 
      : []
    
    return Promise.reject({ 
      status: error.response?.status,
      message: errorMessage,
      errors
    })
  }
)

// 定义API客户端接口，使其返回直接的数据而不是AxiosResponse
interface ApiClient {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T, D = Record<string, unknown>>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T>
  put<T, D = Record<string, unknown>>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T>
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>
}

// 创建API客户端
const apiClient: ApiClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.get<T, T>(url, config)
    return response
  },
  post: async <T, D = Record<string, unknown>>(url: string, data?: D, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.post<T, T>(url, data, config)
    return response
  },
  put: async <T, D = Record<string, unknown>>(url: string, data?: D, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.put<T, T>(url, data, config)
    return response
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.delete<T, T>(url, config)
    return response
  }
}

export default apiClient 