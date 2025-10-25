// Função de cadastro (tanto vendedor quanto comprador)
function cadastrar(tipo) {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const confirmarSenha = document.getElementById("confirmar_senha").value.trim();

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  if (senha.length < 8 || !/[A-Z]/.test(senha) || !/[0-9]/.test(senha)) {
    alert("A senha deve conter pelo menos 8 caracteres, uma letra maiúscula e um número.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (usuarios.find(u => u.email === email)) {
    alert("Este email já está cadastrado!");
    return;
  }

  usuarios.push({ email, senha, tipo });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Conta criada com sucesso!");
  window.location.href = "login.html";
}

// Função de login
function login() {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.email === email);

  if (!usuario) {
    alert("Usuário não encontrado!");
    return;
  }

  if (usuario.senha !== senha) {
    alert("Senha incorreta!");
    return;
  }

  alert("Login bem-sucedido!");
  localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

  if (usuario.tipo === "vendedor") {
    window.location.href = "dashboard_vendedor.html";
  } else {
    window.location.href = "dashboard_comprador.html";
  }
}

// Função de "Esqueci minha senha"
function enviarRedefinicao() {
  const email = document.getElementById("email_recuperacao").value.trim();
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) {
    alert("Email não encontrado!");
    return;
  }

  localStorage.setItem("redefinirEmail", email);
  alert("Link de redefinição enviado (simulado). Redirecionando...");
  window.location.href = "redefinir_senha.html";
}

// Função de redefinição de senha
function redefinirSenha() {
  const nova = document.getElementById("nova_senha").value.trim();
  const confirmar = document.getElementById("confirmar_senha").value.trim();

  if (nova !== confirmar) {
    alert("As senhas não coincidem!");
    return;
  }

  const email = localStorage.getItem("redefinirEmail");
  if (!email) {
    alert("Erro: Nenhum email encontrado para redefinição.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const index = usuarios.findIndex(u => u.email === email);

  if (index === -1) {
    alert("Usuário não encontrado!");
    return;
  }

  usuarios[index].senha = nova;
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  localStorage.removeItem("redefinirEmail");

  alert("Senha redefinida com sucesso!");
  window.location.href = "login.html";
}

