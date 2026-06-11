import { useState, useMemo } from 'react'
import { Plus, Trash2, Loader2, SplitSquareVertical } from 'lucide-react'
import { useBudgets } from '../hooks/useBudgets'
import { useTransactions } from '../hooks/useTransactions'
import { CATEGORIES, getCategoryById } from '../lib/ai'
import { formatCurrency, currentMonthTxs, sumByCategory, budgetColor } from '../lib/utils'

export default function Budgets() {
  const { budgets, loading, upsert, remove } = useBudgets()
  const { transactions } = useTransactions()
  const [newCat, setNewCat] = useState('food')
  const [newAmt, setNewAmt] = useState('')
  const [saving, setSaving] = useState(false)

  // Split expense state
  const [splitAmt, setSplitAmt] = useState(1200)
  const [splitN, setSplitN] = useState(4)

  const thisMonth = useMemo(() => currentMonthTxs(transactions), [transactions])
  const catSpend = useMemo(() => sumByCategory(thisMonth), [thisMonth])

  const handleAdd = async () => {
    if (!newAmt || isNaN(newAmt)) return
    setSaving(true)
    try {
      await upsert(newCat, parseFloat(newAmt))
      setNewAmt('')
    } finally { setSaving(false) }
  }

  const unusedCategories = CATEGORIES.filter(c => !budgets.find(b => b.category === c.id))

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={20} className="animate-spin text-gray-300" />
    </div>
  )

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-base font-semibold text-gray-900">Budgets</h1>
        <p className="text-xs text-gray-400 mt-0.5">Set monthly limits per category</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Budget list */}
        <div className="space-y-4">
          {/* Add budget */}
          <div className="card">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Add / update budget</h2>
            <div className="flex gap-2">
              <select
                className="input flex-1"
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                ))}
              </select>
              <input
                type="number"
                className="input w-32"
                placeholder="₹ limit"
                value={newAmt}
                onChange={e => setNewAmt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
              <button
                onClick={handleAdd}
                disabled={saving || !newAmt}
                className="btn-primary flex items-center gap-1.5 flex-shrink-0"
              >
                <Plus size={14} />
                {saving ? 'Saving…' : 'Set'}
              </button>
            </div>
          </div>

          {/* Budget cards */}
          {budgets.length === 0 ? (
            <div className="card text-center py-10 text-sm text-gray-400">
              No budgets set yet. Add one above.
            </div>
          ) : (
            <div className="space-y-3">
              {budgets.map(b => {
                const spent = catSpend[b.category] || 0
                const pct = Math.min(Math.round((spent / b.amount) * 100), 100)
                const cat = getCategoryById(b.category)
                const color = budgetColor(pct)
                const remaining = b.amount - spent

                return (
                  <div key={b.id} className="card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{cat.emoji}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{cat.label}</p>
                          <p className="text-xs text-gray-400">Budget: {formatCurrency(b.amount)}/month</p>
                        </div>
                      </div>
                      <button
                        onClick={() => remove(b.id)}
                        className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Spent: {formatCurrency(spent)}</span>
                      <span className={pct >= 100 ? 'text-red-600 font-medium' : pct >= 90 ? 'text-amber-600 font-medium' : 'text-gray-500'}>
                        {pct >= 100
                          ? `Over by ${formatCurrency(Math.abs(remaining))}`
                          : `${formatCurrency(remaining)} left · ${pct}%`}
                      </span>
                    </div>

                    {pct >= 90 && pct < 100 && (
                      <div className="mt-2 text-xs bg-amber-50 text-amber-700 rounded-lg px-3 py-2">
                        ⚠ You've used {pct}% of your {cat.label} budget this month.
                      </div>
                    )}
                    {pct >= 100 && (
                      <div className="mt-2 text-xs bg-red-50 text-red-700 rounded-lg px-3 py-2">
                        🚨 Budget exceeded by {formatCurrency(Math.abs(remaining))}.
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right: summary table + split calculator */}
        <div className="space-y-4">
          {/* Category summary */}
          <div className="card">
            <h2 className="text-sm font-medium text-gray-900 mb-3">This month's spending</h2>
            <div className="divide-y divide-gray-100">
              {CATEGORIES.map(cat => {
                const spent = catSpend[cat.id] || 0
                if (!spent) return null
                return (
                  <div key={cat.id} className="flex items-center gap-3 py-2.5">
                    <span>{cat.emoji}</span>
                    <span className="flex-1 text-sm text-gray-700">{cat.label}</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(spent)}</span>
                  </div>
                )
              })}
              {Object.values(catSpend).every(v => !v) && (
                <p className="text-xs text-gray-400 py-4 text-center">No spending this month</p>
              )}
            </div>
          </div>

          {/* Split expense calculator */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <SplitSquareVertical size={15} className="text-gray-400" />
              <h2 className="text-sm font-medium text-gray-900">Split expense</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="label">Total amount (₹)</label>
                <input
                  type="number"
                  className="input"
                  value={splitAmt}
                  onChange={e => setSplitAmt(parseFloat(e.target.value) || 0)}
                  placeholder="1200"
                />
              </div>
              <div>
                <label className="label">Number of people</label>
                <input
                  type="number"
                  className="input"
                  min="1"
                  max="50"
                  value={splitN}
                  onChange={e => setSplitN(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>

              <div className="bg-accent-50 border border-accent-100 rounded-xl p-4 text-center">
                <p className="text-2xl font-semibold text-accent-700">{formatCurrency(splitAmt / splitN)}</p>
                <p className="text-xs text-gray-500 mt-1">per person</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total</span>
                  <span className="font-medium">{formatCurrency(splitAmt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">People</span>
                  <span className="font-medium">{splitN}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-1.5">
                  <span className="text-gray-500">Each pays</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(splitAmt / splitN)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
