// ============================================================
//  VARIÁVEIS PRINCIPAIS
// ============================================================
var youtubers = [
  "MrBeast",
  "Luan Pires",
  "Alanzoka"
];

var CORRECT_USER = "aluno";
var CORRECT_PASS = "fiap2025";

// Emojis de avatar para variar entre os cards
var AVATARS = ["🎬", "🎮", "🎤", "📹", "🎯", "🎵", "🚀", "🌟", "🔥", "💡"];

// ============================================================
//  FUNÇÃO: handleLogin
// ============================================================
function handleLogin() {
  var userInput = document.getElementById("username");
  var passInput = document.getElementById("password");
  var errUser  = document.getElementById("error-username");
  var errPass  = document.getElementById("error-password");
  var errGlobal = document.getElementById("error-global");

  // Limpa erros anteriores
  errUser.textContent  = "";
  errPass.textContent  = "";
  errGlobal.textContent = "";
  userInput.classList.remove("error");
  passInput.classList.remove("error");

  var user = userInput.value.trim();
  var pass = passInput.value.trim();

  var hasError = false;

  if (user === "") {
    errUser.textContent = "Informe o usuário.";
    userInput.classList.add("error");
    hasError = true;
  }

  if (pass === "") {
    errPass.textContent = "Informe a senha.";
    passInput.classList.add("error");
    hasError = true;
  }

  if (hasError) return;

  if (user !== CORRECT_USER || pass !== CORRECT_PASS) {
    errGlobal.textContent = "Usuário ou senha incorretos. Tente novamente.";
    userInput.classList.add("error");
    passInput.classList.add("error");
    return;
  }

  // Login correto
  document.getElementById("login-screen").classList.remove("active");
  document.getElementById("main-screen").classList.add("active");
  renderList();
}

// ============================================================
//  FUNÇÃO: handleLogout
// ============================================================
function handleLogout() {
  document.getElementById("main-screen").classList.remove("active");
  document.getElementById("login-screen").classList.add("active");
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("error-username").textContent = "";
  document.getElementById("error-password").textContent = "";
  document.getElementById("error-global").textContent = "";
  document.getElementById("username").classList.remove("error");
  document.getElementById("password").classList.remove("error");
}

// ============================================================
//  FUNÇÃO: renderList
// ============================================================
function renderList() {
  var list = document.getElementById("youtuber-list");
  var countEl = document.getElementById("list-count");

  list.innerHTML = "";
  countEl.textContent = youtubers.length;

  if (youtubers.length === 0) {
    list.innerHTML =
      '<li class="empty-state">' +
        '<div class="empty-icon">📭</div>' +
        '<div class="empty-text">Nenhum YouTuber cadastrado ainda.</div>' +
      '</li>';
    return;
  }

  for (var i = 0; i < youtubers.length; i++) {
    var li = document.createElement("li");
    li.className = "youtuber-item";
    li.setAttribute("data-index", i);

    var avatar = AVATARS[i % AVATARS.length];

    li.innerHTML =
      '<div class="item-index">' + (i + 1) + '</div>' +
      '<div class="item-thumb">' + avatar + '</div>' +
      '<span class="item-name">' + escapeHtml(youtubers[i]) + '</span>' +
      '<input type="text" class="item-edit-input" value="' + escapeHtml(youtubers[i]) + '" maxlength="60" />' +
      '<div class="item-actions">' +
        '<button class="btn-icon btn-edit"   title="Editar"    onclick="startEdit(' + i + ')">✏️</button>' +
        '<button class="btn-icon btn-save"   title="Salvar"    onclick="saveEdit(' + i + ')">✅</button>' +
        '<button class="btn-icon btn-cancel" title="Cancelar"  onclick="cancelEdit(' + i + ')">↩️</button>' +
        '<button class="btn-icon btn-remove" title="Remover"   onclick="removeItem(' + i + ')">🗑️</button>' +
      '</div>';

    list.appendChild(li);
  }
}

// ============================================================
//  FUNÇÃO: addToStart
// ============================================================
function addToStart() {
  var input   = document.getElementById("new-name");
  var errAdd  = document.getElementById("error-add");
  var name    = input.value.trim();

  errAdd.textContent = "";

  if (name === "") {
    errAdd.textContent = "Digite o nome do YouTuber antes de adicionar.";
    input.focus();
    return;
  }

  youtubers.unshift(name);
  input.value = "";
  renderList();
}

// ============================================================
//  FUNÇÃO: addToEnd
// ============================================================
function addToEnd() {
  var input   = document.getElementById("new-name");
  var errAdd  = document.getElementById("error-add");
  var name    = input.value.trim();

  errAdd.textContent = "";

  if (name === "") {
    errAdd.textContent = "Digite o nome do YouTuber antes de adicionar.";
    input.focus();
    return;
  }

  youtubers.push(name);
  input.value = "";
  renderList();
}

// ============================================================
//  FUNÇÃO: startEdit
// ============================================================
function startEdit(index) {
  var item       = getItemEl(index);
  var nameSpan   = item.querySelector(".item-name");
  var editInput  = item.querySelector(".item-edit-input");
  var btnEdit    = item.querySelector(".btn-edit");
  var btnSave    = item.querySelector(".btn-save");
  var btnCancel  = item.querySelector(".btn-cancel");

  nameSpan.style.display  = "none";
  editInput.style.display = "block";
  btnEdit.style.display   = "none";
  btnSave.style.display   = "flex";
  btnCancel.style.display = "flex";

  editInput.focus();
  editInput.select();

  // Salva ao pressionar Enter, cancela com Escape
  editInput.onkeydown = function(e) {
    if (e.key === "Enter")  saveEdit(index);
    if (e.key === "Escape") cancelEdit(index);
  };
}

// ============================================================
//  FUNÇÃO: saveEdit
// ============================================================
function saveEdit(index) {
  var item      = getItemEl(index);
  var editInput = item.querySelector(".item-edit-input");
  var newName   = editInput.value.trim();

  if (newName === "") {
    // Campo vazio: mantém original e fecha edição
    cancelEdit(index);
    return;
  }

  youtubers.splice(index, 1, newName);
  renderList();
}

// ============================================================
//  FUNÇÃO: cancelEdit
// ============================================================
function cancelEdit(index) {
  var item       = getItemEl(index);
  var nameSpan   = item.querySelector(".item-name");
  var editInput  = item.querySelector(".item-edit-input");
  var btnEdit    = item.querySelector(".btn-edit");
  var btnSave    = item.querySelector(".btn-save");
  var btnCancel  = item.querySelector(".btn-cancel");

  editInput.value     = youtubers[index]; // restaura original
  nameSpan.style.display  = "";
  editInput.style.display = "none";
  btnEdit.style.display   = "flex";
  btnSave.style.display   = "none";
  btnCancel.style.display = "none";
}

// ============================================================
//  FUNÇÃO: removeItem
// ============================================================
function removeItem(index) {
  youtubers.splice(index, 1);
  renderList();
}

// ============================================================
//  UTILITÁRIOS (não são funções principais de negócio)
// ============================================================
function getItemEl(index) {
  return document.querySelector('.youtuber-item[data-index="' + index + '"]');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Permitir login pressionando Enter nos campos
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("username").addEventListener("keydown", function(e) {
    if (e.key === "Enter") document.getElementById("password").focus();
  });
  document.getElementById("password").addEventListener("keydown", function(e) {
    if (e.key === "Enter") handleLogin();
  });
  document.getElementById("new-name").addEventListener("keydown", function(e) {
    if (e.key === "Enter") addToEnd();
  });
});
