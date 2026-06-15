import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ArrowRight } from 'lucide-react'
import logo from '../../assets/logo.png'

export default function PublicLayout() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-accent-100 selection:text-accent-950">
      {/* Header */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 fixed top-0 w-full z-50">
        <div className="max-w-6xl mx-auto h-full px-4 lg:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-9 w-auto object-contain" />
          </Link>

          {/* Navigation CTA */}
          <div className="flex items-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm shadow-accent-600/10 hover:shadow-accent-600/20 active:scale-95"
              >
                Go to Dashboard
                <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1 bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm shadow-accent-600/10 hover:shadow-accent-600/20 active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200 py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Spentwise. All rights reserved.
          </div>

          {/* Links */}
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500 font-medium">
            <Link to="/about" className="hover:text-gray-900 transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
            <Link to="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
