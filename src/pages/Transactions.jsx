import { useState, useMemo } from 'react'
import { Search, Trash2, Pencil, Plus, Loader2, X, Check } from 'lucide-react'
import { useTransactions } from '../hooks/useTransactions'
import { CATEGORIES, getCategoryById } from '../lib/ai'
import { formatCurrency, formatDate } from '../lib/utils'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function Transactions() {
  const { transactions, loading, add, remove, update } = useTransactions()
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [addOpen, setAddOpen] = useState(false)
  const [newForm, setNewForm] = useState({
    merchant: '', amount: '', date: format(new Date(), 'yyyy-MM-dd'),
    category: 'food', payment_method: 'UPI', notes: ''
  })
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = !search || t.merchant.toLowerCase().includes(search.toLowerCase())
      const matchCat = filterCat === 'all' || t.category === filterCat
      return matchSearch && matchCat
    })
  }, [transactions, search, filterCat])

  const handleEdit = (tx) => {
    setEditId(tx.id)
    setEditForm({ merchant: tx.merchant, amount: tx.amount, date: tx.date, category: tx.category, payment_method: tx.payment_method, notes: tx.notes || '' })
  }

  const handleEditSave = async () => {
    await update(editId, { ...editForm, amount: parseFloat(editForm.amount) })
    setEditId(null)
  }

  const handleAdd = async () => {
    if (!newForm.merchant || !newForm.amount) return toast.error('Merchant and amount required')
    setSaving(true)
    try {
      await add({ ...newForm, amount: parseFloat(newForm.amount) })
      setAddOpen(false)
      setNewForm({ merchant: '', amount: '', date: format(new Date(), 'yyyy-MM-dd'), category: 'food', payment_method: 'UPI', notes: '' })
    } finally { setSaving(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={20} className="animate-spin text-gray-300" />
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Transactions</h1>
          <p className="text-xs text-gray-400 mt-0.5">{transactions.length} total</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary flex items-center gap-1.5">
          <Plus size={14} /> Add
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-8 w-48 text-xs"
            placeholder="Search merchant…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setFilterCat('all')}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${filterCat === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >All</button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCat(cat.id)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${filterCat === cat.id ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >{cat.emoji} {cat.label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            {search || filterCat !== 'all' ? 'Nothing found. Try a different filter, or stop trying to hide your coffee expenses.' : 'No transactions yet. Either you are incredibly frugal, or you just downloaded this app.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Merchant</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3 hidden md:table-cell">Date</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3 hidden sm:table-cell">Category</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3 hidden lg:table-cell">Payment</th>
                <th className="text-right text-xs font-medium text-gray-400 px-4 py-3">Amount</th>
                <th className="px-4 py-3 w-16" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(tx => {
                const cat = getCategoryById(tx.category)
                const isEditing = editId === tx.id
                return (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input className="input py-1 text-xs w-full max-w-[140px]" value={editForm.merchant} onChange={e => setEditForm(p => ({ ...p, merchant: e.target.value }))} />
                      ) : (
                        <span className="font-medium text-gray-900">{tx.merchant}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500">
                      {isEditing ? (
                        <input type="date" className="input py-1 text-xs" value={editForm.date} onChange={e => setEditForm(p => ({ ...p, date: e.target.value }))} />
                      ) : formatDate(tx.date)}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {isEditing ? (
                        <select className="input py-1 text-xs" value={editForm.category} onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}>
                          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
                        </select>
                      ) : (
                        <span className="badge bg-gray-100 text-gray-600">{cat.emoji} {cat.label}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">{tx.payment_method || 'UPI'}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {isEditing ? (
                        <input type="number" className="input py-1 text-xs text-right w-24" value={editForm.amount} onChange={e => setEditForm(p => ({ ...p, amount: e.target.value }))} />
                      ) : `−${formatCurrency(tx.amount)}`}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {isEditing ? (
                          <>
                            <button onClick={handleEditSave} className="p-1 rounded text-green-600 hover:bg-green-50"><Check size={14} /></button>
                            <button onClick={() => setEditId(null)} className="p-1 rounded text-gray-400 hover:bg-gray-100"><X size={14} /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit(tx)} className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"><Pencil size={13} /></button>
                            <button onClick={() => remove(tx.id)} className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={13} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add transaction modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold">Add transaction</h2>
              <button onClick={() => setAddOpen(false)}><X size={16} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Merchant *</label>
                  <input className="input" value={newForm.merchant} onChange={e => setNewForm(p => ({ ...p, merchant: e.target.value }))} placeholder="Merchant name" />
                </div>
                <div>
                  <label className="label">Amount (₹) *</label>
                  <input className="input" type="number" value={newForm.amount} onChange={e => setNewForm(p => ({ ...p, amount: e.target.value }))} placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Date</label>
                  <input className="input" type="date" value={newForm.date} onChange={e => setNewForm(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Payment</label>
                  <select className="input" value={newForm.payment_method} onChange={e => setNewForm(p => ({ ...p, payment_method: e.target.value }))}>
                    {['UPI', 'Cash', 'Credit Card', 'Debit Card', 'Wallet'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Category</label>
                <select className="input" value={newForm.category} onChange={e => setNewForm(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Notes</label>
                <input className="input" value={newForm.notes} onChange={e => setNewForm(p => ({ ...p, notes: e.target.value }))} placeholder="Optional note" />
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setAddOpen(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleAdd} disabled={saving} className="btn-primary flex-1">{saving ? 'Saving…' : 'Save'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
