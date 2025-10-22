// script.js - DIGIVEND
document.addEventListener("DOMContentLoaded", () => {
  console.log("DIGIVEND carregado com sucesso!");
});

// ========== Funções Utilitárias ==========

// Recupera os usuários salvos
function getUsers() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

// Salva a lista de usuários
function saveUsers(users) {
  localStorage.setItem("usuarios", JSON.stringify(users));
}

// ========== Cadastro ==========

function cadastrar(tipoConta) {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const repetirSenha = document.getElementById("repetirSenha").value.trim();

  if (!email || !senha || !repetirSenha) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  if (senha !== repetirSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  // Regras de senha
  const senhaForte = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
  if (!senhaForte.test(senha)) {
    alert("A senha deve ter pelo menos 8 dígitos, 1 letra maiúscula, 1 número e 1 símbolo.");
    return;
  }

  const users = getUsers();
  const existente = users.find(u => u.email === email);

  if (existente) {
    alert(`Este e-mail já está cadastrado como ${existente.tipoConta}.`);
    return;
  }

  users.push({ email, senha, tipoConta });
  saveUsers(users);

  alert("Conta criada com sucesso! Faça login para continuar.");
  window.location.href = "login.html";
}

// ========== Login ==========

function login() {
  const email = document.getElementById("emailLogin").value.trim();
  const senha = document.getElementById("senhaLogin").value.trim();

  const users = getUsers();
  const user = users.find(u => u.email === email && u.senha === senha);

  if (!user) {
    alert("E-mail ou senha incorretos!");
    return;
  }

  localStorage.setItem("usuarioLogado", JSON.stringify(user));
  window.location.href = "painel.html";
}

// ========== Painel ==========
function carregarPainel() {
  const user = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("emailUser").innerText = user.email;
  document.getElementById("tipoConta").innerText =
    user.tipoConta === "vendedor" ? "Vendedor" : "Comprador";
}

function sair() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}

