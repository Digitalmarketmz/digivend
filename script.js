// --- Esqueci Senha ---
const forgotForm = document.getElementById("forgotForm");
if (forgotForm) {
  forgotForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();

    const userData = JSON.parse(localStorage.getItem(email));
    if (!userData) {
      alert("Email não encontrado. Verifique e tente novamente.");
      return;
    }

    // Simulação de envio de código (sem servidor real)
    localStorage.setItem("resetEmail", email);
    alert("Código de redefinição enviado! Você será redirecionado para redefinir a senha.");
    window.location.href = "redefinir_senha.html";
  });
}

// --- Redefinir Senha ---
const resetForm = document.getElementById("resetForm");
if (resetForm) {
  resetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const novaSenha = document.getElementById("novaSenha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    const email = localStorage.getItem("resetEmail");

    if (!email) {
      alert("Erro: nenhum email encontrado para redefinição.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    if (novaSenha.length < 8) {
      alert("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    const userData = JSON.parse(localStorage.getItem(email));
    userData.senha = novaSenha;
    localStorage.setItem(email, JSON.stringify(userData));

    localStorage.removeItem("resetEmail");
    alert("Senha redefinida com sucesso!");
    window.location.href = "login.html";
  });
}

// --- Mostrar senha ---
const checkbox = document.getElementById("mostrarSenha");
if (checkbox) {
  checkbox.addEventListener("change", () => {
    const senha = document.getElementById("novaSenha");
    const confirmar = document.getElementById("confirmarSenha");
    const tipo = checkbox.checked ? "text" : "password";
    senha.type = tipo;
    confirmar.type = tipo;
  });
}

