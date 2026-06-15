export default function Terms() {
  return (
    <div className="pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 border-b border-gray-100 pb-4">
          Terms of Service
        </h1>
        <p className="text-xs text-gray-400">Last updated: June 15, 2026</p>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900">1. Acceptance of Terms</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            By accessing or using Spentwise, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the application.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900">2. Description of Service</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Spentwise is a smart expense tracker. Features include manual expense entry, receipt scanning/OCR processing, budgeting, and dashboard statistics. We reserve the right to modify or discontinue any part of the service at any time without notice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900">3. User Accounts & Security</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            To use the dashboard, you must register for an account (via email or third-party providers like Google). You are responsible for keeping your password secure and for all activity occurring under your account. You must notify us immediately of any unauthorized use.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900">4. Prohibited Uses</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            You agree not to use the application to perform illegal activities, upload malicious code/viruses, disrupt server resources, or attempt to access other users' private database buckets.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900">5. Limitation of Liability</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Spentwise is provided "as is" without warranty of any kind. We are not liable for direct, indirect, incidental, or consequential damages resulting from data loss, server downtime, or AI interpretation errors of your receipts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900">6. Changes to Terms</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We may update these terms periodically. Continuing to use the app after changes constitute your acceptance of the new terms.
          </p>
        </section>
      </div>
    </div>
  )
}
