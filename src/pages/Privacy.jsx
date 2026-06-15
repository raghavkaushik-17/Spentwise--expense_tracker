export default function Privacy() {
  return (
    <div className="pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 border-b border-gray-100 pb-4">
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-400">Last updated: June 15, 2026</p>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900">1. Information We Collect</h2>
          <p className="text-sm text-gray-600 leading-relaxed font-sans">
            To provide our expense tracking services, we collect user-provided details including email addresses, profile names (via sign-up or Google OAuth), transaction logs (merchants, amounts, categories, and dates), and uploaded receipt images.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900">2. How We Use Your Data</h2>
          <p className="text-sm text-gray-600 leading-relaxed font-sans">
            We use your data solely to run your personal dashboard. This includes:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-2">
            <li>Displaying charts, area graphs, and budget warnings.</li>
            <li>Analyzing transaction patterns to detect recurring subscriptions.</li>
            <li>Sending receipt data to our AI service (Claude) for automatic OCR extraction.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900">3. Data Security and Privacy</h2>
          <p className="text-sm text-gray-600 leading-relaxed font-sans">
            We prioritize the security of your data. The Spentwise database is hosted on **Supabase** with **Row Level Security (RLS)** enabled on all tables. This guarantees that your financial records are only readable and writeable by you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900">4. Third-Party Services</h2>
          <p className="text-sm text-gray-600 leading-relaxed font-sans">
            Receipt images and contents are parsed using our Claude AI integration. We do not sell, rent, or distribute your email or personal transactions to advertisers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900">5. Your Rights</h2>
          <p className="text-sm text-gray-600 leading-relaxed font-sans">
            You have full ownership of your records. You can delete individual transaction entries at any time directly through the dashboard interface.
          </p>
        </section>
      </div>
    </div>
  )
}
