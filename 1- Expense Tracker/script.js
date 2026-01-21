const table = document.getElementById("expense-table");
const cards = document.getElementById("summary-cards");
const modal = document.getElementById("expenseModal");

const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModalBtn");
const addBtn = document.getElementById("addExpenseBtn");

const nameEl = document.getElementById("name");
const amountEl = document.getElementById("amount");
const dateEl = document.getElementById("date");
const categoryEl = document.getElementById("category");

/* ================== CATEGORIES ================== */
const CATEGORIES = [
  "Housing",
  "Food & Drink",
  "Transport",
  "Education",
  "Stationery",
  "Medical",
  "Utilities",
  "Shopping",
  "Entertainment",
  "Subscriptions",
  "Travel",
  "Miscellaneous"
];

/* ================== STATE ================== */
let chart;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

/* ================== INR FORMATTER ================== */
function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

/* ================== LOAD CATEGORIES ================== */
function loadCategories() {
  categoryEl.innerHTML = `<option value="">Select category</option>`;

  CATEGORIES.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryEl.appendChild(option);
  });
}

/* ================== MODAL ================== */
openBtn.onclick = () => modal.classList.remove("hidden");
closeBtn.onclick = () => modal.classList.add("hidden");

/* ================== ADD EXPENSE ================== */
addBtn.onclick = () => {
  const name = nameEl.value.trim();
  const amount = Number(amountEl.value);
  const date = dateEl.value;
  const category = categoryEl.value;

  if (!name || !amount || !date || !category) return;

  expenses.push({
    id: Date.now(),
    name,
    amount,
    category,
    date
  });

  localStorage.setItem("expenses", JSON.stringify(expenses));
  modal.classList.add("hidden");
  clearForm();
  render();
};

function clearForm() {
  nameEl.value = "";
  amountEl.value = "";
  dateEl.value = "";
  categoryEl.value = "";
}

/* ================== DELETE ================== */
function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  render();
}

/* ================== TABLE ================== */
function renderTable() {
  table.innerHTML = "";

  expenses.forEach(e => {
    table.innerHTML += `
      <tr>
        <td>${e.name}</td>
        <td>${formatINR(e.amount)}</td>
        <td>${e.category}</td>
        <td>${new Date(e.date).toDateString()}</td>
        <td>
          <span class="delete-btn" onclick="deleteExpense(${e.id})">✕</span>
        </td>
      </tr>
    `;
  });
}

/* ================== SUMMARY + CHART ================== */
function renderSummary() {
  const totals = {};

  expenses.forEach(e => {
    totals[e.category] = (totals[e.category] || 0) + e.amount;
  });

  cards.innerHTML = "";

  Object.keys(totals).forEach(cat => {
    cards.innerHTML += `
      <div class="card">
        <h4>${cat}</h4>
        <p>${formatINR(totals[cat])}</p>
      </div>
    `;
  });

  renderChart(totals);
}

function renderChart(data) {
  const ctx = document.getElementById("expenseChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: "Expenses (₹)",
        data: Object.values(data),
        backgroundColor: "#6a5acd"
      }]
    }
  });
}

/* ================== RENDER ================== */
function render() {
  renderTable();
  renderSummary();
}

/* ================== INIT ================== */
loadCategories();
render();
