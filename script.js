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

// --- Notificações helpers (para usar cross-pages) ---
const NOTIF_KEY = "digivend_notificacoes_vendedor";

function seedNotificacoesIfNeeded() {
  if (!localStorage.getItem(NOTIF_KEY)) {
    const demo = [
      { id: 1, name: "DIGIVEND (Admin)", sender: "admin@digivend", datetime: new Date().toISOString(), subject: "Promoção semanal", message: "Temos uma promoção especial: 10% para afiliados.", read: false },
      { id: 2, name: "Suporte", sender: "suporte@digivend", datetime: new Date(new Date().getTime() - 3600*1000).toISOString(), subject: "Saque concluído", message: "O seu saque de MT1,500 foi concluído.", read: false }
    ];
    localStorage.setItem(NOTIF_KEY, JSON.stringify(demo));
  }
}
function getNotificacoes() { return JSON.parse(localStorage.getItem(NOTIF_KEY)) || []; }
function saveNotificacoes(arr) { localStorage.setItem(NOTIF_KEY, JSON.stringify(arr)); }

// chamada inicial
seedNotificacoesIfNeeded();

// função útil caso queira criar nova notificação (ex: administrador envia)
function criarNotificacao({name, sender, subject, message}) {
  const list = getNotificacoes();
  const id = (list.reduce((m,x)=> Math.max(m,x.id||0),0) || 0) + 1;
  list.push({ id, name, sender, datetime: new Date().toISOString(), subject, message, read:false });
  saveNotificacoes(list);
  // atualizar badge (se dashboard aberto)
  if (typeof atualizarBadge === "function") atualizarBadge();
}

// === Funções globais ===

// Salvar novo produto (vindo da página adicionar_produto.html)
function salvarProduto(novoProduto) {
  let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  produtos.push(novoProduto);
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

// === Página adicionar_produto.html ===
if (window.location.pathname.includes("adicionar_produto.html")) {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const preco = document.getElementById("preco").value.trim();
    const categoria = document.getElementById("categoria").value;
    const descricao = document.getElementById("descricao").value.trim();
    const ficheiro = document.getElementById("ficheiro").files[0];

    if (!nome || !autor || !preco || !categoria || !descricao || !ficheiro) {
      alert("⚠️ Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Converter imagem/arquivo em Base64
    const reader = new FileReader();
    reader.onload = function () {
      const novoProduto = {
        nome,
        autor,
        preco: parseFloat(preco).toFixed(2),
        categoria,
        descricao,
        imagem: reader.result,
        status: "Pendente",
        dataCriacao: new Date().toLocaleString("pt-PT")
      };

      salvarProduto(novoProduto);

      // Mostrar mensagem de sucesso
      const mensagem = document.createElement("div");
      mensagem.innerHTML = `
        <div style="
          position:fixed;
          top:0;left:0;width:100%;height:100%;
          background:rgba(0,0,0,0.8);
          display:flex;align-items:center;justify-content:center;
          z-index:9999;">
          <div style="
            background-color:#111;
            padding:30px;
            border-radius:10px;
            text-align:center;
            box-shadow:0 0 10px #007bff;">
            <h1>📦✅</h1>
            <h2>Produto criado com sucesso!</h2>
            <p>O tempo de espera para que a revisão do produto seja totalmente feita pelo suporte DIGIVEND é de 30 minutos no mínimo.</p>
            <p>Caso o seu produto seja aprovado, o status passará de <b>Pendente</b> para <b>Ativo</b>.</p>
            <p>Se for rejeitado, mudará para <b>Rejeitado</b>.</p>
            <p>Para mais informações, entre em contacto com o suporte.</p>
            <button id="fecharMensagem" style="
              margin-top:15px;
              padding:10px 20px;
              background-color:#007bff;
              border:none;
              border-radius:6px;
              color:white;
              cursor:pointer;">Fechar</button>
          </div>
        </div>
      `;
      document.body.appendChild(mensagem);

      document.getElementById("fecharMensagem").onclick = function () {
        mensagem.remove();
        window.location.href = "meus_produtos.html";
      };

      // Redireciona automaticamente após 5s
      setTimeout(() => {
        window.location.href = "meus_produtos.html";
      }, 5000);
    };

    reader.readAsDataURL(ficheiro);
  });
}

// === Página meus_produtos.html ===
if (window.location.pathname.includes("meus_produtos.html")) {
  function carregarProdutos() {
    const container = document.getElementById("produtosContainer");
    if (!container) return;
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    container.innerHTML = "";

    if (produtos.length === 0) {
      container.innerHTML = "<p>Nenhum produto adicionado ainda.</p>";
      return;
    }

    produtos.forEach((p, i) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${p.imagem}" alt="${p.nome}" style="width:100%;border-radius:8px;object-fit:cover;height:150px;">
        <h3>${p.nome}</h3>
        <p>${p.descricao.substring(0, 100)}...</p>
        <p><b>Preço:</b> ${p.preco} MT</p>
        <p><b>Categoria:</b> ${p.categoria}</p>
        <span class="status">${p.status}</span>
        <div class="botoes-card">
          <button onclick="copiarLink(${i})">Copiar Link</button>
          <button onclick="editarProduto(${i})">Editar</button>
          <button onclick="removerProduto(${i})">Remover</button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  window.copiarLink = function (index) {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    const link = `https://digivend.com/produto/${encodeURIComponent(produtos[index].nome.replace(/\s+/g, '-').toLowerCase())}`;
    navigator.clipboard.writeText(link);
    alert("🔗 Link do produto copiado com sucesso!");
  };

  window.removerProduto = function (index) {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    if (confirm("Deseja realmente remover este produto?")) {
      produtos.splice(index, 1);
      localStorage.setItem("produtos", JSON.stringify(produtos));
      carregarProdutos();
    }
  };

  window.editarProduto = function (index) {
    alert("Função de edição ainda em desenvolvimento 💡");
  };

  carregarProdutos();
}
