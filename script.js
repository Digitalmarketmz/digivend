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

  alert(`Bem-vindo de volta, ${usuario.tipo}!`);
  
  // Redireciona conforme o tipo
  if (usuario.tipo === "vendedor") {
    window.location.href = "dashboard_vendedor.html";
  } else {
    window.location.href = "dashboard_comprador.html";
  }
}

// ========== Mostrar/ocultar senha ==========
function toggleSenha(idCampo) {
  const campo = document.getElementById(idCampo);
  campo.type = campo.type === "password" ? "text" : "password";
}

