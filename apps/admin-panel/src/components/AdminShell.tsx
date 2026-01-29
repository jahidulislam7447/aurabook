'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BarChart3, Building2, CreditCard, LayoutGrid, LogOut, Users } from 'lucide-react'
import { clearAdminToken } from '@/lib/auth'

const navItems = [
  { href: '/', label: 'Overview', icon: BarChart3 },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/organizations', label: 'Organizations', icon: Building2 },
  { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/apps', label: 'Apps', icon: LayoutGrid },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const logout = () => {
    clearAdminToken()
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r border-secondary-200">
        <div className="h-16 flex items-center px-6 border-b border-secondary-200">
          <Link href="/" className="font-semibold text-secondary-900">
            AuraTechIT Admin
          </Link>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? 'flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-50 text-primary-700'
                    : 'flex items-center gap-3 px-3 py-2 rounded-lg text-secondary-700 hover:bg-secondary-50'
                }
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      <main className="flex-1">
        <header className="h-16 bg-white border-b border-secondary-200 flex items-center justify-between px-6">
          <div className="text-sm text-secondary-600">Super Admin</div>
          <button onClick={logout} className="btn-secondary">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
