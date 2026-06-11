import { useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts'
import { useTransactions } from '../hooks/useTransactions'
import { CATEGORIES, getCategoryById } from '../lib/ai'
import { formatCurrency, sumByCategory } from '../lib/utils'
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns'

function monthRange(offset) {
  const d = subMonths(new Date(), offset)
  return { start: startOfMonth(d), end: endOfMonth(d), label: format(d, 'MMM') }
}

export default function Reports() {
  const { transactions, loading } = useTransactions()

  // Last 6 months monthly totals
  const monthlyData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const { start, end, label } = monthRange(5 - i)
      const txs = transactions.filter(t => isWithinInterval(new Date(t.date), { start, end }))
      const total = txs.reduce((s, t) => s + Number(t.amount), 0)
      return { label, total, txs }
    })
  }, [transactions])

  // Category pie for current month
  const { start: mStart, end: mEnd } = monthRange(0)
  const thisMonthTxs = transactions.filter(t => isWithinInterval(new Date(t.date), { start: mStart, end: mEnd }))
  const catBreakdown = sumByCategory(thisMonthTxs)
  const pieData = CATEGORIES
    .map(c => ({ name: c.label, value: catBreakdown[c.id] || 0, color: c.color, emoji: c.emoji }))
    .filter(d => d.value > 0)

  // Daily spending last 30 days
  const today = new Date()
  const thirtyDaysAgo = subMonths(today, 1)
  const last30 = transactions
    .filter(t => isWithinInterval(new Date(t.date), { start: thirtyDaysAgo, end: today }))
  const dailyMap = {}
  last30.forEach(t => {
    dailyMap[t.date] = (dailyMap[t.date] || 0) + Number(t.amount)
  })
  const dailyData = eachDayOfInterval({ start: thirtyDaysAgo, end: today })
    .map(d => ({
      label: format(d, 'dd MMM'),
      value: dailyMap[format(d, 'yyyy-MM-dd')] || 0
    }))
    .filter((_, i) => i % 2 === 0) // every 2nd day to reduce density

  // Top merchants
  const merchantMap = {}
  transactions.forEach(t => {
    merchantMap[t.merchant] = (merchantMap[t.merchant] || 0) + Number(t.amount)
  })
  const topMerchants = Object.entries(merchantMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={20} className="animate-spin text-gray-300" />
    </div>
  )

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-base font-semibold text-gray-900">Reports</h1>
        <p className="text-xs text-gray-400 mt-0.5">Spending trends and analysis</p>
      </div>

      {/* Monthly trend */}
      <div className="card">
        <h2 className="text-sm font-medium text-gray-900 mb-4">Monthly spending — last 6 months</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
            <Tooltip formatter={v => [formatCurrency(v), 'Spent']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
            <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} fill="url(#grad)" dot={{ r: 3, fill: '#2563eb' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Category pie */}
        <div className="card">
          <h2 className="text-sm font-medium text-gray-900 mb-4">This month by category</h2>
          {pieData.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-sm text-gray-400">No data</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={v => [formatCurrency(v)]} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                    <span className="flex-1 text-gray-600">{d.emoji} {d.name}</span>
                    <span className="font-medium text-gray-900">{formatCurrency(d.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Top merchants */}
        <div className="card">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Top merchants — all time</h2>
          {topMerchants.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-sm text-gray-400">No data</div>
          ) : (
            <div className="space-y-3">
              {topMerchants.map(([merchant, amount], i) => {
                const max = topMerchants[0][1]
                return (
                  <div key={merchant}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">{i + 1}. {merchant}</span>
                      <span className="text-gray-500">{formatCurrency(amount)}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-600 rounded-full"
                        style={{ width: `${(amount / max) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Daily spending */}
      <div className="card">
        <h2 className="text-sm font-medium text-gray-900 mb-4">Daily spending — last 30 days</h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={dailyData}>
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={4} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
            <Tooltip formatter={v => [formatCurrency(v), 'Spent']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
            <Bar dataKey="value" fill="#2563eb" radius={[3, 3, 0, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
