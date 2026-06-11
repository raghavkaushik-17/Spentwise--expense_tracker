// supabase/functions/parse-receipt/index.ts
// Deploy: supabase functions deploy parse-receipt
// Secret: supabase secrets set ANTHROPIC_API_KEY=your_key

import Anthropic from 'npm:@anthropic-ai/sdk@0.27.0'
import { format } from 'npm:date-fns@3.6.0'

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') })

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { imageBase64, mimeType } = await req.json()

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mimeType, data: imageBase64 }
          },
          {
            type: 'text',
            text: `Extract transaction data from this receipt image. Return ONLY valid JSON with:
- merchant: string (business name)
- amount: number (in rupees, no symbol)
- date: string (YYYY-MM-DD, today if not visible: ${format(new Date(), 'yyyy-MM-dd')})
- category: one of [food, travel, shopping, entertainment, education, health, utilities, other]
- payment_method: string (UPI/Cash/Credit Card/Debit Card/Wallet/Unknown)
- confidence: number 0-1

Return only JSON, no explanation.`
          }
        ]
      }]
    })

    const text = response.content[0].text.trim().replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(text)

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
