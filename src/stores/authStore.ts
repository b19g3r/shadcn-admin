import Cookies from 'js-cookie'
import { create } from 'zustand'
import { AuthService } from '../services/auth.service' // 引入AuthService

const ACCESS_TOKEN = 'thisisjustarandomstring'

interface AuthUser {
  accountNo: string
  username: string
  nickname: string
  avatar: string
  roles: string[]
  expiresIn: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
    initializeAuth: () => Promise<void>
    isInitializing: boolean // 跟踪初始化状态
  }
}

export const useAuthStore = create<AuthState>()((set, get) => {
  // 安全地解析Cookie值
  const parseTokenFromCookie = () => {
    try {
      const cookieState = Cookies.get(ACCESS_TOKEN)
      if (cookieState && cookieState !== 'undefined') {
        return JSON.parse(cookieState)
      }
      return ''
    } catch (_error) {
      return ''
    }
  }

  const initToken = parseTokenFromCookie()

  return {
    auth: {
      user: null,
      isInitializing: true, // 初始状态为正在初始化
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          Cookies.set(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '', isInitializing: false },
          }
        }),
      // 初始化认证状态
      initializeAuth: async () => {
        const { auth } = get() // 使用 get() 获取最新状态
        if (auth.accessToken) {
          try {
            await AuthService.getAccountInfo()
          } catch (error) {
            console.error(error) // getAccountInfo 内部会处理重置
          }
        }
        // 初始化完成
        set((state) => ({ ...state, auth: { ...state.auth, isInitializing: false } }))
      },
    },
  }
})

