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
    const { preferences, mealType, dietGoal } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurado");
    }

    console.log("Gerando receita com IA para:", { preferences, mealType, dietGoal });

    const systemPrompt = `Você é um nutricionista especializado em criar receitas personalizadas. 
Suas receitas devem ser práticas, saudáveis e adaptadas aos objetivos e restrições do usuário.
Sempre forneça informações nutricionais estimadas (calorias, proteínas, carboidratos, gorduras).
Seja conciso mas detalhado nas instruções.`;

    const userPrompt = `Crie uma receita ${mealType || 'saudável'} considerando:
- Objetivo: ${dietGoal || 'manutenção'}
- Preferências/Restrições: ${preferences || 'nenhuma restrição específica'}

Formato da resposta:
{
  "name": "Nome da Receita",
  "description": "Breve descrição apetitosa",
  "prepTime": "15 min",
  "servings": 2,
  "difficulty": "Fácil",
  "ingredients": ["ingrediente 1", "ingrediente 2", ...],
  "instructions": ["passo 1", "passo 2", ...],
  "nutrition": {
    "calories": 400,
    "protein": "30g",
    "carbs": "45g",
    "fat": "12g"
  },
  "tags": ["tag1", "tag2"]
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
    const recipeText = data.choices[0].message.content;
    
    console.log("Receita gerada com sucesso");
    
    let recipe;
    try {
      recipe = JSON.parse(recipeText);
    } catch (e) {
      console.error("Erro ao parsear JSON da receita:", e);
      // Tenta extrair JSON do texto se possível
      const jsonMatch = recipeText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recipe = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Formato de receita inválido");
      }
    }

    return new Response(
      JSON.stringify({ recipe }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Erro ao gerar receita:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Erro desconhecido ao gerar receita" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
