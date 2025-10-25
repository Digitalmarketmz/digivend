// Sidebar toggle
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const closeSidebar = document.getElementById("closeSidebar");

if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("-translate-x-full");
  });
}

if (closeSidebar && sidebar) {
  closeSidebar.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full");
  });
}

// Fecha sidebar ao clicar em algum link
document.querySelectorAll("#sidebar a").forEach(link => {
  link.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full");
  });
});

// Gráfico de vendas do vendedor
const graficoCanvas = document.getElementById("graficoVendas");
if (graficoCanvas) {
  new Chart(graficoCanvas, {
    type: "line",
    data: {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      datasets: [{
        label: "Vendas (MT)",
        data: [1000, 2500, 3200, 4800, 4200, 5600],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.4,
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, ticks: { color: "#A5B4FC" } },
        x: { ticks: { color: "#A5B4FC" } }
      },
      plugins: {
        legend: { labels: { color: "#A5B4FC" } }
      }
    }
  });
}

function login() {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  const usuario = JSON.parse(localStorage.getItem(email));

  if (!usuario) {
    alert("Conta não encontrada! Cadastre-se primeiro.");
    return;
  }

  if (usuario.senha !== senha) {
    alert("Senha incorreta!");
    return;
  }

  // Redireciona conforme o tipo de conta
  if (usuario.tipo === "vendedor") {
    window.location.href = "dashboard_vendedor.html";
  } else {
    window.location.href = "dashboard_comprador.html";
  }
}

function toggleSenha() {
  const senhaInput = document.getElementById("senha");
  senhaInput.type = senhaInput.type === "password" ? "text" : "password";
}

