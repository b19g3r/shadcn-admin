import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import AuthService from '@/services/auth.service'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface CaptchaInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCaptchaIdChange?: (captchaId: string) => void
  captchaWidth?: number
  captchaHeight?: number
  className?: string
}

export function CaptchaInput({
  className,
  onCaptchaIdChange,
  captchaWidth = 120,
  captchaHeight = 40,
  ...props
}: CaptchaInputProps) {
  const [captchaImage, setCaptchaImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchCaptcha = async () => {
    setIsLoading(true)
    try {
      const captchaResponse = await AuthService.getCaptcha()
      if (captchaResponse) {
        setCaptchaImage(captchaResponse.data.imageData)
        
        if (onCaptchaIdChange && captchaResponse.data.uuid) {
          onCaptchaIdChange(captchaResponse.data.uuid)
        }
      }
    } catch (_error) {
      // 处理错误
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCaptcha()
  }, [])

  return (
    <div className="flex w-full gap-2">
      <Input
        className={cn(className)}
        placeholder="验证码"
        maxLength={6}
        {...props}
      />
      <div
        className="flex-shrink-0 cursor-pointer border rounded-md overflow-hidden flex items-center justify-center bg-muted"
        style={{ width: captchaWidth, height: captchaHeight }}
        onClick={fetchCaptcha}
        title="点击刷新验证码"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : captchaImage ? (
          <img
            src={captchaImage}
            alt="验证码"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm text-muted-foreground">加载中...</span>
        )}
      </div>
    </div>
  )
} 