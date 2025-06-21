const apiUrl = 'https://script.google.com/macros/s/AKfycbz60EPKBGEEV6N_4KoXwel-mgK4p9F9SyIG9WEhC31leBMj7zOAswEJnh6IiPKulBDU3Q/exec';  // <-- Cole aqui o link da sua API do Apps Script

function carregarItens() {
  fetch(`${apiUrl}?action=get`)
    .then(res => res.json())
    .then(data => {
      const tabela = document.getElementById('tabela-itens');
      tabela.innerHTML = '';
      data.forEach(item => {
        tabela.innerHTML += `
          <tr>
            <td>${item.item}</td>
            <td>${item.consumo}</td>
            <td>${item.estoque}</td>
            <td>${item.status}</td>
            <td>
              <button onclick="editarItem('${item.row}', '${item.item}', '${item.consumo}', '${item.estoque}', '${item.status}')">✏️ Editar</button>
              <button onclick="excluirItem('${item.row}')">🗑️ Excluir</button>
            </td>
          </tr>
        `;
      });
    });
}

function adicionarItem() {
  const item = document.getElementById('item').value;
  const consumo = document.getElementById('consumo').value;
  const estoque = document.getElementById('estoque').value;
  const status = document.getElementById('status').value;

  fetch(`${apiUrl}?action=add&item=${item}&consumo=${consumo}&estoque=${estoque}&status=${status}`)
    .then(() => {
      limparForm();
      carregarItens();
    });
}

function excluirItem(row) {
  if (confirm('Tem certeza que deseja excluir este item?')) {
    fetch(`${apiUrl}?action=delete&row=${row}`)
      .then(() => carregarItens());
  }
}

function editarItem(row, item, consumo, estoque, status) {
  document.getElementById('item').value = item;
  document.getElementById('consumo').value = consumo;
  document.getElementById('estoque').value = estoque;
  document.getElementById('status').value = status;
  document.getElementById('editRow').value = row;
  document.getElementById('saveEdit').style.display = 'inline';
}

function salvarEdicao() {
  const row = document.getElementById('editRow').value;
  const item = document.getElementById('item').value;
  const consumo = document.getElementById('consumo').value;
  const estoque = document.getElementById('estoque').value;
  const status = document.getElementById('status').value;

  fetch(`${apiUrl}?action=edit&row=${row}&item=${item}&consumo=${consumo}&estoque=${estoque}&status=${status}`)
    .then(() => {
      limparForm();
      carregarItens();
    });
}

function limparForm() {
  document.getElementById('item').value = '';
  document.getElementById('consumo').value = '';
  document.getElementById('estoque').value = '';
  document.getElementById('status').value = '';
  document.getElementById('editRow').value = '';
  document.getElementById('saveEdit').style.display = 'none';
}

window.onload = carregarItens;
