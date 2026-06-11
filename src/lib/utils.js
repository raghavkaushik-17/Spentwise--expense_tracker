import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns'

export const formatCurrency = (amount) =>
  `₹${Number(amount).toLocaleString('en-IN')}`

export const formatDate = (dateStr) =>
  format(new Date(dateStr), 'd MMM yyyy')

export const formatShortDate = (dateStr) =>
  format(new Date(dateStr), 'd MMM')

// Get transactions for the current calendar month
export function currentMonthTxs(transactions) {
  const now = new Date()
  const start = startOfMonth(now)
  const end = endOfMonth(now)
  return transactions.filter(t =>
    isWithinInterval(new Date(t.date), { start, end })
  )
}

// Get transactions for a previous month (offset = 1 means last month)
export function prevMonthTxs(transactions, offset = 1) {
  const prev = subMonths(new Date(), offset)
  const start = startOfMonth(prev)
  const end = endOfMonth(prev)
  return transactions.filter(t =>
    isWithinInterval(new Date(t.date), { start, end })
  )
}

// Sum by category
export function sumByCategory(transactions) {
  return transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount)
    return acc
  }, {})
}

// Total spend
export const totalSpend = (transactions) =>
  transactions.reduce((s, t) => s + Number(t.amount), 0)

// Today's transactions
export function todayTxs(transactions) {
  const today = format(new Date(), 'yyyy-MM-dd')
  return transactions.filter(t => t.date === today)
}

// Percent change between two numbers
export function pctChange(current, previous) {
  if (!previous) return null
  return Math.round(((current - previous) / previous) * 100)
}

// Budget status color
export function budgetColor(pct) {
  if (pct >= 90) return '#f59e0b'
  if (pct >= 100) return '#dc2626'
  return '#2563eb'
}

export function currentMonthLabel() {
  return format(new Date(), 'MMMM yyyy')
}
