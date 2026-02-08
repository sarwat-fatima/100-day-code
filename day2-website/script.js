/* ===== DATA ===== */
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

/* ===== SAVE TO LOCALSTORAGE ===== */
function save(){
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

/* ===== ADD EXPENSE ===== */
function addExpense(){
    const descEl = document.getElementById("desc");
    const amountEl = document.getElementById("amount");
    const dateEl = document.getElementById("date");

    const desc = descEl.value.trim();
    const amount = amountEl.value;
    const date = dateEl.value;

    if(!desc || !amount || !date) return alert("Fill all fields");

    expenses.push({
        id: Date.now(),
        desc,
        amount: parseFloat(amount),
        date
    });

    save();
    render(expenses);

    descEl.value = "";
    amountEl.value = "";
    dateEl.value = "";
}

/* ===== DELETE ===== */
function deleteExpense(id){
    expenses = expenses.filter(e => e.id !== id);
    save();
    render(expenses);
}

/* ===== CLEAR ALL ===== */
function clearAll(){
    if(confirm("Delete all expenses?")){
        expenses = [];
        save();
        render(expenses);
    }
}

/* ===== FILTER ===== */
function filterByDate(){
    const d = document.getElementById("filterDate").value;
    const filtered = expenses.filter(e => e.date === d);
    render(filtered);
}

function showAll(){
    render(expenses);
}

/* ===== RENDER LIST ===== */
function render(data){
    const list = document.getElementById("list");
    list.innerHTML = "";

    let total = 0;

    data.forEach(e => {
        total += e.amount;

        const div = document.createElement("div");
        div.className = "item";

        div.innerHTML = `
            <span>${e.desc} | $${e.amount} | ${e.date}</span>
            <button class="delete" onclick="deleteExpense(${e.id})">Delete</button>
        `;

        list.appendChild(div);
    });

    document.getElementById("total").innerText = total.toFixed(2);

    drawChart(data);
}

/* ===== SIMPLE BAR CHART ===== */
function drawChart(data){
    const canvas = document.getElementById("chart");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(data.length === 0) return;

    const padding = { top: 20, right: 10, bottom: 25, left: 40 };
    const chartW = canvas.width - padding.left - padding.right;
    const chartH = canvas.height - padding.top - padding.bottom;

    // Axes
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, canvas.height - padding.bottom);
    ctx.lineTo(canvas.width - padding.right, canvas.height - padding.bottom);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#bbb";
    ctx.font = "12px Segoe UI, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Amount ($)", 4, 14);
    ctx.textAlign = "center";
    ctx.fillText("Items", canvas.width / 2, canvas.height - 5);

    const max = Math.max(...data.map(e => e.amount));
    const barWidth = chartW / data.length;

    data.forEach((e, i) => {
        const height = (e.amount / max) * (chartH - 4);
        const x = padding.left + i * barWidth;
        const y = canvas.height - padding.bottom - height;

        ctx.fillStyle = "#aaa";
        ctx.fillRect(x + 4, y, Math.max(4, barWidth - 8), height);

        // Intentionally omit per-bar x-axis labels to reduce clutter.
    });
}

/* ===== INITIAL LOAD ===== */
render(expenses);
