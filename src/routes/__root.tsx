import { useEffect } from 'react'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from '@/components/ui/toaster'
import GeneralError from '@/features/errors/general-error'
import NotFoundError from '@/features/errors/not-found-error'
import { useAuthStore } from '@/stores/authStore'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: function RootComponent() {
    const { isInitializing, initializeAuth } = useAuthStore((state) => state.auth)

    useEffect(() => {
      initializeAuth()
    }, [initializeAuth])

    if (isInitializing) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <p>Loading...</p>
        </div>
      )
    }

    return (
      <>
        <Outlet />
        <Toaster />
        {import.meta.env.MODE === 'development' && (
          <>
            <ReactQueryDevtools buttonPosition="bottom-left" />
            <TanStackRouterDevtools position="bottom-right" />
          </>
        )}
      </>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
