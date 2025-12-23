// 🧠 MAIN ENTRY POINT
export function getAIResponse(userMessage, context = {}) {
  const msg = userMessage.toLowerCase().trim();

  /* ================== HANDLE PENDING INPUT ================== */

  // YES / NO follow-ups
  if (context.waitingFor === "YES_NO_SLEEP") {
    if (isYes(msg)) return sleepYes(context);
    if (isNo(msg)) return sleepNo(context);
    return "❓ Please reply with Yes or No.";
  }

  if (context.waitingFor === "YES_NO_DIET") {
    if (isYes(msg)) return junkYes(context);
    if (isNo(msg)) return junkNo(context);
    return "❓ Please reply with Yes or No.";
  }

  if (context.waitingFor === "YES_NO_LUNG_FOOD") {
    if (isYes(msg)) return lungFoodYes(context);
    if (isNo(msg)) {
      context.waitingFor = null;
      return "👍 Okay. Let me know if you want help with diet, sleep, or stress.";
    }
    return "❓ Please reply with Yes or No.";
  }

  // AGE selection
  if (context.waitingFor === "AGE_SELECT") {
    context.waitingFor = null;
    if (isTeen(msg)) return teenagerDiet();
    if (isAdult(msg)) return adultDiet();
    if (isSenior(msg)) return seniorDiet();
    return "❓ Type Teenager, Adult, or Senior.";
  }

  /* ================== INTENT DETECTION ================== */

  // 🌫️ AQI / AIR
  if (hasAny(msg, [
    "aqi", "air", "air quality", "pollution",
    "smog", "breathing", "lungs", "polluted"
  ])) {
    context.waitingFor = "YES_NO_LUNG_FOOD";
    return handleAQIFallback();
  }

  // 🥗 DIET
  if (hasAny(msg, [
    "diet", "food", "meal", "what to eat",
    "nutrition", "khana", "meal plan"
  ])) {
    context.waitingFor = "AGE_SELECT";
    return `
🥗 I can help you with a simple, practical diet.

❓ Select your age group:
Teenager / Adult / Senior
`;
  }

  /* ================== ISSUE DETECTION ================== */

  const issues = [];

  if (hasAny(msg, ["tired", "thakaan", "low energy", "fatigue", "exhausted"]))
    issues.push("low_energy");

  if (hasAny(msg, ["junk", "fast food", "pizza", "burger", "cola", "chips"]))
    issues.push("poor_diet");

  if (hasAny(msg, ["sleep", "late night", "neend", "insomnia", "midnight"]))
    issues.push("poor_sleep");

  if (hasAny(msg, ["stress", "tension", "anxious", "overthinking", "pareshan"]))
    issues.push("stress");

  if (issues.length === 0) return defaultReply();

  /* ================== BUILD RESPONSE ================== */

  let reply = "";
  reply += detectSummary(issues);
  reply += explainWhy(issues);
  reply += actionPlan(issues);
  reply += whyThisHelps(issues);

  if (issues.includes("poor_sleep")) {
    context.waitingFor = "YES_NO_SLEEP";
    reply += "❓ Do you usually sleep after midnight? (Yes / No)";
  } else if (issues.includes("poor_diet")) {
    context.waitingFor = "YES_NO_DIET";
    reply += "❓ Do you eat junk food more than 3 times a week? (Yes / No)";
  } else {
    reply += "❓ What do you want help with next — diet, sleep, or stress?";
  }

  return reply;
}

/* ================= HELPERS ================= */

function hasAny(text, keywords) {
  return keywords.some(k => text.includes(k));
}

function isYes(msg) {
  return ["yes", "y", "haan", "ha"].includes(msg);
}

function isNo(msg) {
  return ["no", "n", "nahi"].includes(msg);
}

function isTeen(msg) {
  return ["teen", "teenager", "student"].includes(msg);
}

function isAdult(msg) {
  return ["adult", "working", "job"].includes(msg);
}

function isSenior(msg) {
  return ["senior", "old", "elder"].includes(msg);
}

/* ================= CORE RESPONSE BUILDERS ================= */

function detectSummary(issues) {
  let line = "🔍 What I’m noticing:\n";
  if (issues.includes("low_energy")) line += "• Low energy levels\n";
  if (issues.includes("poor_diet")) line += "• Unhealthy food habits\n";
  if (issues.includes("poor_sleep")) line += "• Poor sleep routine\n";
  if (issues.includes("stress")) line += "• Mental stress\n";
  return line + "\n";
}

function explainWhy(issues) {
  let line = "🧠 Why this happens:\n";
  if (issues.includes("poor_diet"))
    line += "• Junk food causes quick energy crash\n";
  if (issues.includes("poor_sleep"))
    line += "• Less sleep reduces recovery & focus\n";
  if (issues.includes("stress"))
    line += "• Stress hormones drain your energy\n";
  return line + "\n";
}

function actionPlan(issues) {
  let line = "✅ What you can do today:\n";
  if (issues.includes("poor_diet"))
    line += "• Eat one proper home-cooked meal\n";
  if (issues.includes("poor_sleep"))
    line += "• Sleep 30 minutes earlier tonight\n";
  if (issues.includes("low_energy"))
    line += "• 10–15 min light walk\n";
  if (issues.includes("stress"))
    line += "• 5 minutes slow breathing\n";
  return line + "\n";
}

function whyThisHelps(issues) {
  let line = "🧠 Why this helps:\n";
  if (issues.includes("poor_diet"))
    line += "• Stable blood sugar = stable energy\n";
  if (issues.includes("poor_sleep"))
    line += "• Better sleep improves immunity & mood\n";
  if (issues.includes("stress"))
    line += "• Breathing calms the nervous system\n";
  if (issues.includes("low_energy"))
    line += "• Movement boosts circulation\n";
  return line + "\n";
}

function defaultReply() {
  return `
I’m here to help.

I can guide you with:
• Diet
• Sleep
• Stress
• Air quality effects

❓ What do you want to talk about?
`;
}

/* ================= AQI FALLBACK ================= */

function handleAQIFallback() {
  return `
🌫️ Air Quality Insight (General)

In many Indian cities, air quality usually stays in the MODERATE to POOR range.

⚠️ Possible effects:
• Eye & throat irritation
• Breathing discomfort
• Low energy

🛡️ What you can do today:
• Avoid outdoor exercise
• Drink warm water
• Wear a mask if going out

❓ Do you want food tips to protect your lungs? (Yes / No)
`;
}

/* ================= FOLLOW-UP RESPONSES ================= */

function sleepYes(context) {
  context.waitingFor = null;
  return `
😴 Sleeping late affects recovery and focus.

✅ Try tonight:
• Sleep 30 minutes earlier
• Avoid phone 1 hour before bed

❓ Want help with diet or stress next?
`;
}

function sleepNo(context) {
  context.waitingFor = null;
  return `
👍 Good sleep timing helps a lot.

❓ Do you want help with diet or stress?
`;
}

function junkYes(context) {
  context.waitingFor = null;
  return `
🍔 Frequent junk food causes energy crashes.

✅ Small fix:
• Replace one junk meal with home food
• Add fruits or curd daily

❓ Want help with sleep or stress?
`;
}

function junkNo(context) {
  context.waitingFor = null;
  return `
👍 That’s good.

❓ Want help with sleep or stress?
`;
}

function lungFoodYes(context) {
  context.waitingFor = null;
  return `
🥗 Foods good for lungs:
• Turmeric milk
• Warm soups
• Fruits like orange & apple

❓ Want a full diet plan? Type Diet
`;
}

/* ================= DIET PLANS ================= */

function teenagerDiet() {
  return `
🥗 Teenager Diet Plan

• Milk, fruits, poha/roti
• Dal, rice/roti, vegetables
• Fruits or nuts in evening
• Light dinner

🎯 Focus: Growth, energy, focus
`;
}

function adultDiet() {
  return `
🥗 Adult Diet Plan

• Eggs/sprouts/oats
• Roti, sabzi, dal, salad
• Fruits or green tea
• Light protein dinner

🎯 Focus: Fitness & energy
`;
}

function seniorDiet() {
  return `
🥗 Senior Citizen Diet Plan

• Soft breakfast, fruits
• Easy-to-digest lunch
• Nuts / herbal tea
• Very light dinner

🎯 Focus: Digestion & immunity
`;
}





