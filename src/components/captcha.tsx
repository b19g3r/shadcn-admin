import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { IconRefresh } from '@tabler/icons-react'
import { AuthService } from '@/services/auth.service'

interface CaptchaProps {
  /**
   * 验证码值变更回调
   */
  onCaptchaChange?: (value: string, captchaId: string) => void
  /**
   * 自定义类名
   */
  className?: string
  /**
   * 输入框类名
   */
  inputClassName?: string
  /**
   * 图片类名
   */
  imageClassName?: string
  /**
   * 按钮类名
   */
  buttonClassName?: string
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 输入框placeholder
   */
  placeholder?: string
}

export function Captcha({
  onCaptchaChange,
  className,
  inputClassName,
  imageClassName,
  buttonClassName,
  disabled = false,
  placeholder = '请输入验证码',
}: CaptchaProps) {
  const [captchaValue, setCaptchaValue] = useState('')
  const [captchaId, setCaptchaId] = useState('')
  const [captchaImage, setCaptchaImage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 获取验证码
  const fetchCaptcha = async () => {
    setIsLoading(true)
    try {
      const response = await AuthService.getCaptcha()
      setCaptchaId(response.uuid)
      setCaptchaImage(response.imageData)
    } catch (_error) {
      // 获取验证码失败
    } finally {
      setIsLoading(false)
    }
  }

  // 刷新验证码
  const refreshCaptcha = () => {
    setCaptchaValue('')
    fetchCaptcha()
  }

  // 处理验证码输入变化
  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCaptchaValue(value)
    if (onCaptchaChange) {
      onCaptchaChange(value, captchaId)
    }
  }

  // 组件挂载时获取验证码
  useEffect(() => {
    fetchCaptcha()
  }, [])

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Input
        value={captchaValue}
        onChange={handleCaptchaChange}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        className={cn('flex-1', inputClassName)}
      />
      <div className="flex items-center">
        {captchaImage ? (
          <div
            className={cn('h-10 min-w-24 overflow-hidden rounded border', imageClassName)}
          >
            <img
              src={`data:image/png;base64,${captchaImage}`}
              alt="验证码"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className={cn(
              'h-10 min-w-24 animate-pulse rounded border bg-muted',
              imageClassName
            )}
          />
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={refreshCaptcha}
          disabled={disabled || isLoading}
          className={cn('ml-1', buttonClassName)}
        >
          <IconRefresh className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default Captcha 