export async function POST(req) {
  try {
    const { prompt, mode } = await req.json();

    if (!prompt || !mode)
      return Response.json({ error: "Missing prompt or mode" }, { status: 400 });

    // Use only available models on OpenRouter
    const MODEL_MAP = {
      chatbot: "meta-llama/llama-3.1-8b-instruct",
      analyzer: "meta-llama/llama-3.1-8b-instruct", // Changed from unavailable model
      lesson: "meta-llama/llama-3.1-8b-instruct",
      quiz: "meta-llama/llama-3.1-8b-instruct", // Changed from unavailable model
      study_plan: "meta-llama/llama-3.1-8b-instruct", // Use reliable model
    };

    const model = MODEL_MAP[mode] || "meta-llama/llama-3.1-8b-instruct";

    // Enhanced system prompt for study plans
    let systemPrompt = "You are an AI tutor assistant.";
   if (mode === 'study_plan') {
  systemPrompt = `You are an AI study planner. You MUST respond with ONLY valid JSON format.
  
  Required JSON structure:
  {
    "recommendation": "Study advice for the week",
    "focusAreas": ["area1", "area2", "area3"],
    "weeklySchedule": [
      {"day": "Mon", "tasks": ["task1", "task2"]},
      {"day": "Tue", "tasks": ["task1", "task2"]},
      {"day": "Wed", "tasks": ["task1"]},
      {"day": "Thu", "tasks": ["task1", "task2"]},
      {"day": "Fri", "tasks": ["review task"]},
      {"day": "Sat", "tasks": ["rest or light study"]},
      {"day": "Sun", "tasks": ["weekly review"]}
    ]
  }
  
  Important: Return tasks for ALL 7 days. Include variety - some learning, some practice, some review days.`;
}

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
        "X-Title": "AI Tutor App"
      },
      body: JSON.stringify({
        model,
        messages: [
          { 
            role: "system", 
            content: systemPrompt 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        max_tokens: 1024,
        temperature: mode === 'study_plan' ? 0.3 : 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenRouter Failure:", data);
      return Response.json({ 
        error: "AI service unavailable. Using fallback response.",
        details: data.error.message 
      }, { status: 500 });
    }

    const text = data.choices?.[0]?.message?.content || "No response from AI";

    return Response.json({ text });

  } catch (err) {
    console.error("AI Error:", err);
    return Response.json({ 
      error: "Server failure",
      details: err.message 
    }, { status: 500 });
  }
}