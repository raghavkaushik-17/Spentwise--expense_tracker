import { CheckCircle2 } from 'lucide-react'

export default function About() {
  return (
    <div className="pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Title / Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            About Spentwise
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            We build intelligent personal finance tools designed to simplify money management for students and young professionals.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Managing finances can be stressful, especially when balancing studies, internships, and social life. Spentwise was created to solve this challenge. By leveraging OCR (Optical Character Recognition) and modern AI, we automate the boring parts of budgeting, giving you clean, simple visual summaries and real-time warnings.
          </p>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Whether you want to track where your food budget goes, split a bill with friends, or ensure your streaming subscriptions don't eat into your savings, Spentwise helps you stay in control without the hassle of manual spreadsheets.
          </p>
        </div>

        {/* Core Values */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 text-center">Our Core Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm space-y-3">
              <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-700 flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Simplicity First</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                No complex financial jargon. Just upload your bills and view intuitive dashboards.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm space-y-3">
              <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-700 flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">AI Automation</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Scan receipts in seconds. Let the system automatically categorize merchants and items.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm space-y-3">
              <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-700 flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Bank-grade Security</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Your data is protected. Built on Supabase Row Level Security to ensure full privacy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
