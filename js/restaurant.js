/* ================================
   HARSHUU 2.0 – Restaurant Admin JS
   Used in restaurants.html
================================ */

// HTML elements
const restaurantList = document.getElementById("restaurantList");
const addBtn = document.getElementById("addRestaurantBtn");

// ================================
// LOAD RESTAURANTS
// ================================
async function loadRestaurants() {
  restaurantList.innerHTML = "Loading restaurants...";

  try {
    const res = await getRestaurants(); // api.js
    const restaurants = res.data;

    if (!restaurants.length) {
      restaurantList.innerHTML = "No restaurants found";
      return;
    }

    restaurantList.innerHTML = "";

    restaurants.forEach(r => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${r.name}</h3>
        <p>Status: 
          <span class="${r.isActive ? "status-open" : "status-closed"}">
            ${r.isActive ? "ACTIVE" : "INACTIVE"}
          </span>
        </p>

        <button onclick="toggle('${r._id}')">
          ${r.isActive ? "Deactivate" : "Activate"}
        </button>

        <button style="margin-top:6px;background:#555"
          onclick="removeRestaurant('${r._id}')">
          Delete
        </button>
      `;

      restaurantList.appendChild(div);
    });

  } catch (err) {
    restaurantList.innerHTML = "Error loading restaurants";
  }
}

// ================================
// ADD RESTAURANT
// ================================
addBtn.onclick = async () => {
  const name = document.getElementById("name").value.trim();
  const image = document.getElementById("image").value.trim();

  if (!name || !image) {
    alert("Name and Image are required");
    return;
  }

  try {
    await addRestaurant({ name, image });
    alert("Restaurant added");
    document.getElementById("name").value = "";
    document.getElementById("image").value = "";
    loadRestaurants();
  } catch (err) {}
};

// ================================
// TOGGLE RESTAURANT
// ================================
async function toggle(id) {
  if (!confirm("Change restaurant status?")) return;

  try {
    await toggleRestaurant(id);
    loadRestaurants();
  } catch (err) {}
}

// ================================
// DELETE RESTAURANT
// ================================
async function removeRestaurant(id) {
  if (!confirm("Delete restaurant permanently?")) return;

  try {
    await deleteRestaurant(id);
    loadRestaurants();
  } catch (err) {}
}

// ================================
// INIT
// ================================
loadRestaurants();
