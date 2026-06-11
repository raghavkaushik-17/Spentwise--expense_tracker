import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export function useTransactions() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
    if (error) toast.error('Failed to load transactions')
    else setTransactions(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  const add = async (tx) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...tx, user_id: user.id })
      .select()
      .single()
    if (error) { toast.error('Failed to save transaction'); throw error }
    setTransactions(prev => [data, ...prev])
    toast.success('Transaction saved')
    return data
  }

  const remove = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) { toast.error('Failed to delete'); throw error }
    setTransactions(prev => prev.filter(t => t.id !== id))
    toast.success('Transaction deleted')
  }

  const update = async (id, updates) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) { toast.error('Failed to update'); throw error }
    setTransactions(prev => prev.map(t => t.id === id ? data : t))
    toast.success('Transaction updated')
    return data
  }

  return { transactions, loading, refetch: fetch, add, remove, update }
}
