import { useState } from 'react'
import { Mail, MessageSquare, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      toast.success("Thank you! Your message has been sent successfully.")
      setName('')
      setEmail('')
      setMessage('')
      setSending(false)
    }, 1000)
  }

  return (
    <div className="pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Contact Us
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Have questions, feedback, or need help? Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Info cards */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-700 flex items-center justify-center flex-shrink-0">
                <Mail size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-gray-900">Email Us</h3>
                <p className="text-xs text-gray-500">For general support and inquiries:</p>
                <a href="mailto:support@spentwise.com" className="text-xs font-medium text-accent-600 hover:underline">
                  support@spentwise.com
                </a>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-700 flex items-center justify-center flex-shrink-0">
                <MessageSquare size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-gray-900">FAQ & Feedback</h3>
                <p className="text-xs text-gray-500">We appreciate user suggestions and feature requests.</p>
                <a href="mailto:feedback@spentwise.com" className="text-xs font-medium text-accent-600 hover:underline">
                  feedback@spentwise.com
                </a>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-700 flex items-center justify-center flex-shrink-0">
                <MapPin size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-gray-900">Location</h3>
                <p className="text-xs text-gray-500">Based globally, working remotely.</p>
                <span className="text-xs font-medium text-gray-700">Bangalore, India</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="label">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="input min-h-[100px] resize-y"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
