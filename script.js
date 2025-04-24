let allUsers = [];
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

function switchTab(tabId) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");

  if (tabId === "home") loadUsers();
  if (tabId === "search") renderSearch();
  if (tabId === "favorites") renderFavorites();
  if (tabId === "combine") combineNames();
}

function loadUsers() {
    const apiKey = 'H4R6-V09I-TJIK-EQBT'; // Reemplaza con tu clave de API real
  fetch('https://randomuser.me/api/?results=10')
    .then(res => res.json())
    .then(data => {
      allUsers = data.results;
      renderUsers("home", allUsers);
    });
}

function renderUsers(tabId, users) {
  const container = document.getElementById(tabId);
  container.innerHTML = "";
  users.forEach(user => {
    const card = document.createElement("div");
    card.className = "user-card";
    card.innerHTML = `
      <img src="${user.picture.medium}" />
      <div>
        <strong>${user.name.first} ${user.name.last}</strong><br/>
        <small>${user.gender} - ${user.email}</small><br/>
        <button onclick="addFavorite('${user.login.uuid}')">❤️ Favorito</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderSearch() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const gender = document.getElementById("genderFilter").value;
  const filtered = allUsers.filter(u =>
    u.name.first.toLowerCase().includes(query) &&
    (gender === "" || u.gender === gender)
  );
  renderUsers("search", filtered);
}

function addFavorite(id) {
  const user = allUsers.find(u => u.login.uuid === id);
  if (user && !favorites.some(f => f.login.uuid === id)) {
    favorites.push(user);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Agregado a favoritos");
  }
}

function renderFavorites() {
  renderUsers("favorites", favorites);
}

function combineNames() {
  const container = document.getElementById("combine");
  container.innerHTML = "<h2>Nombres Combinados</h2>";
  if (allUsers.length < 2) return;

  const [u1, u2] = [allUsers[0], allUsers[1]];
  const combined = `${u1.name.first.slice(0, 3)}${u2.name.first.slice(3)}`;
  container.innerHTML += `<p>${u1.name.first} + ${u2.name.first} = <strong>${combined}</strong></p>`;
}

document.getElementById("searchInput").addEventListener("input", renderSearch);
document.getElementById("genderFilter").addEventListener("change", renderSearch);

window.onload = () => switchTab("home");
