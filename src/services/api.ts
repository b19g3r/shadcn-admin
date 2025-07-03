import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import { useAuthStore } from '../stores/authStore'

// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000'
const ACCESS_TOKEN = 'thisisjustarandomstring'

// 通用响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  errors?: Array<{field: string, message: string}>
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
      // API文档中的标准格式：{ code, message, data }
      if ('code' in response.data && 'data' in response.data) {
        // 检查状态码
        if (response.data.code === 200) {
          return response.data.data
        } else {
          // 非成功状态码，抛出错误
          return Promise.reject({
            status: response.data.code,
            message: response.data.message || '请求失败',
            errors: response.data.errors || []
          })
        }
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
          
          if (response.data && response.data.code === 200) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data || {}
            
            // 更新token
            const { auth } = useAuthStore.getState()
            auth.setAccessToken(accessToken)
            
            // 更新refreshToken
            if (newRefreshToken) {
              Cookies.set('refreshToken', newRefreshToken, { secure: true, sameSite: 'strict' })
            }
            
            // 重试原始请求
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`
            }
            return axiosInstance(originalRequest)
          }
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
    let errorCode = error.response?.status || 500
    let errorDetails: Array<{field: string, message: string}> = []
    
    // 尝试从API响应中获取错误信息
    if (error.response?.data && typeof error.response.data === 'object') {
      const responseData = error.response.data as Record<string, unknown>
      
      if ('message' in responseData) {
        errorMessage = responseData.message as string
      }
      
      if ('code' in responseData) {
        errorCode = responseData.code as number
      }
      
      if ('errors' in responseData && Array.isArray(responseData.errors)) {
        errorDetails = responseData.errors as Array<{field: string, message: string}>
      }
    }
    
    return Promise.reject({ 
      status: errorCode,
      message: errorMessage,
      errors: errorDetails
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