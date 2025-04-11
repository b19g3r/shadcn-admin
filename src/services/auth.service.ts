import apiClient from './api'
import Cookies from 'js-cookie'
import { useAuthStore } from '../stores/authStore'

// 认证响应接口
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    username: string
    email: string
    role: string[]
    exp: number
  }
}

// 登录请求接口
export interface LoginRequest {
  username: string
  password: string
  [key: string]: string; // 添加索引签名
}

// 刷新token请求接口
export interface RefreshTokenRequest {
  refreshToken: string
  [key: string]: string; // 添加索引签名
}

// 认证服务
export const AuthService = {
  // 登录
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // 对于POST请求，apiClient拦截器会自动提取响应中的data字段
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
      
      // 存储token
      const { auth } = useAuthStore.getState()
      auth.setAccessToken(response.accessToken)
      Cookies.set('refreshToken', response.refreshToken, { secure: true, sameSite: 'strict' })
      
      // 存储用户信息
      auth.setUser({
        accountNo: response.user.id,
        email: response.user.email,
        role: response.user.role,
        exp: response.user.exp
      })
      
      return response
    } catch (_error) {
      console.log(_error)
      // 记录错误信息但不暴露详细错误
      throw new Error('Login failed, please check your username and password')
    }
  },
  
  // 刷新token
  async refreshToken(request: RefreshTokenRequest): Promise<{ accessToken: string, refreshToken: string }> {
    try {
      return await apiClient.post<{ accessToken: string, refreshToken: string }>('/auth/refresh', request)
    } catch (_error) {
      throw new Error('Failed to refresh token')
    }
  },
  
  // 注销
  async logout(): Promise<void> {
    try {
      await apiClient.post<{ message: string }>('/auth/logout')
    } finally {
      // 无论API调用是否成功，都清除本地存储的认证信息
      const { auth } = useAuthStore.getState()
      auth.reset()
      Cookies.remove('refreshToken')
    }
  },
  
  // 检查是否已认证
  isAuthenticated(): boolean {
    const { auth } = useAuthStore.getState()
    return !!auth.accessToken && !!auth.user
  },
  
  // 获取当前用户
  getCurrentUser() {
    const { auth } = useAuthStore.getState()
    return auth.user
  }
}

export default AuthService 