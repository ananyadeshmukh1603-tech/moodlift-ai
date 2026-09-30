const quoteBank = {
  Happy: [
    {quote:"Let your joy be the energy that carries you forward.", support:"You don't have to wait for a special occasion to appreciate how far you've come.", action:"Write down one thing that made you smile today."},
    {quote:"Some days are proof that the little things are the big things.", support:"Notice what is going well and let yourself enjoy it without rushing to the next thing.", action:"Share a kind word or a happy moment with someone."},
    {quote:"Carry the light you found today into whatever comes next.", support:"Good moments can remind you of the strength and warmth you already have.", action:"Capture one good memory from today in a sentence."}
  ],
  Sad: [
    {quote:"Even the longest night gives way to morning.", support:"You are allowed to have difficult days. You don't have to solve everything at once.", action:"Take a quiet break and do one small thing that comforts you."},
    {quote:"You can be a work in progress and still deserve gentleness.", support:"A hard moment is part of your story, not the whole story.", action:"Drink some water, breathe slowly, and give yourself a little space."},
    {quote:"You don't need to bloom every day to be growing.", support:"Rest and slower days can be part of moving forward, too.", action:"Choose one gentle thing you can do for yourself today."}
  ],
  Stressed: [
    {quote:"You can move forward without figuring everything out today.", support:"One task at a time is enough. You don't need to carry the whole week in one moment.", action:"Take three slow breaths and choose just one next task."},
    {quote:"A mountain is climbed one step, not all at once.", support:"You can make progress by focusing on the next manageable thing instead of the entire list.", action:"Write down your top priority and work on it for five minutes."},
    {quote:"Pause. You are a person, not a productivity machine.", support:"Your worth is not measured by how much you finish in a single day.", action:"Step away from your screen for two minutes and stretch."}
  ],
  Anxious: [
    {quote:"You don't have to know the whole path to take the next step.", support:"Bring your attention back to what you can do right now, rather than every possible outcome.", action:"Name one thing you can control in the next ten minutes."},
    {quote:"Let the next moment be smaller than the whole future.", support:"You can meet things one moment at a time; you don't need every answer immediately.", action:"Notice five things you can see around you, then take one slow breath."},
    {quote:"Courage can be quiet: sometimes it is simply beginning.", support:"Feeling uncertain does not mean you are incapable of taking a thoughtful next step.", action:"Choose one small, practical step and do only that for now."}
  ],
  Unmotivated: [
    {quote:"Small steps still take you somewhere meaningful.", support:"You don't need to feel completely ready before you begin. Let a tiny start be enough.", action:"Work on one task for five minutes."},
    {quote:"Momentum often arrives after the beginning, not before it.", support:"Make the first step so small that you can do it without waiting for perfect motivation.", action:"Open the document, write one line, or tidy one small area."},
    {quote:"Progress counts even when nobody sees the first step.", support:"You can build consistency through small actions, not only big bursts of energy.", action:"Set a ten-minute timer and start with the easiest part."}
  ],
  Confident: [
    {quote:"Trust your preparation, then give yourself permission to begin.", support:"Use your confidence to take action, stay curious, and keep learning.", action:"Take one step towards a goal you've been postponing."},
    {quote:"Let your ambition be matched by the courage to start.", support:"You do not need to be perfect to make a meaningful attempt.", action:"Choose one clear outcome and decide the first action."},
    {quote:"Confidence grows stronger when you put it into practice.", support:"Give your ideas a chance in the real world, and learn from what happens next.", action:"Share, build, or try one thing you've been preparing for."}
  ]
};

const moodPrompts = {
  Happy: "celebrate joy while staying grounded",
  Sad: "offer gentle comfort without minimizing feelings",
  Stressed: "encourage prioritization and manageable steps",
  Anxious: "focus on the present and what is controllable",
  Unmotivated: "encourage a tiny achievable start",
  Confident: "channel confidence into thoughtful action"
};
let selectedMood = "Stressed";
let currentQuote = quoteBank.Stressed[0];
let lastIndex = -1;
let saved = JSON.parse(localStorage.getItem("moodliftSavedQuotes") || "[]");

const $ = (id) => document.getElementById(id);
const moodCards = [...document.querySelectorAll(".mood-card")];

moodCards.forEach(card => card.addEventListener("click", () => {
  selectedMood = card.dataset.mood;
  moodCards.forEach(c => {
    const active = c.dataset.mood === selectedMood;
    c.classList.toggle("selected", active);
    c.setAttribute("aria-pressed", String(active));
  });
  showToast(`Mood set to ${selectedMood.toLowerCase()}`);
}));

$("contextInput").addEventListener("input", e => $("charCount").textContent = `${e.target.value.length} / 400`);
$("generateBtn").addEventListener("click", generateQuote);
$("newQuoteBtn").addEventListener("click", generateQuote);
$("favoriteBtn").addEventListener("click", toggleFavorite);
$("copyBtn").addEventListener("click", copyQuote);

function generateQuote() {
  const options = quoteBank[selectedMood];
  let idx = Math.floor(Math.random() * options.length);
  if (options.length > 1 && idx === lastIndex) idx = (idx + 1) % options.length;
  lastIndex = idx;
  currentQuote = options[idx];
  const context = $("contextInput").value.trim();
  $("quoteText").textContent = currentQuote.quote;
  $("supportText").textContent = personalizeSupport(selectedMood, context, currentQuote.support);
  $("actionText").textContent = currentQuote.action;
  $("moodCaption").textContent = `Made for your ${selectedMood.toLowerCase()} moment`;
  $("favoriteBtn").classList.remove("saved");
  $("favoriteBtn").textContent = "♡";
  $("resultCard").style.animation = "none";
  requestAnimationFrame(() => $("resultCard").style.animation = "");
  showToast("A fresh reminder, just for you ✦");
}

function personalizeSupport(mood, context, defaultText) {
  if (!context) return defaultText;
  const shortContext = context.length > 110 ? context.slice(0, 107) + "..." : context;
  const intros = {
    Happy: "Whatever is bringing you joy, give yourself permission to appreciate it.",
    Sad: "It sounds like this moment matters to you. Be gentle with yourself as you work through it.",
    Stressed: "You have a lot on your mind. You don't have to handle every part of it at once.",
    Anxious: "When the future feels big, returning to the present can help make the next step clearer.",
    Unmotivated: "You don't need to solve the whole situation before you begin with one small step.",
    Confident: "You have something to work with here; turn that energy into one thoughtful next move."
  };
  return `${intros[mood]} ${defaultText}`;
}

function toggleFavorite() {
  const exists = saved.some(item => item.quote === currentQuote.quote);
  if (exists) {
    saved = saved.filter(item => item.quote !== currentQuote.quote);
    $("favoriteBtn").classList.remove("saved");
    $("favoriteBtn").textContent = "♡";
    showToast("Removed from saved reminders");
  } else {
    saved.unshift({quote: currentQuote.quote, mood: selectedMood, action: currentQuote.action});
    saved = saved.slice(0, 20);
    $("favoriteBtn").classList.add("saved");
    $("favoriteBtn").textContent = "♥";
    showToast("Saved to your reminders");
  }
  localStorage.setItem("moodliftSavedQuotes", JSON.stringify(saved));
  renderSaved();
}

async function copyQuote() {
  const text = `“${currentQuote.quote}”\n\n${$("supportText").textContent}\n\nA tiny action: ${currentQuote.action}\n— MoodLift AI`;
  try {
    await navigator.clipboard.writeText(text);
    showToast("Quote copied to clipboard");
  } catch {
    const area = document.createElement("textarea");
    area.value = text; document.body.appendChild(area); area.select();
    document.execCommand("copy"); area.remove();
    showToast("Quote copied");
  }
}

function renderSaved() {
  $("savedCount").textContent = saved.length;
  if (!saved.length) {
    $("savedList").innerHTML = '<p class="empty-saved">Your favourite quotes will appear here.</p>';
    return;
  }
  $("savedList").innerHTML = "";
  saved.forEach((item, index) => {
    const row = document.createElement("div"); row.className = "saved-item";
    const quote = document.createElement("p"); quote.textContent = `“${item.quote}”`;
    const mood = document.createElement("span"); mood.textContent = item.mood; mood.className = "soft-note";
    const remove = document.createElement("button"); remove.textContent = "Remove"; remove.setAttribute("aria-label", "Remove saved quote");
    remove.addEventListener("click", () => {
      saved.splice(index, 1); localStorage.setItem("moodliftSavedQuotes", JSON.stringify(saved)); renderSaved();
      showToast("Reminder removed");
    });
    row.append(quote, mood, remove); $("savedList").appendChild(row);
  });
}

let toastTimer;
function showToast(message) {
  const toast = $("toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
renderSaved();
