// supabase/functions/spending-analysis/index.ts
// Deploy: supabase functions deploy spending-analysis

import Anthropic from 'npm:@anthropic-ai/sdk@0.27.0'

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') })

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { transactions, budgets } = await req.json()

    const catTotals: Record<string, number> = {}
    transactions.forEach((t: any) => {
      catTotals[t.category] = (catTotals[t.category] || 0) + Number(t.amount)
    })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `Analyze spending for an Indian user and return 3 actionable insights.

Spending by category (₹): ${JSON.stringify(catTotals)}
Budgets: ${JSON.stringify(budgets?.map((b: any) => ({ category: b.category, budget: b.amount, spent: catTotals[b.category] || 0 })))}
Total transactions: ${transactions.length}

Return ONLY a JSON array of 3 objects:
[{"type":"warning|tip|alert","title":"short title max 6 words","body":"one specific actionable sentence in INR"}]`
      }]
    })

    const text = response.content[0].text.trim().replace(/```json|```/g, '').trim()
    const insights = JSON.parse(text)

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
