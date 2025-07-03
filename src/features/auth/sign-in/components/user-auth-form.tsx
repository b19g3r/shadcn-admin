import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { Captcha } from '@/components/captcha'
import { AuthService, LoginRequest } from '@/services/auth.service'
import { toast } from '@/hooks/use-toast'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  username: z
    .string()
    .min(1, { message: '请输入用户名' }),
  password: z
    .string()
    .min(1, {
      message: '请输入密码',
    })
    .min(7, {
      message: '密码长度至少为7位',
    }),
  captcha: z
    .string()
    .min(1, { message: '请输入验证码' }),
  captchaId: z
    .string()
    .min(1, { message: '验证码ID不能为空' })
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { redirect } = useSearch({ from: '/(auth)/sign-in' }) as { redirect?: string }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      captcha: '',
      captchaId: ''
    },
  })

  // 处理验证码变化
  const handleCaptchaChange = (value: string, captchaId: string) => {
    form.setValue('captcha', value)
    form.setValue('captchaId', captchaId)
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    
    try {
      // 准备登录请求数据
      const loginData: LoginRequest = {
        username: data.username,
        password: data.password,
        captcha: data.captcha,
        captchaId: data.captchaId
      }
      
      // 调用登录API
      await AuthService.login(loginData)
      
      // 登录成功
      toast({
        title: '登录成功',
        description: '欢迎回来！',
      })
      
      // 重定向到来源页面或首页
      navigate({ to: redirect || '/' })
    } catch (error) {
      // 登录失败
      const errorMessage = error instanceof Error ? error.message : '登录失败，请检查您的凭据'
      toast({
        title: '登录失败',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input placeholder='请输入用户名' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>密码</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      忘记密码?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='请输入密码' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='captcha'
              render={() => (
                <FormItem className='space-y-1'>
                  <FormLabel>验证码</FormLabel>
                  <FormControl>
                    <Captcha 
                      onCaptchaChange={handleCaptchaChange} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={isLoading}>
              登录
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  或继续使用
                </span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                disabled={isLoading}
              >
                <IconBrandGithub className='h-4 w-4' /> GitHub
              </Button>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                disabled={isLoading}
              >
                <IconBrandFacebook className='h-4 w-4' /> Facebook
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
