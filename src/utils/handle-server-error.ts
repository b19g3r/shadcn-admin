import { toast } from 'sonner'

interface ApiErrorResponse {
  code?: number
  message?: string
  title?: string
}

interface ErrorWithStatus {
  status?: number | string
}

// 定义Axios错误的接口
interface AxiosErrorInterface {
  message: string
  response?: {
    status: number
    data: unknown
  }
  isAxiosError: boolean
}

// 类型守卫函数
function isAxiosError(error: unknown): error is AxiosErrorInterface {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as Record<string, unknown>).isAxiosError === true
  )
}

export function handleServerError(error: unknown) {
  // 开发环境下输出完整错误信息
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error(error)
  }

  let errMsg = 'Something went wrong!'

  // 处理包含status属性的错误
  if (
    error &&
    typeof error === 'object' &&
    (error as ErrorWithStatus).status !== undefined &&
    Number((error as ErrorWithStatus).status) === 204
  ) {
    errMsg = 'Content not found.'
  }

  // 处理Axios错误
  if (isAxiosError(error)) {
    // 现在可以安全访问AxiosError的属性
    const data = error.response?.data as ApiErrorResponse | undefined;
    
    if (data) {
      errMsg = data.message || data.title || error.message || 'Server error';
    } else {
      errMsg = error.message || 'Server error';
    }

    if (error.response?.status === 401) {
      errMsg = 'Your session has expired. Please login again.';
    }
  }

  toast.error(errMsg)
  
  return errMsg
}
