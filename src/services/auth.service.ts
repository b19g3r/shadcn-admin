import apiClient from './api'
import Cookies from 'js-cookie'
import { useAuthStore } from '../stores/authStore'

// API响应中的用户信息
export interface AuthUserResponse {
  userId: number
  username: string
  nickname: string
  avatar: string
  accessToken: string
  refreshToken: string
  expiresIn: number
  roles: string[]
}

// 登录请求接口
export interface LoginRequest {
  username: string
  password: string
  captcha?: string
  captchaId?: string
  [key: string]: string | undefined // 添加索引签名
}

// 注册请求接口
export interface RegisterRequest {
  username: string
  password: string
  confirmPassword: string
  nickname: string
  phone: string
  email: string
  captcha: string
  captchaId: string
  [key: string]: string // 添加索引签名
}

// 刷新token请求接口
export interface RefreshTokenRequest {
  refreshToken: string
}

// 验证码响应接口
export interface CaptchaResponse {
  uuid: string
  imageData: string
}

// 认证服务
export const AuthService = {
  // 获取验证码
  async getCaptcha(): Promise<CaptchaResponse> {
    try {
      return await apiClient.get<CaptchaResponse>('/auth/captcha')
    } catch (_error) {
      // 记录错误但不暴露详细信息
      throw new Error('获取验证码失败，请重试')
    }
  },

// 登录
  async login(credentials: LoginRequest): Promise<AuthUserResponse> {
    try {
      // 调用登录API
      const response = await apiClient.post<AuthUserResponse>('/auth/login', credentials)

      // 存储token
      const { auth } = useAuthStore.getState()
      auth.setAccessToken(response.accessToken)
      Cookies.set('refreshToken', response.refreshToken, { secure: true, sameSite: 'strict' })

      // 存储用户信息
      auth.setUser({
        accountNo: String(response.userId),
        username: response.username,
        nickname: response.nickname,
        avatar: response.avatar,
        roles: response.roles,
        expiresIn: response.expiresIn
      })

      return response
    } catch (error) {
      // 记录错误但不暴露详细信息
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        throw new Error(error.message);
      }
      throw new Error('登录失败，请检查用户名和密码');
    }
  },
  
  // 注册
  async register(registerData: RegisterRequest): Promise<void> {
    try {
      await apiClient.post<Record<string, never>>('/auth/register', registerData)
    } catch (_error) {
      // 记录错误但不暴露详细信息
      throw new Error('注册失败，请检查输入信息')
    }
  },
  
  // 刷新token
  async refreshToken(refreshToken: string): Promise<AuthUserResponse> {
    try {
      return await apiClient.post<AuthUserResponse>('/auth/refresh', { refreshToken })
    } catch (_error) {
      // 记录错误但不暴露详细信息
      throw new Error('会话已过期，请重新登录')
    }
  },
  
  // 注销
  async logout(): Promise<void> {
    try {
      await apiClient.post<Record<string, never>>('/auth/logout')
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