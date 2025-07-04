import apiClient from './api'
import { User } from '../features/users/data/schema'

// 定义获取用户列表的请求参数接口
export interface GetUsersParams {
  current?: number
  size?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filter?: string
}

// 定义获取用户列表的响应接口
export interface GetUsersResponse {
  records: User[]
  total: number
  current: number
  size: number
}

// 用户服务
export const UserService = {
  // 获取用户列表
  async getUsers(params: GetUsersParams): Promise<GetUsersResponse> {
    try {
      return await apiClient.get<GetUsersResponse>('/admin/user/list', { params })
    } catch (error) {
      // 记录错误但不暴露详细信息
      throw new Error('获取用户列表失败')
    }
  },
}

export default UserService
