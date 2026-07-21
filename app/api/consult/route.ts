import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import inventoryData from '../../../src/data/inventory.json';

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1"
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // SECURITY: Inject inventory server-side. Client never sees the whole list unless AI suggests it.
    const systemPrompt = `You are 'Apex', an elite PC building architect and sales rep. 
    Your job is to help the user build a custom PC based on their needs and budget.
    
    Here is the current inventory available in the store:
    ${JSON.stringify(inventoryData)}
    
    Rules:
    1. Ask clarifying questions if their request is vague (e.g., "What games do you play?" or "Do you stream?").
    2. Only recommend parts that exist in the inventory. Do not make up parts.
    3. Ensure compatibility (e.g., AMD CPU needs AM5 Motherboard, Intel needs LGA 1700).
    4. You MUST respond in STRICT JSON format only. No markdown, no backticks.
    
    The JSON format must be exactly:
    {
      "reply": "Your conversational response to the user.",
      "recommendations": [
        { "id": "cpu1", "reason": "This CPU is best for your gaming needs because..." }
      ]
    }`;

    const fullMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: fullMessages,
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    let aiText = completion.choices[0].message.content || '{}';
    const aiData = JSON.parse(aiText);

    return NextResponse.json(aiData);

  } catch (error: any) {
    console.error('Apex AI Error:', error);
    return NextResponse.json({ error: 'Failed to get consultation' }, { status: 500 });
  }
}