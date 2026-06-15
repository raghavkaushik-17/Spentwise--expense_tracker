import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowRight, Receipt, PieChart, Shield } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="py-16 px-4 lg:px-6 flex flex-col items-center justify-center text-center">
      <div className="max-w-3xl mx-auto space-y-6 pt-12">
        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-1.5 bg-accent-50 text-accent-700 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide border border-accent-100 uppercase animate-fade-in">
          <span>✨ Smart Personal Finance</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-none">
          Track expenses wisely, <br />
          <span className="bg-gradient-to-r from-accent-600 to-indigo-600 bg-clip-text text-transparent">
            powered by intelligence.
          </span>
        </h1>

        <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
          Upload receipts, auto-categorize spending, set smart budgets, and get actionable AI-powered insights on your mobile or desktop.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent-600 hover:bg-accent-700 text-white text-base font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-accent-600/15 hover:shadow-accent-600/30 active:scale-[0.98]"
            >
              Go to App
              <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent-600 hover:bg-accent-700 text-white text-base font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-accent-600/15 hover:shadow-accent-600/30 active:scale-[0.98]"
              >
                Start tracking for free
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/signin"
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-base font-semibold px-6 py-3 rounded-xl transition-all active:scale-[0.98]"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-5xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-left hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center text-accent-600 mb-4 border border-accent-100">
            <Receipt size={20} />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Smart Receipt Scanning</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Upload photos of your bills. Our client-side OCR and AI extract merchants, amounts, categories, and payment methods instantly.
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-left hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 border border-indigo-100">
            <PieChart size={20} />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Flexible Budgeting</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Set monthly spending limits for different categories. Get alerted immediately as you approach or exceed your limits.
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-left hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100">
            <Shield size={20} />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Private & Secure</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your data is fully secured using Supabase Row Level Security. Only you can view or modify your transactions.
          </p>
        </div>
      </div>
    </div>
  )
}
