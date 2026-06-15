import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import logo from '../../assets/logo.png'
import {
  LayoutDashboard, ArrowLeftRight, PieChart, BarChart3,
  Wallet, LogOut, Upload, Menu, X, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import UploadModal from '../upload/UploadModal'
import { useTransactions } from '../../hooks/useTransactions'

const NAV = [
  { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/budgets',      label: 'Budgets',      icon: PieChart },
  { to: '/reports',      label: 'Reports',      icon: BarChart3 },
]

export default function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { add } = useTransactions()

  const handleSignOut = async () => {
    await signOut()
    navigate('/signin')
  }

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-56 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto lg:flex
      `}>
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-gray-200">
          <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
          <button className="ml-auto lg:hidden" onClick={() => setMobileOpen(false)}>
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Upload button */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={() => { setUploadOpen(true); setMobileOpen(false) }}
            className="w-full flex items-center justify-center gap-2 bg-accent-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-accent-700 transition-colors"
          >
            <Upload size={14} />
            Upload receipt
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-accent-50 text-accent-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 pb-4 border-t border-gray-200 pt-3">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-accent-100 text-accent-700 text-xs font-semibold flex items-center justify-center flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mt-1"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 lg:hidden">
          <button onClick={() => setMobileOpen(true)}>
            <Menu size={18} className="text-gray-600" />
          </button>
          <div className="flex-1 flex justify-center">
            <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
          </div>
          <button
            onClick={() => setUploadOpen(true)}
            className="bg-accent-600 text-white p-1.5 rounded-lg"
          >
            <Upload size={14} />
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-6 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {uploadOpen && (
        <UploadModal
          onClose={() => setUploadOpen(false)}
          onSave={async (tx) => { await add(tx); setUploadOpen(false) }}
        />
      )}
    </div>
  )
}
