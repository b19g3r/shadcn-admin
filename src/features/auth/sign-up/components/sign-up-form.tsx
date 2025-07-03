import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { AuthService, RegisterRequest } from '@/services/auth.service'
import { toast } from '@/hooks/use-toast'

type SignUpFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: '请输入用户名' })
      .min(3, { message: '用户名长度至少为3位' }),
    nickname: z
      .string()
      .min(1, { message: '请输入昵称' }),
    email: z
      .string()
      .min(1, { message: '请输入邮箱' })
      .email({ message: '邮箱格式不正确' }),
    phone: z
      .string()
      .min(1, { message: '请输入手机号' })
      .regex(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' }),
    password: z
      .string()
      .min(1, { message: '请输入密码' })
      .min(7, { message: '密码长度至少为7位' }),
    confirmPassword: z.string(),
    captcha: z
      .string()
      .min(1, { message: '请输入验证码' }),
    captchaId: z
      .string()
      .min(1, { message: '验证码ID不能为空' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ['confirmPassword'],
  })

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      nickname: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
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
      // 准备注册请求数据
      const registerData: RegisterRequest = {
        username: data.username,
        password: data.password,
        confirmPassword: data.confirmPassword,
        nickname: data.nickname,
        phone: data.phone,
        email: data.email,
        captcha: data.captcha,
        captchaId: data.captchaId
      }
      
      // 调用注册API
      await AuthService.register(registerData)
      
      // 注册成功
      toast({
        title: '注册成功',
        description: '请登录您的账号',
      })
      
      // 重定向到登录页
      window.location.href = '/sign-in'
    } catch (error) {
      // 注册失败
      const errorMessage = error instanceof Error ? error.message : '注册失败，请检查您的输入'
      toast({
        title: '注册失败',
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
              name='nickname'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>昵称</FormLabel>
                  <FormControl>
                    <Input placeholder='请输入昵称' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <Input placeholder='请输入邮箱' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>手机号</FormLabel>
                    <FormControl>
                      <Input placeholder='请输入手机号' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='请输入密码' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>确认密码</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='请再次输入密码' {...field} />
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
              创建账号
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
