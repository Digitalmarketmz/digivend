// ========== Funções de Utilidade ==========
function getUsers() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function saveUsers(users) {
  localStorage.setItem("usuarios", JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("usuarioAtual"));
}

function setCurrentUser(user) {
  localStorage.setItem("usuarioAtual", JSON.stringify(user));
}

function logout() {
  localStorage.removeItem("usuarioAtual");
  window.location.href = "login.html";
}

// ========== Cadastro ==========
function cadastrar(tipo) {
  const email = document.getElementById("email")?.value.trim();
  const senha = document.getElementById("senha")?.value;
  const senha2 = document.getElementById("senha2")?.value;

  if (!email || !senha || !senha2) {
    alert("Preencha todos os campos!");
    return;
  }

  if (senha !== senha2) {
    alert("As senhas não coincidem!");
    return;
  }

  if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/.test(senha)) {
    alert("A senha deve ter no mínimo 8 caracteres, 1 letra maiúscula, 1 número e 1 símbolo!");
    return;
  }

  const users = getUsers();

  if (users.find(u => u.email === email)) {
    alert("Já existe uma conta com este email!");
    return;
  }

  const novoUsuario = { email, senha, tipo };
  users.push(novoUsuario);
  saveUsers(users);

  alert("Conta criada com sucesso! Agora faça login.");
  window.location.href = "login.html";
}

// ========== Login ==========
function login() {
  const email = document.getElementById("email")?.value.trim();
  const senha = document.getElementById("senha")?.value;

  const users = getUsers();
  const user = users.find(u => u.email === email && u.senha === senha);

  if (!user) {
    alert("Email ou senha incorretos!");
    return;
  }

  setCurrentUser(user);
  alert(`Bem-vindo de volta, ${user.tipo === "vendedor" ? "Vendedor" : "Comprador"}!`);

  if (user.tipo === "vendedor") {
    window.location.href = "dashboard_vendedor.html";
  } else {
    window.location.href = "dashboard_comprador.html";
  }
}

// ========== Esqueci Minha Senha ==========
function solicitarRedefinicao() {
  const email = document.getElementById("email")?.value.trim();
  if (!email) {
    alert("Digite seu email!");
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    alert("Email não encontrado!");
    return;
  }

  localStorage.setItem("resetEmail", email);
  alert("Código de redefinição enviado! (simulado)");
  window.location.href = "redefinir_senha.html";
}

// ========== Redefinir Senha ==========
function redefinirSenha() {
  const senha1 = document.getElementById("novaSenha")?.value;
  const senha2 = document.getElementById("confirmarSenha")?.value;

  if (!senha1 || !senha2) {
    alert("Preencha todos os campos!");
    return;
  }

  if (senha1 !== senha2) {
    alert("As senhas não coincidem!");
    return;
  }

  const email = localStorage.getItem("resetEmail");
  if (!email) {
    alert("Erro ao redefinir senha. Solicite novamente.");
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    alert("Usuário não encontrado!");
    return;
  }

  user.senha = senha1;
  saveUsers(users);
  localStorage.removeItem("resetEmail");

  alert("Senha redefinida com sucesso!");
  window.location.href = "login.html";
}

// ========== Mostrar / Ocultar Senha ==========
function toggleSenha() {
  const senhaInput = document.getElementById("senha");
  senhaInput.type = senhaInput.type === "password" ? "text" : "password";
}

// ========== Controle Automático de Acesso ==========
function verificarAcessoDashboard(tipoEsperado) {
  const user = getCurrentUser();
  if (!user) {
    alert("Você precisa estar logado para acessar esta página!");
    window.location.href = "login.html";
    return;
  }

  if (user.tipo !== tipoEsperado) {
    alert("Acesso negado!");
    window.location.href = "login.html";
  }
}

