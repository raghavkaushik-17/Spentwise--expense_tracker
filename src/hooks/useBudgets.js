import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export function useBudgets() {
  const { user } = useAuth()
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
    if (error) toast.error('Failed to load budgets')
    else setBudgets(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  const upsert = async (category, amount) => {
    const existing = budgets.find(b => b.category === category)
    if (existing) {
      const { data, error } = await supabase
        .from('budgets')
        .update({ amount })
        .eq('id', existing.id)
        .select()
        .single()
      if (error) { toast.error('Failed to update budget'); throw error }
      setBudgets(prev => prev.map(b => b.id === existing.id ? data : b))
    } else {
      const { data, error } = await supabase
        .from('budgets')
        .insert({ category, amount, user_id: user.id })
        .select()
        .single()
      if (error) { toast.error('Failed to create budget'); throw error }
      setBudgets(prev => [...prev, data])
    }
    toast.success('Budget saved')
  }

  const remove = async (id) => {
    const { error } = await supabase.from('budgets').delete().eq('id', id)
    if (error) { toast.error('Failed to delete budget'); throw error }
    setBudgets(prev => prev.filter(b => b.id !== id))
    toast.success('Budget removed')
  }

  return { budgets, loading, refetch: fetch, upsert, remove }
}
