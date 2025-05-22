const languageSelect = document.getElementById("language-select");
const messageDiv = document.getElementById("message");
const repoCard = document.getElementById("repo-card");
const refreshBtn = document.getElementById("refresh-btn");
let currentLanguage = "";

// Lista local de lenguajes
const languages = [
  "JavaScript", "Python", "Java", "C++", "Go", "Ruby", "PHP", "TypeScript", "C#", "Rust"
];

// Poblar el menú desplegable
languages.forEach(lang => {
  const option = document.createElement("option");
  option.value = lang;
  option.textContent = lang;
  languageSelect.appendChild(option);
});

// Evento: cuando cambia el lenguaje seleccionado
languageSelect.addEventListener("change", () => {
  currentLanguage = languageSelect.value;
  if (!currentLanguage) {
    showMessage("Por favor selecciona un lenguaje");
    repoCard.classList.add("hidden");
    refreshBtn.classList.add("hidden");
    return;
  }
  fetchRepo();
});

// Evento: clic en "Otro repositorio"
refreshBtn.addEventListener("click", fetchRepo);

// Función para obtener y mostrar un repositorio aleatorio
function fetchRepo() {
  showMessage("Cargando, por favor espera...");
  repoCard.classList.add("hidden");
  refreshBtn.classList.add("hidden");

  const url = `https://api.github.com/search/repositories?q=language:${currentLanguage}&sort=stars&order=desc&per_page=50`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Error al obtener los repositorios");
      return res.json();
    })
    .then(data => {
      const repos = data.items;
      if (!repos || repos.length === 0) throw new Error("No se encontraron repositorios");
      const repo = repos[Math.floor(Math.random() * repos.length)];
      displayRepo(repo);
    })
    .catch(err => {
      showMessage(err.message, true);
    });
}

// Mostrar los datos del repositorio en pantalla
function displayRepo(repo) {
  repoCard.innerHTML = `
    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
    <p>${repo.description || "Sin descripción"}</p>
    <p>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count} | 🐛 ${repo.open_issues_count}</p>
  `;
  repoCard.classList.remove("hidden");
  messageDiv.textContent = "";
  refreshBtn.classList.remove("hidden");
}

// Mostrar mensajes informativos o de error
function showMessage(msg, isError = false) {
  messageDiv.textContent = msg;
  messageDiv.className = isError ? "message error" : "message";
}
