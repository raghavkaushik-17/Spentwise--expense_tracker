import { useMemo, useState } from 'react'
import { TrendingUp, TrendingDown, ArrowRight, Sparkles, Loader2, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTransactions } from '../hooks/useTransactions'
import { useBudgets } from '../hooks/useBudgets'
import {
  formatCurrency, formatShortDate, currentMonthTxs, prevMonthTxs,
  sumByCategory, totalSpend, todayTxs, pctChange, budgetColor, currentMonthLabel
} from '../lib/utils'
import { CATEGORIES, getCategoryById, detectSubscriptions, getSpendingAnalysis } from '../lib/ai'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_KEY || import.meta.env.VITE_GEMINI_KEY

export default function Dashboard() {
  const { transactions, loading } = useTransactions()
  const { budgets } = useBudgets()
  const [insights, setInsights] = useState([])
  const [aiLoading, setAiLoading] = useState(false)

  const thisMonth = useMemo(() => currentMonthTxs(transactions), [transactions])
  const lastMonth = useMemo(() => prevMonthTxs(transactions), [transactions])
  const today = useMemo(() => todayTxs(transactions), [transactions])
  const catBreakdown = useMemo(() => sumByCategory(thisMonth), [thisMonth])
  const lastCatBreakdown = useMemo(() => sumByCategory(lastMonth), [lastMonth])
  const total = useMemo(() => totalSpend(thisMonth), [thisMonth])
  const todayTotal = useMemo(() => totalSpend(today), [today])
  const subscriptions = useMemo(() => detectSubscriptions(transactions), [transactions])

  const chartData = CATEGORIES
    .map(cat => ({ name: cat.label, value: catBreakdown[cat.id] || 0, color: cat.color, emoji: cat.emoji }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value)

  const monthChange = pctChange(total, totalSpend(lastMonth))
  const todayChange = pctChange(todayTotal, totalSpend(prevMonthTxs(transactions).filter(t => {
    const d = new Date(t.date); return d.getDate() === new Date().getDate()
  })))

  const topCat = chartData[0]

  const loadInsights = async () => {
    if (!ANTHROPIC_KEY) return toast.error('Add VITE_ANTHROPIC_KEY to .env to enable AI insights')
    setAiLoading(true)
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${ANTHROPIC_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this spending data and give 3 short, specific, actionable insights for an Indian user.
Current month spending by category (₹): ${JSON.stringify(catBreakdown)}
Last month spending by category (₹): ${JSON.stringify(lastCatBreakdown)}
Total this month: ₹${total}
Budgets set: ${JSON.stringify(budgets.map(b => ({ category: b.category, budget: b.amount, spent: catBreakdown[b.category] || 0 })))}

Return ONLY a JSON array of exactly 3 objects like:
[{"type":"warning|tip|alert","title":"short title","body":"one sentence insight"}]
No markdown, no explanation.`
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API request failed with status ${res.status}`);
      }
      const data = await res.json()
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid API response structure');
      }
      const text = data.candidates[0].content.parts[0].text.trim().replace(/```json|```/g, '').trim()
      setInsights(JSON.parse(text))
    } catch (err) {
      console.error('AI Insights Error:', err)
      toast.error(`Could not load AI insights: ${err.message}`)
    } finally {
      setAiLoading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={20} className="animate-spin text-gray-300" />
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h1 className="text-base font-semibold text-gray-900">Dashboard</h1>
        <p className="text-xs text-gray-400 mt-0.5">{currentMonthLabel()}</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Today" value={formatCurrency(todayTotal)} sub={`${today.length} transactions`} />
        <MetricCard
          label={`${currentMonthLabel().split(' ')[0]} total`}
          value={formatCurrency(total)}
          change={monthChange}
          sub="vs last month"
        />
        <MetricCard label="Top category" value={topCat?.name || '—'} sub={topCat ? formatCurrency(catBreakdown[topCat.name.toLowerCase()]) : 'No data'} />
        <MetricCard label="Transactions" value={thisMonth.length} sub={`this month`} />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Left: chart + recent */}
        <div className="lg:col-span-3 space-y-5">
          {/* Category chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-900">Spending by category</h2>
              <span className="text-xs text-gray-400">{currentMonthLabel()}</span>
            </div>
            {chartData.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-sm text-gray-400">
                No transactions yet this month
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} width={80} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => [formatCurrency(v), 'Spent']} cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Recent transactions */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-900">Recent transactions</h2>
              <Link to="/transactions" className="text-xs text-accent-600 hover:underline flex items-center gap-1">
                View all <ArrowRight size={11} />
              </Link>
            </div>
            {transactions.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No transactions yet. Upload a receipt to get started.</p>
            ) : (
              <div className="space-y-0 divide-y divide-gray-100">
                {transactions.slice(0, 6).map(tx => {
                  const cat = getCategoryById(tx.category)
                  return (
                    <div key={tx.id} className="flex items-center gap-3 py-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: cat.color + '18' }}>
                        {cat.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{tx.merchant}</p>
                        <p className="text-xs text-gray-400">{formatShortDate(tx.date)} · {tx.payment_method || 'UPI'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">−{formatCurrency(tx.amount)}</p>
                        <p className="text-xs text-gray-400">{cat.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: budgets + AI + subscriptions */}
        <div className="lg:col-span-2 space-y-5">
          {/* Budget status */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-900">Budget status</h2>
              <Link to="/budgets" className="text-xs text-accent-600 hover:underline">Manage</Link>
            </div>
            {budgets.length === 0 ? (
              <p className="text-xs text-gray-400">No budgets set. <Link to="/budgets" className="text-accent-600 hover:underline">Set one →</Link></p>
            ) : (
              <div className="space-y-3.5">
                {budgets.map(b => {
                  const spent = catBreakdown[b.category] || 0
                  const pct = Math.min(Math.round((spent / b.amount) * 100), 100)
                  const cat = getCategoryById(b.category)
                  const color = budgetColor(pct)
                  return (
                    <div key={b.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">{cat.emoji} {cat.label}</span>
                        <span className="text-gray-400">{formatCurrency(spent)} / {formatCurrency(b.amount)}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      {pct >= 90 && (
                        <p className="text-xs mt-0.5" style={{ color }}>
                          {pct >= 100 ? 'Budget exceeded' : `${pct}% used — ${formatCurrency(b.amount - spent)} left`}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* AI Insights */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-900">AI insights</h2>
              <button
                onClick={loadInsights}
                disabled={aiLoading}
                className="text-xs text-accent-600 hover:underline flex items-center gap-1"
              >
                {aiLoading ? <><Loader2 size={11} className="animate-spin" /> Loading…</> : <><Sparkles size={11} /> Refresh</>}
              </button>
            </div>
            {insights.length === 0 ? (
              <button
                onClick={loadInsights}
                disabled={aiLoading}
                className="w-full border border-dashed border-gray-200 rounded-xl py-6 text-center hover:border-gray-300 transition-colors"
              >
                <Sparkles size={18} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs text-gray-500 font-medium">Get AI spending insights</p>
                <p className="text-xs text-gray-400 mt-0.5">Analyzes your transactions</p>
              </button>
            ) : (
              <div className="space-y-2">
                {insights.map((ins, i) => (
                  <div key={i} className={`rounded-lg p-3 text-xs ${
                    ins.type === 'warning' ? 'bg-amber-50 border border-amber-100' :
                    ins.type === 'alert' ? 'bg-red-50 border border-red-100' :
                    'bg-blue-50 border border-blue-100'
                  }`}>
                    <p className="font-medium text-gray-800 mb-0.5">{ins.title}</p>
                    <p className="text-gray-500 leading-relaxed">{ins.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subscriptions */}
          {subscriptions.length > 0 && (
            <div className="card">
              <h2 className="text-sm font-medium text-gray-900 mb-3">Subscriptions detected</h2>
              <div className="space-y-0 divide-y divide-gray-100">
                {subscriptions.map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-2">
                    <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: s.color || '#64748b' }}>
                      {s.emoji}
                    </div>
                    <span className="flex-1 text-sm text-gray-700">{s.name}</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(s.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between text-xs">
                <span className="text-gray-400">Monthly total</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(subscriptions.reduce((s, sub) => s + sub.amount, 0))}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, sub, change }) {
  return (
    <div className="metric-card">
      <p className="text-xs text-gray-500 mb-1.5">{label}</p>
      <p className="text-xl font-semibold text-gray-900 leading-none">{value}</p>
      <div className="flex items-center gap-1.5 mt-1.5">
        {change !== null && change !== undefined && (
          <span className={`badge ${change > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
            {change > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(change)}%
          </span>
        )}
        <span className="text-xs text-gray-400">{sub}</span>
      </div>
    </div>
  )
}
