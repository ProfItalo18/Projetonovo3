// Array para armazenar as transações
let transactions = [];

document.getElementById('finance-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;
  
  addTransaction(description, amount, type);
  updateTable();
  updateChart();
  updateBalance();
  
  // Limpa os campos
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
});

function addTransaction(description, amount, type) {
  transactions.push({ description, amount, type });
}

function updateTable() {
  const tbody = document.querySelector('#finance-table tbody');
  tbody.innerHTML = ''; // Limpa a tabela
  
  transactions.forEach(transaction => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${transaction.description}</td>
      <td>R$ ${transaction.amount.toFixed(2)}</td>
      <td>${transaction.type}</td>
    `;
    tbody.appendChild(row);
  });
}

function updateBalance() {
  const total = transactions.reduce((acc, transaction) => {
    return transaction.type === 'receita' ? acc + transaction.amount : acc - transaction.amount;
  }, 0);
  
  document.getElementById('balance-amount').textContent = `R$ ${total.toFixed(2)}`;
}

function updateChart() {
  const receitaTotal = transactions
    .filter(t => t.type === 'receita')
    .reduce((acc, t) => acc + t.amount, 0);
  
  const despesaTotal = transactions
    .filter(t => t.type === 'despesa')
    .reduce((acc, t) => acc + t.amount, 0);
  
  const ctx = document.getElementById('finance-chart').getContext('2d');
  
  if (window.financeChart) {
    window.financeChart.destroy(); // Destroi o gráfico anterior antes de criar um novo
  }

  window.financeChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Receitas', 'Despesas'],
      datasets: [{
        label: 'Gerenciamento Financeiro',
        data: [receitaTotal, despesaTotal],
        backgroundColor: ['#36a2eb', '#ff6384']
      }]
    }
  });
}
