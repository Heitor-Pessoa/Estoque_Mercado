const apiUrl = 'https://script.google.com/macros/s/AKfycbz60EPKBGEEV6N_4KoXwel-mgK4p9F9SyIG9WEhC31leBMj7zOAswEJnh6IiPKulBDU3Q/exec';  // <-- Coloque aqui seu link da API Google Apps Script
let rowToDelete = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

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
              <button class="edit" onclick="editarItem('${item.row}', '${item.item}', '${item.consumo}', '${item.estoque}', '${item.status}')">✏️ Editar</button>
              <button class="delete" onclick="confirmarExclusao('${item.row}')">🗑️ Excluir</button>
            </td>
          </tr>
        `;
      });
    });
}

function adicionarItem() {
  const item = document.getElementById('item').value.trim();
  const consumo = document.getElementById('consumo').value.trim();
  const estoque = document.getElementById('estoque').value.trim();
  const status = document.getElementById('status').value.trim();

  if (!item || !consumo || !estoque || !status) {
    showToast("Preencha todos os campos!");
    return;
  }

  fetch(`${apiUrl}?action=add&item=${item}&consumo=${consumo}&estoque=${estoque}&status=${status}`)
    .then(() => {
      limparForm();
      carregarItens();
      showToast("Item adicionado com sucesso!");
    });
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
  const item = document.getElementById('item').value.trim();
  const consumo = document.getElementById('consumo').value.trim();
  const estoque = document.getElementById('estoque').value.trim();
  const status = document.getElementById('status').value.trim();

  if (!item || !consumo || !estoque || !status) {
    showToast("Preencha todos os campos!");
    return;
  }

  fetch(`${apiUrl}?action=edit&row=${row}&item=${item}&consumo=${consumo}&estoque=${estoque}&status=${status}`)
    .then(() => {
      limparForm();
      carregarItens();
      showToast("Item editado com sucesso!");
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

function confirmarExclusao(row) {
  rowToDelete = row;
  document.getElementById('modal').style.display = 'flex';
}

function fecharModal() {
  rowToDelete = null;
  document.getElementById('modal').style.display = 'none';
}

document.getElementById('confirmDelete').addEventListener('click', () => {
  if (rowToDelete) {
    fetch(`${apiUrl}?action=delete&row=${rowToDelete}`)
      .then(() => {
        carregarItens();
        showToast("Item excluído!");
        fecharModal();
      });
  }
});

function filtrarTabela() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const linhas = document.querySelectorAll('#tabela-itens tr');

  linhas.forEach(linha => {
    const textoLinha = linha.innerText.toLowerCase();
    linha.style.display = textoLinha.includes(input) ? '' : 'none';
  });
}

window.onload = carregarItens;
