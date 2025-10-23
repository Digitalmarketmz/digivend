// ========== Cadastro ==========
function cadastrar(tipo) {
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const repetir = document.getElementById('repetir').value.trim();

  if (!email || !senha || !repetir) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  if (senha !== repetir) {
    alert("As senhas não coincidem!");
    return;
  }

  // Regras de senha forte
  const senhaForte = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  if (!senhaForte.test(senha)) {
    alert("A senha deve conter 8 caracteres, 1 letra maiúscula, 1 número e 1 símbolo!");
    return;
  }

  // Verifica se o e-mail já está cadastrado
  const usuarioExistente = localStorage.getItem(email);
  if (usuarioExistente) {
    alert("Este e-mail já está cadastrado!");
    return;
  }

  // Salva o novo usuário
  const novoUsuario = { tipo, email, senha };
  localStorage.setItem(email, JSON.stringify(novoUsuario));

  alert("Conta criada com sucesso! Faça login agora.");
  window.location.href = "login.html";
}

// ========== Login ==========
function login() {
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  if (!email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  const usuarioData = localStorage.getItem(email);

  if (!usuarioData) {
    alert("Usuário não encontrado!");
    return;
  }

  const usuario = JSON.parse(usuarioData);

  if (usuario.senha !== senha) {
    alert("Senha incorreta!");
    return;
  }

  // Salvar sessão do usuário logado
  sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));

  alert(`Bem-vindo de volta, ${usuario.tipo}!`);
  
  // Redireciona conforme o tipo
  if (usuario.tipo === "vendedor") {
    window.location.href = "dashboard_vendedor.html";
  } else {
    window.location.href = "dashboard_comprador.html";
  }
}

// ========== Verificação automática de login ==========
function verificarLogin(tipoEsperado) {
  const dados = sessionStorage.getItem("usuarioLogado");
  if (!dados) {
    window.location.href = "login.html";
    return;
  }

  const usuario = JSON.parse(dados);

  // Impede acessar dashboard de outro tipo
  if (usuario.tipo !== tipoEsperado) {
    alert("Acesso negado!");
    window.location.href = "login.html";
  }

  // Exibe o email do usuário logado (opcional)
  const userEmail = document.getElementById("userEmail");
  if (userEmail) {
    userEmail.textContent = usuario.email;
  }
}

// ========== Logout ==========
function logout() {
  sessionStorage.removeItem("usuarioLogado");
  alert("Sessão encerrada com sucesso!");
  window.location.href = "index.html";
}

// ========== Mostrar/ocultar senha ==========
function toggleSenha(idCampo) {
  const campo = document.getElementById(idCampo);
  campo.type = campo.type === "password" ? "text" : "password";
}

// ========== Recuperar Senha ==========
function recuperarSenha(event) {
  event.preventDefault();

  const email = document.getElementById('emailRecuperacao').value.trim();
  const usuarioData = localStorage.getItem(email);

  if (!usuarioData) {
    alert("E-mail não encontrado em nossa base!");
    return;
  }

  // Simula o envio de e-mail
  alert("Um link de redefinição foi enviado para o seu e-mail (simulação).");

  // Redireciona após simular envio
  window.location.href = "redefinir_senha.html";
}

// ========== Redefinir Senha ==========
function redefinirSenha(event) {
  event.preventDefault();

  const email = document.getElementById('emailRedefinir').value.trim();
  const novaSenha = document.getElementById('novaSenha').value.trim();
  const confirmar = document.getElementById('confirmarSenha').value.trim();

  if (!email || !novaSenha || !confirmar) {
    alert("Preencha todos os campos!");
    return;
  }

  if (novaSenha !== confirmar) {
    alert("As senhas não coincidem!");
    return;
  }

  const usuarioData = localStorage.getItem(email);
  if (!usuarioData) {
    alert("E-mail não encontrado!");
    return;
  }

  const usuario = JSON.parse(usuarioData);
  usuario.senha = novaSenha;
  localStorage.setItem(email, JSON.stringify(usuario));

  alert("Senha redefinida com sucesso!");
  window.location.href = "login.html";
}

