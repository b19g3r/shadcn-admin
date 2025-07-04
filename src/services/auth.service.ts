import { toast } from 'sonner'
import api from './api'
import { useAuthStore } from '@/stores/authStore'

interface LoginRequest {
  username: string
  password: string
  captcha?: string
  captchaId?: string
}

interface LoginResponse {
  code: number
  message: string
  data: {
    userId: number
    username: string
    accessToken: string
    refreshToken: string
    expiresIn: number
    roles: string[]
  }
}

interface CaptchaResponse {
  code: number
  message: string
  data: {
    uuid: string
    imageData: string
  }
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

export const AuthService = {
  /**
   * 登录
   * @param loginData 登录信息
   */
  async login(loginData: LoginRequest): Promise<LoginResponse | null> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', loginData)
      
      if (response.data.code === 200) {
        const { userId, username, accessToken, roles, expiresIn } = response.data.data
        
        // 存储认证信息
        useAuthStore.getState().auth.setAccessToken(accessToken)
        useAuthStore.getState().auth.setUser({
          accountNo: userId.toString(),
          email: username,
          role: roles,
          exp: Date.now() + (expiresIn * 1000) // 过期时间
        })
        
        toast.success('登录成功')
        return response.data
      } else {
        toast.error(response.data.message || '登录失败')
        return null
      }
    } catch (error: unknown) {
      const apiError = error as ApiError
      const errorMsg = apiError.response?.data?.message || apiError.message || '登录失败，请检查网络连接'
      toast.error(errorMsg)
      return null
    }
  },

  /**
   * 登出
   */
  async logout(): Promise<boolean> {
    try {
      const response = await api.post<ApiResponse<Record<string, never>>>('/auth/logout')
      
      if (response.data.code === 200) {
        // 清除认证信息
        useAuthStore.getState().auth.reset()
        toast.success('已退出登录')
        return true
      } else {
        toast.error(response.data.message || '退出失败')
        return false
      }
    } catch (error: unknown) {
      const apiError = error as ApiError
      const errorMsg = apiError.response?.data?.message || apiError.message || '退出失败，请检查网络连接'
      toast.error(errorMsg)
      
      // 即使API调用失败，也需要清除本地认证信息
      useAuthStore.getState().auth.reset()
      return false
    }
  },

  /**
   * 获取验证码
   */
  async getCaptcha(): Promise<CaptchaResponse | null> {
    try {
      const response = await api.get<CaptchaResponse>('/auth/captcha')
      
      if (response.data.code === 200) {
        return response.data
      } else {
        toast.error(response.data.message || '获取验证码失败')
        return null
      }
    } catch (error: unknown) {
      const apiError = error as ApiError
      const errorMsg = apiError.response?.data?.message || apiError.message || '获取验证码失败，请检查网络连接'
      toast.error(errorMsg)
      return null
    }
  },

  /**
   * 刷新令牌
   * @param refreshToken 刷新令牌
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse | null> {
    try {
      const response = await api.post<LoginResponse>('/auth/refresh', { refreshToken })
      
      if (response.data.code === 200) {
        const { accessToken } = response.data.data
        
        // 更新访问令牌
        useAuthStore.getState().auth.setAccessToken(accessToken)
        
        return response.data
      } else {
        toast.error(response.data.message || '刷新令牌失败')
        return null
      }
    } catch (error: unknown) {
      const apiError = error as ApiError
      const errorMsg = apiError.response?.data?.message || apiError.message || '刷新令牌失败，请检查网络连接'
      toast.error(errorMsg)
      return null
    }
  }
}

export default AuthService 