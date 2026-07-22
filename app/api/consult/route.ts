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

    const sanitizedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));

    const recentMessages = sanitizedMessages.slice(-6);

    const systemPrompt = `You are 'Apex', an elite PC building architect and sales rep. 
    Your job is to help the user build a custom PC based on their needs and budget.
    
    Here is the current inventory available in the store:
    ${JSON.stringify(inventoryData)}
    
    Modes:
    1. PRESET MODE: If the user mentions a specific rig name (e.g., 'Apex Render', 'Apex Scout', 'Apex Blade 14') AND a target budget, IMMEDIATELY recommend a COMPLETE 7-part build (CPU, Motherboard, GPU, RAM, Storage, Power Supply, Case) that fits that specific target budget. 
       - Ensure the total cost of recommended parts is strictly under the target budget.
       - Prioritize GPU performance for gaming rigs, and CPU core count for workstations.
    2. CUSTOM MODE: If the user wants to build custom, guide them ONE STEP AT A TIME. First, recommend 1-2 CPUs. Wait for their choice. Then recommend Motherboards. Only recommend one category at a time.
    3. CONVERSATION MODE: If the user asks a general question (e.g., "anything else?", "what is your return policy?"), answer it directly. DO NOT recommend parts unless the user explicitly asks for a build or a part.
    
    Rules:
    1. Ensure 100% compatibility (AMD CPU needs AMD Motherboard, Intel needs Intel. DDR4 RAM needs DDR4 Mobo, DDR5 needs DDR5).
    2. Only recommend parts that exist in the inventory. Do not make up parts.
    3. You MUST respond in STRICT JSON format only.
    
    The JSON format must be exactly:
    {
      "reply": "Your conversational response.",
      "recommendations": [
        { "id": "cpu3", "reason": "Great mid-range CPU" }
      ]
    }`;

    const fullMessages = [
      { role: "system", content: systemPrompt },
      ...recentMessages
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: fullMessages,
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 800,
    });

    let aiText = completion.choices[0].message.content || '{}';
    let aiData;

    try {
      aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonStart = aiText.indexOf('{');
      const jsonEnd = aiText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        aiText = aiText.substring(jsonStart, jsonEnd + 1);
      }
      aiData = JSON.parse(aiText);
    } catch (parseError) {
      console.error('JSON Parse Failed, returning raw text.');
      aiData = { reply: aiText, recommendations: [] };
    }

    return NextResponse.json(aiData);

  } catch (error: any) {
    console.error('GROQ API FAILED:', error?.response?.data || error?.message || error);
    return NextResponse.json({ error: 'The AI service is currently busy or rate-limited. Please try again in a moment.' }, { status: 500 });
  }
}