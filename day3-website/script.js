let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
const transactionList = document.getElementById('transactionList');
const balanceEl = document.getElementById('balance');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');

const description = document.getElementById('description');
const amount = document.getElementById('amount');
const type = document.getElementById('type');
const date = document.getElementById('date');
const category = document.getElementById('category');
const addBtn = document.getElementById('addBtn');

const filterType = document.getElementById('filterType');
const filterDate = document.getElementById('filterDate');
const clearFilters = document.getElementById('clearFilters');

let balanceChart;

// Tab switching
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(tc => tc.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
    renderChart();
  });
});

// Add transaction
addBtn.addEventListener('click', () => {
    if(description.value === '' || amount.value === '' || isNaN(amount.value) || !date.value) {
        alert('Please fill all fields correctly!');
        return;
    }

    const transaction = {
        id: Date.now(),
        description: description.value,
        amount: parseFloat(amount.value),
        type: type.value,
        date: date.value,
        category: category.value
    };

    transactions.push(transaction);
    saveAndRender();
    clearForm();
});

// Save & render
function saveAndRender() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
    updateSummary();
    renderChart();
}

// Render transaction list
function renderTransactions() {
    transactionList.innerHTML = '';

    let filtered = transactions;

    if(filterType.value !== 'all') filtered = filtered.filter(t => t.type === filterType.value);
    if(filterDate.value) filtered = filtered.filter(t => t.date === filterDate.value);

    filtered.forEach(t => {
        const li = document.createElement('li');
        li.className = t.type;
        li.innerHTML = `
            <span>${t.date} | ${t.description} - $${t.amount.toFixed(2)} | ${t.category}</span>
            <span>
                <button class="editBtn" onclick="editTransaction(${t.id})">Edit</button>
                <button class="deleteBtn" onclick="deleteTransaction(${t.id})">X</button>
            </span>
        `;
        transactionList.appendChild(li);
    });
}

// Delete transaction
function deleteTransaction(id) {
    if(confirm('Are you sure?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveAndRender();
    }
}

// Edit transaction
function editTransaction(id) {
    const t = transactions.find(t => t.id === id);
    description.value = t.description;
    amount.value = t.amount;
    type.value = t.type;
    date.value = t.date;
    category.value = t.category;

    transactions = transactions.filter(t => t.id !== id);
    saveAndRender();
}

// Update summary
function updateSummary() {
    let balance = 0, income = 0, expense = 0;
    transactions.forEach(t => {
        if(t.type === 'income') { income += t.amount; balance += t.amount; }
        else { expense += t.amount; balance -= t.amount; }
    });
    balanceEl.textContent = balance.toFixed(2);
    totalIncomeEl.textContent = income.toFixed(2);
    totalExpenseEl.textContent = expense.toFixed(2);
}

// Clear form
function clearForm() {
    description.value = '';
    amount.value = '';
    type.value = 'income';
    date.value = '';
    category.value = 'Salary';
}

// Filters
filterType.addEventListener('change', renderTransactions);
filterDate.addEventListener('change', renderTransactions);
clearFilters.addEventListener('click', () => { filterType.value='all'; filterDate.value=''; renderTransactions(); });

// Render balance graph
function renderChart() {
    const ctx = document.getElementById('balanceChart').getContext('2d');
    const sorted = [...transactions].sort((a,b)=> new Date(a.date)-new Date(b.date));
    const labels = [];
    const data = [];
    let running =0;

    sorted.forEach(t => {
        labels.push(t.date);
        running += t.type==='income'? t.amount : -t.amount;
        data.push(running.toFixed(2));
    });

    if(balanceChart) balanceChart.destroy();

    balanceChart = new Chart(ctx,{
        type:'line',
        data:{
            labels: labels,
            datasets:[{
                label:'Balance Over Time',
                data: data,
                borderColor:'#1b2a49',
                backgroundColor:'#3a4c6b33',
                tension:0.3,
                fill:true,
                pointRadius:4,
                pointBackgroundColor:'#1b2a49'
            }]
        },
        options:{
            responsive:true,
            plugins:{
                legend:{ display:true, position:'top' },
                title:{ display:true, text:'Balance Over Time', font:{ size:18 } }
            },
            scales:{
                y:{ beginAtZero:false }
            }
        }
    });
}

// Initial render
saveAndRender();
