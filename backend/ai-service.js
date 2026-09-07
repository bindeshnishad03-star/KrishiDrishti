const axios = require('axios');

const DISCLAIMER = "\n\nDisclaimer: This guidance is general agricultural information provided by Krishi AI. Please consult local agronomists or your district Krishi Vigyan Kendra (KVK) for critical field decisions.";

const LOCAL_KNOWLEDGE = [
  {
    keywords: ['fertilizer', 'wheat', 'dap', 'urea'],
    response: "For Wheat crops in North India, recommended basal application per acre is 50kg DAP, 25kg MOP, and 10kg Zinc Sulphate 21% at sowing. Apply 45kg Urea with the first irrigation (CRI stage around 21 days after sowing)."
  },
  {
    keywords: ['yellow', 'leaf', 'leaves', 'chlorosis'],
    response: "Yellowing leaves can indicate: 1) Nitrogen deficiency (pale yellow starting from lower older leaves), 2) Waterlogging/poor drainage, or 3) Early fungal disease / yellow rust. Ensure field drainage and check leaf undersides for fungal rust spots or aphid pests."
  },
  {
    keywords: ['irrigate', 'watering', 'irrigation'],
    response: "Irrigation schedules depend on growth stage: For wheat, critical stages are CRI stage (21 days), Tillering (40 days), Jointing (60 days), and Flowering (80 days). Avoid flood irrigation right before expected heavy rains."
  },
  {
    keywords: ['rice', 'paddy', 'pest', 'stem borer', 'hopper'],
    response: "Common rice pests include Yellow Stem Borer and Brown Planthopper (BPH). Monitor for dead hearts in tillers. For BPH, maintain water level drainage and avoid excess nitrogen. Spray Neem-based formulations or Chlorantraniliprole as advised by local extension officers."
  },
  {
    keywords: ['soil', 'ph', 'organic', 'compost'],
    response: "To improve soil health: 1) Add 4-5 tonnes of well-rotted Farm Yard Manure (FYM) or vermicompost per acre, 2) Practice green manuring with Dhaincha (Sesbania) before Kharif season, 3) Test soil pH and organic carbon content biannually."
  }
];

async function generateAgriResponse(message, context = {}) {
  const apiKey = process.env.AI_API_KEY;
  const apiUrl = process.env.AI_API_URL;
  const model = process.env.AI_MODEL || 'gpt-3.5-turbo';

  if (apiKey && apiUrl) {
    try {
      const res = await axios.post(apiUrl, {
        model: model,
        messages: [
          { role: 'system', content: 'You are Krishi AI, an expert agricultural consultant assisting Indian farmers with crop management, soil health, weather advice, and disease management in simple clear language.' },
          { role: 'user', content: `Context: ${JSON.stringify(context)}. User query: ${message}` }
        ]
      }, {
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        timeout: 10000
      });

      const reply = res.data.choices[0].message.content;
      return reply + DISCLAIMER;
    } catch (err) {
      console.warn('[AI Service] API call failed or timed out. Falling back to local knowledge engine.');
    }
  }

  // Local Knowledge Fallback Engine
  const lower = message.toLowerCase();
  for (const item of LOCAL_KNOWLEDGE) {
    if (item.keywords.some(kw => lower.includes(kw))) {
      return item.response + DISCLAIMER;
    }
  }

  return `Thank you for asking Krishi AI regarding "${message}". For optimal yield, ensure balanced crop fertilization (NPK + micro-nutrients), regular field scouting for early pest signs, and maintain proper field moisture.` + DISCLAIMER;
}

module.exports = {
  generateAgriResponse
};
