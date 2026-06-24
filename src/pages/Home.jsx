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
          <span>✨ No more end-of-month panic</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-none">
          Your salary deserves better than <br />
          <span className="bg-gradient-to-r from-accent-600 to-indigo-600 bg-clip-text text-transparent">
            vibes-based budgeting.
          </span>
        </h1>

        <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
          Stop guessing where your money went. See exactly how much you spent on coffee this week, and maybe feel a little bad about it.
        </p>

        <p className="text-sm font-medium text-amber-800 bg-amber-50 px-4 py-2 rounded-lg inline-block mx-auto border border-amber-200">
          We don't sync with banks yet — but manual entry takes under 10 seconds.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent-600 hover:bg-accent-700 text-white text-base font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-accent-600/15 hover:shadow-accent-600/30 active:scale-[0.98]"
            >
              Go face your spending
              <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent-600 hover:bg-accent-700 text-white text-base font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-accent-600/15 hover:shadow-accent-600/30 active:scale-[0.98]"
              >
                Try it free — no card needed
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/signin"
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-base font-semibold px-6 py-3 rounded-xl transition-all active:scale-[0.98]"
              >
                Log back in
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
          <h3 className="text-base font-semibold text-gray-900 mb-2">Add an expense in 4 taps</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Snap a photo of your receipt or type it in. We handle the category — you handle the regret.
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-left hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 border border-indigo-100">
            <PieChart size={20} />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Budgets that actually work</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Set limits you'll probably ignore. We'll send you a gentle alert when you're about to overspend on takeout again.
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-left hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100">
            <Shield size={20} />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">We don't want your data</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your data is fully secured and private. We couldn't look at your embarrassing spending habits even if we wanted to.
          </p>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-4xl mx-auto mt-24 text-left w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">People who stopped guessing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative">
            <p className="text-gray-600 italic mb-4">"Reduced my eating-out spend by ₹3,200 last month without even trying. Seeing the number go up every day is a great deterrent."</p>
            <p className="font-semibold text-sm text-gray-900">— Priya, Pune</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative">
            <p className="text-gray-600 italic mb-4">"Finally figured out I spend roughly 20% of my income on iced coffee. Devastating, but at least I know now."</p>
            <p className="font-semibold text-sm text-gray-900">— Rohan, Bangalore</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto mt-24 text-left w-full px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Things you might be wondering</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900">Is this actually free or is there a catch?</h3>
            <p className="text-gray-600 text-sm mt-1">It's actually free. No hidden fees, no selling your data to advertisers. We're just trying to help you keep your money.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Do I have to link my bank account?</h3>
            <p className="text-gray-600 text-sm mt-1">Nope. In fact, you can't. We believe manually entering your expenses creates just enough friction to make you think twice about buying things you don't need.</p>
          </div>
        </div>
      </div>

      {/* Meet the Developer */}
      <div className="max-w-3xl mx-auto mt-24 text-left w-full px-6 py-8 bg-gray-50 rounded-2xl border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Hey, I'm Raghav. 👋</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          I built Spentwise because I was tired of opening 3 different apps just to figure out where my salary disappeared every month. I'm a developer who cares about making things that are actually useful, not just technically complicated.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed">
          Have feedback, a bug to report, or just want to say hi? I actually read my emails: <a href="mailto:raghavkaushik1983@gmail.com" className="text-indigo-600 font-medium hover:underline">raghavkaushik1983@gmail.com</a>
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-32 pt-8 pb-12 border-t border-gray-200 w-full text-center">
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Made with a lot of chai and a little frustration by Raghav Kaushik.
        </p>
      </footer>
    </div>
  )
}

