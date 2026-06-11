// AI service using Anthropic Claude via Supabase Edge Functions
// All Claude API calls go through Edge Functions to keep the API key server-side

import { supabase } from './supabase'

// ─── OCR + Receipt Parsing ────────────────────────────────────────────────────
export async function parseReceiptWithAI(imageBase64, mimeType = 'image/jpeg') {
  const { data, error } = await supabase.functions.invoke('parse-receipt', {
    body: { imageBase64, mimeType },
  })
  if (error) throw new Error(error.message)
  return data // { amount, merchant, date, category, paymentMethod, confidence }
}

// ─── Spending Analysis ────────────────────────────────────────────────────────
export async function getSpendingAnalysis(transactions, budgets) {
  const { data, error } = await supabase.functions.invoke('spending-analysis', {
    body: { transactions, budgets },
  })
  if (error) throw new Error(error.message)
  return data // { insights: string[], suggestions: string[], summary: string }
}

// ─── Category Detection (text-based fallback) ─────────────────────────────────
export const CATEGORIES = [
  { id: 'food',          label: 'Food',          emoji: '🍔', color: '#2563eb' },
  { id: 'travel',        label: 'Travel',        emoji: '🚗', color: '#0891b2' },
  { id: 'shopping',      label: 'Shopping',      emoji: '🛒', color: '#7c3aed' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎮', color: '#d97706' },
  { id: 'education',     label: 'Education',     emoji: '📚', color: '#059669' },
  { id: 'health',        label: 'Health',        emoji: '💊', color: '#dc2626' },
  { id: 'utilities',     label: 'Utilities',     emoji: '⚡', color: '#64748b' },
  { id: 'other',         label: 'Other',         emoji: '📦', color: '#94a3b8' },
]

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]
}

// Known subscription services
export const SUBSCRIPTION_KEYWORDS = {
  netflix: { name: 'Netflix', emoji: 'N', color: '#dc2626' },
  spotify: { name: 'Spotify', emoji: 'S', color: '#16a34a' },
  'amazon prime': { name: 'Prime', emoji: 'P', color: '#f59e0b' },
  hotstar: { name: 'Hotstar', emoji: 'H', color: '#2563eb' },
  youtube: { name: 'YouTube', emoji: 'Y', color: '#dc2626' },
  'apple music': { name: 'Apple Music', emoji: 'A', color: '#64748b' },
  swiggy: { name: 'Swiggy One', emoji: 'S', color: '#f97316' },
  zomato: { name: 'Zomato Pro', emoji: 'Z', color: '#dc2626' },
}

export function detectSubscriptions(transactions) {
  const subs = {}
  transactions.forEach(tx => {
    const merchant = (tx.merchant || '').toLowerCase()
    for (const [key, meta] of Object.entries(SUBSCRIPTION_KEYWORDS)) {
      if (merchant.includes(key)) {
        if (!subs[key] || new Date(tx.date) > new Date(subs[key].lastDate)) {
          subs[key] = { ...meta, amount: tx.amount, lastDate: tx.date }
        }
      }
    }
  })
  return Object.values(subs)
}
