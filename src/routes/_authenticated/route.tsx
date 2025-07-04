import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    // 检查用户是否已认证
    const auth = useAuthStore.getState().auth
    const isAuthenticated = !!auth.accessToken && !!auth.user

    if (!isAuthenticated) {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: () => {
    return <AuthenticatedLayout />
  },
})
