// 🧠 MAIN ENTRY POINT
export function getAIResponse(userMessage) {
  const msg = userMessage.toLowerCase().trim();

  // ===== 🌫️ AQI AUTO DETECTION =====
  if (msg.includes("aqi") || msg.includes("air quality")) {
    return handleAQI();
  }

  // ===== 🥗 DIET INTENT =====
  if (hasAny(msg, ["diet", "meal plan", "what to eat", "food plan"])) {
    return `
🥗 I can help you with a proper diet.

❓ Please choose your age group:
• Teenager
• Adult
• Senior
`;
  }

  // ===== 🧑 AGE SELECTION =====
  if (msg === "teenager") return teenagerDiet();
  if (msg === "adult") return adultDiet();
  if (msg === "senior") return seniorDiet();

  // ===== 🩺 ISSUE DETECTION =====
  const issues = [];

  if (hasAny(msg, ["tired", "thakaan", "low energy", "fatigue"]))
    issues.push("low_energy");

  if (hasAny(msg, ["junk", "fast food", "burger", "pizza", "cola"]))
    issues.push("poor_diet");

  if (hasAny(msg, ["sleep", "late", "neend", "insomnia"]))
    issues.push("poor_sleep");

  if (hasAny(msg, ["stress", "anxious", "tension", "pareshan"]))
    issues.push("stress");

  if (issues.length === 0) return defaultReply();

  // ===== 🧩 BUILD RESPONSE =====
  let reply = "";
  reply += detectSummary(issues);
  reply += explainWhy(issues);
  reply += actionPlan(issues);
  reply += whyThisHelps(issues);
  reply += followUpQuestion(issues);

  return reply;
}

/* ================= HELPERS ================= */

function hasAny(text, keywords) {
  return keywords.some(k => text.includes(k));
}

function detectSummary(issues) {
  let line = "🔍 What I’m noticing:\n";
  if (issues.includes("low_energy")) line += "• Low energy levels\n";
  if (issues.includes("poor_diet")) line += "• Diet quality seems off\n";
  if (issues.includes("poor_sleep")) line += "• Sleep may be insufficient\n";
  if (issues.includes("stress")) line += "• Mental stress present\n";
  return line + "\n";
}

function explainWhy(issues) {
  let line = "🧠 Why this happens:\n";
  if (issues.includes("poor_diet"))
    line += "• Junk food spikes sugar → quick energy crash\n";
  if (issues.includes("poor_sleep"))
    line += "• Poor sleep reduces recovery\n";
  if (issues.includes("stress"))
    line += "• Stress hormones drain energy\n";
  return line + "\n";
}

function actionPlan(issues) {
  let line = "✅ What you can do today:\n";
  if (issues.includes("poor_diet"))
    line += "• Eat one proper home-cooked meal\n";
  if (issues.includes("poor_sleep"))
    line += "• Sleep 30 minutes earlier tonight\n";
  if (issues.includes("low_energy"))
    line += "• 10-minute light walk\n";
  if (issues.includes("stress"))
    line += "• 5 minutes slow breathing\n";
  return line + "\n";
}

function whyThisHelps(issues) {
  let line = "🧠 Why this helps:\n";

  if (issues.includes("poor_diet"))
    line += "• Balanced food stabilizes blood sugar\n";

  if (issues.includes("poor_sleep"))
    line += "• Proper sleep improves immunity & focus\n";

  if (issues.includes("stress"))
    line += "• Breathing lowers stress hormones\n";

  if (issues.includes("low_energy"))
    line += "• Light movement boosts circulation\n";

  return line + "\n";
}

function followUpQuestion(issues) {
  if (issues.includes("poor_sleep"))
    return "❓ Do you usually sleep after midnight?";
  if (issues.includes("poor_diet"))
    return "❓ Do you eat junk food more than 3 times a week?";
  return "❓ Want help with diet, sleep, or stress?";
}

function defaultReply() {
  return `
I hear you.

• Eat balanced meals
• Stay active
• Sleep well

❓ What would you like help with — diet, sleep, or stress?
`;
}

/* ================= 🌫️ AQI LOGIC ================= */

function getSimulatedAQI() {
  const r = Math.random();
  if (r < 0.33) return { level: "good", label: "Good (0–50)" };
  if (r < 0.66) return { level: "moderate", label: "Moderate (51–100)" };
  return { level: "poor", label: "Poor (101+)" };
}

function handleAQI() {
  const aqi = getSimulatedAQI();
  const ageGroup = "senior"; // hackathon-safe default

  let reply = `🌫️ Air Quality Update:\n• AQI: ${aqi.label}\n\n`;

  if (aqi.level === "good")
    reply += "✅ Air is safe. Outdoor activity is fine.\n";

  if (aqi.level === "moderate")
    reply += "⚠️ Avoid heavy outdoor exercise.\n";

  if (aqi.level === "poor")
    reply += "🚨 Avoid outdoor activity. Wear a mask.\n";

  reply += ageAQIWarning(ageGroup, aqi.level);
  reply += "\nℹ️ Preventive guidance only.";

  return reply;
}

function ageAQIWarning(ageGroup, level) {
  if (level !== "poor") return "";

  if (ageGroup === "teenager")
    return "\n⚠️ Teenagers: Avoid outdoor sports today.";

  if (ageGroup === "adult")
    return "\n⚠️ Adults: Prefer indoor workouts.";

  if (ageGroup === "senior")
    return "\n🚨 Seniors: Avoid going out. Steam inhalation helps.";

  return "";
}

/* ================= 🥗 DIET PLANS ================= */

function teenagerDiet() {
  return `
🥗 Teenager Diet Plan

Breakfast:
• Milk + fruits + poha/roti

Lunch:
• Dal, rice/roti, vegetables, curd

Evening:
• Fruits or nuts

Dinner:
• Light home food

🎯 Focus: Growth, energy, concentration
`;
}

function adultDiet() {
  return `
🥗 Adult Diet Plan

Breakfast:
• Eggs / sprouts / oats

Lunch:
• Roti, sabzi, dal, salad

Evening:
• Fruits / green tea

Dinner:
• Light protein-rich meal

🎯 Focus: Fitness & energy balance
`;
}

function seniorDiet() {
  return `
🥗 Senior Citizen Diet Plan

Breakfast:
• Soft foods, milk, fruits

Lunch:
• Easy-to-digest dal, rice, vegetables

Evening:
• Nuts / herbal tea

Dinner:
• Very light meal

🎯 Focus: Digestion, immunity, bones
`;
}




