import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

declare global {
  interface ImportMeta {
    env: Record<string, string>
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000'

// 创建axios实例
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().auth.accessToken
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    // 如果状态码为401，可能是token过期
    if (error.response && error.response.status === 401) {
      // 清除认证信息
      useAuthStore.getState().auth.reset()
      // 重定向到登录页
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  }
)

export default api
