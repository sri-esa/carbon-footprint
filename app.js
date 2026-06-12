import {
  CATEGORY_LABELS,
  DEFAULT_INPUTS,
  buildRecommendations,
  calculateFootprint,
  estimateReductionGap
} from "./carbon.js";

const STORAGE_KEY = "carbonwise.inputs.v1";

const form = document.querySelector("#footprintForm");
const resetButton = document.querySelector("#resetButton");
const renewableInput = document.querySelector("#renewablePercent");
const renewableOutput = document.querySelector("#renewableOutput");
const heroTotal = document.querySelector("#heroTotal");
const monthlyTotal = document.querySelector("#monthlyTotal");
const yearlyTotal = document.querySelector("#yearlyTotal");
const topCategory = document.querySelector("#topCategory");
const topCategoryDetail = document.querySelector("#topCategoryDetail");
const barChart = document.querySelector("#barChart");
const goalProgress = document.querySelector("#goalProgress");
const goalText = document.querySelector("#goalText");
const actionList = document.querySelector("#actionList");

const formatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 1
});

initialize();

function initialize() {
  fillForm(loadInputs());
  render(calculateFootprint(readForm()));

  form.addEventListener("input", () => {
    renewableOutput.value = `${renewableInput.value}%`;
    update();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    update();
  });

  resetButton.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    fillForm(DEFAULT_INPUTS);
    render(calculateFootprint(DEFAULT_INPUTS));
  });
}

function update() {
  const result = calculateFootprint(readForm());
  saveInputs(result.inputs);
  render(result);
}

function fillForm(inputs) {
  for (const [key, value] of Object.entries(inputs)) {
    const field = form.elements.namedItem(key);
    if (field) {
      field.value = value;
    }
  }
  renewableOutput.value = `${form.elements.renewablePercent.value}%`;
}

function readForm() {
  return Object.fromEntries(new FormData(form).entries());
}

function loadInputs() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return stored && typeof stored === "object" ? stored : DEFAULT_INPUTS;
  } catch {
    return DEFAULT_INPUTS;
  }
}

function saveInputs(inputs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
}

function render(result) {
  const yearlyText = `${result.yearlyTotalTonnes.toFixed(2)} t`;
  heroTotal.textContent = yearlyText;
  monthlyTotal.textContent = `${formatter.format(result.monthlyTotal)} kg`;
  yearlyTotal.textContent = yearlyText;
  topCategory.textContent = CATEGORY_LABELS[result.topCategory];
  topCategoryDetail.textContent = `${formatter.format(result.categories[result.topCategory])} kg CO2e per month`;

  renderBars(result);
  renderGoal(result);
  renderActions(result);
}

function renderBars(result) {
  const maxValue = Math.max(...Object.values(result.categories), 1);
  barChart.replaceChildren(
    ...result.sortedCategories.map(([category, kg]) => {
      const row = document.createElement("div");
      row.className = "bar-row";

      const label = document.createElement("span");
      label.textContent = CATEGORY_LABELS[category];

      const track = document.createElement("div");
      track.className = "bar-track";

      const fill = document.createElement("div");
      fill.className = `bar-fill ${category}`;
      fill.style.width = `${Math.max((kg / maxValue) * 100, 2)}%`;

      const value = document.createElement("strong");
      value.textContent = `${formatter.format(kg)} kg`;

      track.append(fill);
      row.append(label, track, value);
      return row;
    })
  );
}

function renderGoal(result) {
  const gap = estimateReductionGap(result.yearlyTotalTonnes);
  goalProgress.style.width = `${gap.progress}%`;

  if (gap.isWithinTarget) {
    goalText.textContent = `You are within the ${gap.targetTonnes} t yearly target. Keep tracking and protect the habits that work.`;
    return;
  }

  goalText.textContent = `To reach ${gap.targetTonnes} t per year, reduce about ${gap.gap.toFixed(2)} t CO2e annually. Start with ${CATEGORY_LABELS[result.topCategory].toLowerCase()}.`;
}

function renderActions(result) {
  const cards = buildRecommendations(result).map((item) => {
    const article = document.createElement("article");
    article.className = "action-card";

    const category = document.createElement("span");
    category.className = "action-category";
    category.textContent = CATEGORY_LABELS[item.category];

    const title = document.createElement("h3");
    title.textContent = item.title;

    const body = document.createElement("p");
    body.textContent = item.body;

    const impact = document.createElement("small");
    impact.textContent = `${item.impact} (${formatter.format(item.kg)} kg/month now)`;

    article.append(category, title, body, impact);
    return article;
  });

  actionList.replaceChildren(...cards);
}
