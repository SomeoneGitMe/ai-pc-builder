import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import inventoryData from '@/data/inventory.json';
import { getDynamicModel } from '@/lib/ai-router';

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

    const systemPrompt = `You are 'Apex', an elite PC building architect. 
    Your job is to help the user build a custom PC based on their needs and budget.
    
    Here is the current inventory available in the store:
    ${JSON.stringify(inventoryData)}
    
    Modes:
    1. PRESET MODE: If the user mentions a rig name AND a budget, IMMEDIATELY recommend a COMPLETE 7-part build that fits the budget. 
    2. CUSTOM MODE: Guide them ONE STEP AT A TIME.
    3. CONVERSATION MODE: Answer general questions directly.
    
    Rules:
    1. Ensure 100% compatibility (AMD CPU needs AMD Motherboard, etc.).
    2. Only recommend parts that exist in the inventory.
    3. You MUST respond in STRICT JSON format only.
    4. Keep the "reply" field very brief (1-2 sentences max). Put all item details in the recommendations array.
    5. CRITICAL: You must output the entire JSON object. Do not stop generating until the final closing bracket } is written.
    
    The JSON format must be exactly:
    {
      "reply": "Brief conversational response.",
      "recommendations": [
        { "id": "cpu3", "reason": "Great mid-range CPU" }
      ]
    }`;

    const fullMessages = [
      { role: "system", content: systemPrompt },
      ...recentMessages
    ];

    const modelId = await getDynamicModel();

    let completion;

    try {
      completion = await groq.chat.completions.create({
        model: modelId,
        messages: fullMessages,
        temperature: 0.2,
        max_tokens: 1500,
      });
    } catch (apiError: any) {
      console.error(`Primary model ${modelId} failed:`, apiError?.error?.message || apiError?.message);
      console.log('Falling back to openai/gpt-oss-20b to bypass rate limits...');
      
      completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b", // Changed fallback to the 20b model you have access to
        messages: fullMessages,
        temperature: 0.2,
        max_tokens: 1500,
      });
    }

    let aiText = completion.choices[0].message.content || '{}';
    let aiData;

    try {
      aiText = aiText.replace(/```json/g, '').replace(/```/g, '').replace(/<[^>]*>?/gm, '').trim();
      
      // Fix for truncated JSON: If the text doesn't end with '}', try to salvage it
      if (!aiText.endsWith('}')) {
        const jsonStart = aiText.indexOf('{');
        if (jsonStart !== -1) {
          let lastComma = aiText.lastIndexOf('},');
          if (lastComma !== -1) {
            aiText = aiText.substring(0, lastComma + 1) + ']}';
          } else {
            aiText = aiText.substring(jsonStart) + ']}'; 
          }
        }
      } else {
        const jsonStart = aiText.indexOf('{');
        const jsonEnd = aiText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          aiText = aiText.substring(jsonStart, jsonEnd + 1);
        }
      }
      
      aiData = JSON.parse(aiText);
    } catch (parseError) {
      console.error('[JSON PARSE FAILED] Raw AI Text:\n', aiText);
      aiData = { reply: "I apologize, I had an issue formatting the build data. Please try asking again.", recommendations: [] };
    }

    // SANITIZE RECOMMENDATIONS
    if (aiData.recommendations && Array.isArray(aiData.recommendations)) {
      const validIds = inventoryData.map((item: any) => item.id);
      aiData.recommendations = aiData.recommendations.filter((rec: any) => validIds.includes(rec.id));
    }

    return NextResponse.json(aiData);

  } catch (error: any) {
    console.error('GROQ API FAILED:', error?.response?.data || error?.message || error);
    return NextResponse.json({ error: 'The AI service is currently busy or rate-limited. Please try again in a moment.' }, { status: 500 });
  }
}