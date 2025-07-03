import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'

export default function SignUp() {
  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='flex flex-col space-y-2 text-left'>
          <h1 className='text-2xl font-semibold tracking-tight'>用户注册</h1>
          <p className='text-sm text-muted-foreground'>
            请填写下面的信息创建您的账号
          </p>
        </div>
        <SignUpForm />
        <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
          已有账号?{' '}
          <a
            href='/sign-in'
            className='font-medium text-primary underline underline-offset-4 hover:opacity-75'
          >
            登录
          </a>
        </p>
      </Card>
    </AuthLayout>
  )
}
