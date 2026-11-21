import { Suspense, lazy } from 'react'
import { Navigate } from 'react-router'

import { useSession } from '@/auth/session'
import { useIsLaptop } from '@/lib/useIsLaptop'

const LandingPage = lazy(async () => ({ default: (await import('@/landing/LandingPage')).LandingPage }))

/**
 * Halaman `/`. Pengunjung yang belum login melihat landing page Kashiru. Akun yang login langsung dibuka ke
 * Kasir di laptop atau Dashboard di HP (R51); akun nonaktif atau belum terdaftar diurus RequireLogin di sana.
 */
export function Home() {
  const { status } = useSession()
  const isLaptop = useIsLaptop()

  if (status.stage === 'loading') return null
  if (status.stage === 'signedOut') {
    return (
      <Suspense fallback={null}>
        <LandingPage />
      </Suspense>
    )
  }
  return <Navigate to={isLaptop ? '/pos' : '/dashboard'} replace />
}
