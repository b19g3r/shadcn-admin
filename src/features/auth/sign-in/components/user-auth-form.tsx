import { HTMLAttributes, useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
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
import AuthService from '@/services/auth.service'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Please enter your username' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
  captcha: z.string().optional(),
  captchaId: z.string().optional(),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [captchaImage, setCaptchaImage] = useState<string | null>(null)
  const [captchaId, setCaptchaId] = useState<string | null>(null)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      captcha: '',
    },
  })

  const fetchCaptcha = async () => {
    const captchaResponse = await AuthService.getCaptcha()
    if (captchaResponse) {
      setCaptchaImage(captchaResponse.data.imageData)
      setCaptchaId(captchaResponse.data.uuid)
      form.setValue('captchaId', captchaResponse.data.uuid)
    }
  }

  useEffect(() => {
    fetchCaptcha()
  }, [])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    
    try {
      const loginResponse = await AuthService.login({
        username: data.username,
        password: data.password,
        captcha: data.captcha,
        captchaId: data.captchaId
      })
      
      if (loginResponse) {
        // 登录成功，跳转到首页或其他页面
        navigate({ to: '/' })
      } else {
        // 登录失败，刷新验证码
        fetchCaptcha()
      }
    } catch (error) {
      console.error('Login error:', error)
      fetchCaptcha()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='john.doe' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />

        {captchaImage && (
          <FormField
            control={form.control}
            name='captcha'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <div className='flex gap-2'>
                  <FormControl>
                    <Input placeholder='Enter code' {...field} />
                  </FormControl>
                  <div 
                    className='flex-shrink-0 h-10 cursor-pointer border rounded-md overflow-hidden'
                    onClick={fetchCaptcha}
                  >
                    <img 
                      src={captchaImage} 
                      alt="Captcha" 
                      className='h-full'
                    />
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button className='mt-2' disabled={isLoading}>
          Login
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              Or continue with
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button variant='outline' type='button' disabled={isLoading}>
            <IconBrandGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button variant='outline' type='button' disabled={isLoading}>
            <IconBrandFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}
