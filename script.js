const form = document.getElementById("expense-form");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const expenseList = document.getElementById("expense-list");
const totalSpan = document.getElementById("total");

let total = 0;

// Fetch and display expenses
async function loadExpenses() {
  const res = await fetch("/api/expenses");
  const data = await res.json();
  expenseList.innerHTML = "";
  total = 0;

  data.forEach(exp => {
    total += exp.amount;
    const li = document.createElement("li");
    li.textContent = `${exp.title} - $${exp.amount} [${exp.category}]`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = async () => {
      await fetch(`/api/expenses/${exp._id}`, { method: "DELETE" });
      loadExpenses();
    };

    li.appendChild(delBtn);
    expenseList.appendChild(li);
  });

  totalSpan.textContent = total;
}

// Add new expense
form.addEventListener("submit", async e => {
  e.preventDefault();
  const expense = {
    title: titleInput.value,
    amount: parseFloat(amountInput.value),
    category: categoryInput.value
  };
  await fetch("/api/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense)
  });

  titleInput.value = "";
  amountInput.value = "";
  categoryInput.value = "";

  loadExpenses();
});

// Initial load
loadExpenses();
