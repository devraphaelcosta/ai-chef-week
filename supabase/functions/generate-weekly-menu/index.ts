import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { preferences, dietGoal, budget, timeAvailable } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurado");
    }

    console.log("Gerando menu semanal com IA:", { preferences, dietGoal, budget, timeAvailable });

    const systemPrompt = `Você é um nutricionista especializado em planejamento alimentar semanal.
Crie menus completos, equilibrados e adaptados aos objetivos e restrições do usuário.
Considere variedade, praticidade e adequação nutricional.
Sempre inclua café da manhã, almoço, jantar e 2 lanches para cada dia.`;

    const userPrompt = `Crie um cardápio semanal completo (7 dias) considerando:
- Objetivo: ${dietGoal || 'manutenção'}
- Orçamento: ${budget || 'moderado'}
- Tempo disponível: ${timeAvailable || 'médio'}
- Preferências/Restrições: ${preferences || 'nenhuma restrição específica'}

Formato da resposta JSON:
{
  "weeklyMenu": [
    {
      "day": "Segunda-feira",
      "meals": {
        "breakfast": { "name": "Nome", "calories": 400, "time": "10 min" },
        "morning_snack": { "name": "Nome", "calories": 150, "time": "5 min" },
        "lunch": { "name": "Nome", "calories": 600, "time": "30 min" },
        "afternoon_snack": { "name": "Nome", "calories": 150, "time": "5 min" },
        "dinner": { "name": "Nome", "calories": 500, "time": "25 min" }
      },
      "total_calories": 1800,
      "macros": { "protein": "120g", "carbs": "200g", "fat": "60g" }
    }
  ],
  "shopping_list": {
    "fruits": ["item 1", "item 2"],
    "vegetables": ["item 1", "item 2"],
    "proteins": ["item 1", "item 2"],
    "grains": ["item 1", "item 2"],
    "dairy": ["item 1", "item 2"],
    "others": ["item 1", "item 2"]
  },
  "tips": ["dica 1", "dica 2", "dica 3"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro da API Lovable AI:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione fundos ao seu workspace Lovable AI." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`Erro da API: ${response.status}`);
    }

    const data = await response.json();
    const menuText = data.choices[0].message.content;
    
    console.log("Menu semanal gerado com sucesso");
    
    let menu;
    try {
      menu = JSON.parse(menuText);
    } catch (e) {
      console.error("Erro ao parsear JSON do menu:", e);
      const jsonMatch = menuText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        menu = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Formato de menu inválido");
      }
    }

    return new Response(
      JSON.stringify(menu),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Erro ao gerar menu semanal:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Erro desconhecido ao gerar menu" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
