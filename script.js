// Variables globales
let users = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Función para cambiar de pestaña
function changeTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));
  document.getElementById(tabId).classList.remove('hidden');
}

// Función para cargar usuarios desde la API
async function loadUsers() {
  const apiKey = 'H4R6-V09I-TJIK-EQBT'; // Reemplaza con tu clave de API real
  try {
    const response = await fetch(`https://randomuser.me/api/?results=150`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`, // Incluye la clave de API en los encabezados
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Error al cargar usuarios');
    }
    const data = await response.json();
    users = data.results;
    renderUsers(users);
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  }
}

// Función para renderizar usuarios
function renderUsers(userList) {
  const userListElement = document.getElementById('user-list');
  userListElement.innerHTML = '';
  userList.forEach(user => {
    const li = document.createElement('li');
    li.textContent = `${user.name.first} ${user.name.last}`;
    li.onclick = () => toggleFavorite(user);
    userListElement.appendChild(li);
  });
}

// Función para filtrar usuarios
function filterUsers() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const filteredUsers = users.filter(user =>
    `${user.name.first} ${user.name.last}`.toLowerCase().includes(query)
  );
  renderUsers(filteredUsers);
}

// Función para agregar/quitar favoritos
function toggleFavorite(user) {
  const index = favorites.findIndex(fav => fav.login.uuid === user.login.uuid);
  if (index === -1) {
    favorites.push(user);
  } else {
    favorites.splice(index, 1);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}

// Función para renderizar favoritos
function renderFavorites() {
  const favoriteListElement = document.getElementById('favorite-list');
  favoriteListElement.innerHTML = '';
  favorites.forEach(fav => {
    const li = document.createElement('li');
    li.textContent = `${fav.name.first} ${fav.name.last}`;
    favoriteListElement.appendChild(li);
  });
}

// Función para cambiar tema
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  renderFavorites();
});