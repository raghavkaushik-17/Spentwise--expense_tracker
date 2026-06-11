import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { createWorker } from 'tesseract.js'
import { CATEGORIES, getCategoryById } from '../../lib/ai'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_KEY || import.meta.env.VITE_GEMINI_KEY // optional direct key for OCR parsing

async function parseWithClaude(ocrText) {
  // Call Gemini to extract structured data from raw OCR text
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${ANTHROPIC_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Extract transaction data from this OCR receipt text. Return ONLY valid JSON with these fields:
- merchant (string, business name)
- amount (number, in rupees, no currency symbol)
- date (string, YYYY-MM-DD format, use today if not found)
- category (one of: food, travel, shopping, entertainment, education, health, utilities, other)
- payment_method (string: UPI/Cash/Credit Card/Debit Card/Wallet/Unknown)

OCR Text:
${ocrText}

Today's date: ${format(new Date(), 'yyyy-MM-dd')}
Return only JSON, no explanation.`
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  })
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `AI parsing failed with status ${res.status}`);
  }
  const data = await res.json()
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid API response structure');
  }
  const text = data.candidates[0].content.parts[0].text.trim()
  return JSON.parse(text.replace(/```json|```/g, '').trim())
}

function fallbackParse(text) {
  // Simple regex fallback if no API key
  const amountMatch = text.match(/(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{2})?)|(\d+(?:\.\d{2})?)\s*(?:₹|Rs)/i)
  const amount = amountMatch
    ? parseFloat((amountMatch[1] || amountMatch[2]).replace(/,/g, ''))
    : 0

  const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/)
  let date = format(new Date(), 'yyyy-MM-dd')
  if (dateMatch) {
    try {
      const [, d, m, y] = dateMatch
      const year = y.length === 2 ? `20${y}` : y
      date = `${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
    } catch {}
  }

  const lines = text.split('\n').filter(l => l.trim().length > 2)
  const merchant = lines[0]?.trim().replace(/[^a-zA-Z0-9 '&-]/g, '').trim() || 'Unknown'

  // Simple keyword category detection
  const lower = text.toLowerCase()
  let category = 'other'
  if (/food|restaurant|cafe|pizza|burger|swiggy|zomato|biryani|hotel|dhaba/.test(lower)) category = 'food'
  else if (/uber|ola|petrol|fuel|metro|bus|train|flight|cab|auto/.test(lower)) category = 'travel'
  else if (/amazon|flipkart|myntra|mall|store|mart|shop/.test(lower)) category = 'shopping'
  else if (/netflix|spotify|movie|cinema|game|prime/.test(lower)) category = 'entertainment'
  else if (/udemy|coursera|college|school|book|tuition/.test(lower)) category = 'education'
  else if (/pharmacy|hospital|clinic|medicine|health/.test(lower)) category = 'health'
  else if (/electricity|water|gas|internet|recharge/.test(lower)) category = 'utilities'

  return { merchant, amount, date, category, payment_method: 'Unknown' }
}

export default function UploadModal({ onClose, onSave }) {
  const [step, setStep] = useState('upload') // upload | processing | review | manual
  const [preview, setPreview] = useState(null)
  const [parsed, setParsed] = useState(null)
  const [form, setForm] = useState({
    merchant: '', amount: '', date: format(new Date(), 'yyyy-MM-dd'),
    category: 'food', payment_method: 'UPI', notes: ''
  })
  const [saving, setSaving] = useState(false)

  const processImage = async (file) => {
    setStep('processing')
    setPreview(URL.createObjectURL(file))
    try {
      // 1. OCR with Tesseract
      const worker = await createWorker('eng')
      const { data: { text } } = await worker.recognize(file)
      await worker.terminate()

      // 2. Parse with AI or fallback
      let extracted
      if (ANTHROPIC_KEY) {
        try { extracted = await parseWithClaude(text) } catch { extracted = fallbackParse(text) }
      } else {
        extracted = fallbackParse(text)
      }

      setParsed(extracted)
      setForm({
        merchant: extracted.merchant || '',
        amount: extracted.amount || '',
        date: extracted.date || format(new Date(), 'yyyy-MM-dd'),
        category: extracted.category || 'other',
        payment_method: extracted.payment_method || 'UPI',
        notes: ''
      })
      setStep('review')
    } catch (err) {
      toast.error('Could not read receipt. Please fill in manually.')
      setStep('manual')
    }
  }

  const onDrop = useCallback((files) => {
    if (files[0]) processImage(files[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1
  })

  const handleSave = async () => {
    if (!form.merchant || !form.amount || !form.date) {
      return toast.error('Please fill in merchant, amount, and date')
    }
    setSaving(true)
    try {
      await onSave({
        merchant: form.merchant,
        amount: parseFloat(form.amount),
        date: form.date,
        category: form.category,
        payment_method: form.payment_method,
        notes: form.notes,
      })
    } catch {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">
            {step === 'upload' && 'Upload receipt'}
            {step === 'processing' && 'Reading receipt…'}
            {step === 'review' && 'Confirm transaction'}
            {step === 'manual' && 'Add transaction'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          {/* Upload step */}
          {step === 'upload' && (
            <>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-accent-500 bg-accent-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input {...getInputProps()} />
                <Upload size={24} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-700">Drop receipt here</p>
                <p className="text-xs text-gray-400 mt-1">or click to browse · JPG, PNG, WEBP</p>
              </div>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <button
                onClick={() => setStep('manual')}
                className="btn-secondary w-full"
              >
                Add manually
              </button>
            </>
          )}

          {/* Processing step */}
          {step === 'processing' && (
            <div className="text-center py-10">
              {preview && (
                <img src={preview} alt="receipt" className="w-24 h-32 object-cover rounded-lg mx-auto mb-4 opacity-60" />
              )}
              <Loader2 size={24} className="animate-spin text-accent-600 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Extracting data with AI…</p>
              <p className="text-xs text-gray-400 mt-1">This takes a few seconds</p>
            </div>
          )}

          {/* Review / Manual step */}
          {(step === 'review' || step === 'manual') && (
            <>
              {step === 'review' && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 text-xs px-3 py-2 rounded-lg mb-4">
                  <CheckCircle2 size={13} />
                  Receipt scanned successfully. Review and confirm.
                </div>
              )}

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Merchant *</label>
                    <input className="input" value={form.merchant} onChange={e => setForm(p => ({ ...p, merchant: e.target.value }))} placeholder="McDonald's" />
                  </div>
                  <div>
                    <label className="label">Amount (₹) *</label>
                    <input className="input" type="number" min="0" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="350" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Date *</label>
                    <input className="input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Payment method</label>
                    <select className="input" value={form.payment_method} onChange={e => setForm(p => ({ ...p, payment_method: e.target.value }))}>
                      {['UPI', 'Cash', 'Credit Card', 'Debit Card', 'Wallet', 'Unknown'].map(m => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Category</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setForm(p => ({ ...p, category: cat.id }))}
                        className={`flex flex-col items-center gap-0.5 py-2 rounded-lg text-xs border transition-all ${
                          form.category === cat.id
                            ? 'border-accent-500 bg-accent-50 text-accent-700 font-medium'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Notes (optional)</label>
                  <input className="input" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Team lunch, client dinner…" />
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Saving…' : 'Save transaction'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
