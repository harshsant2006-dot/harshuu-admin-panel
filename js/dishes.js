/* ================================
   HARSHUU 2.0 – Dishes Admin JS
   Used in dishes.html
================================ */

// HTML elements
const restaurantSelect = document.getElementById("restaurantSelect");
const dishList = document.getElementById("dishList");
const addDishBtn = document.getElementById("addDishBtn");

// ================================
// LOAD RESTAURANTS (for dropdown)
// ================================
async function loadRestaurantOptions() {
  try {
    const res = await getRestaurants(); // from api.js
    restaurantSelect.innerHTML = `<option value="">Select Restaurant</option>`;

    res.data.forEach(r => {
      const opt = document.createElement("option");
      opt.value = r._id;
      opt.textContent = r.name;
      restaurantSelect.appendChild(opt);
    });
  } catch (err) {
    alert("Failed to load restaurants");
  }
}

// ================================
// LOAD DISHES BY RESTAURANT
// ================================
async function loadDishes() {
  const restaurantId = restaurantSelect.value;
  if (!restaurantId) {
    dishList.innerHTML = "Select restaurant first";
    return;
  }

  dishList.innerHTML = "Loading dishes...";

  try {
    const res = await getDishesByRestaurant(restaurantId);
    const dishes = res.data;

    if (!dishes.length) {
      dishList.innerHTML = "No dishes found";
      return;
    }

    dishList.innerHTML = "";

    dishes.forEach(d => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${d.name}</h3>
        <p>₹ ${d.price}</p>
        <p>Status: 
          <span class="${d.isAvailable ? "status-open" : "status-closed"}">
            ${d.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
          </span>
        </p>

        <input type="number" placeholder="New price" id="price-${d._id}" />

        <button onclick="changePrice('${d._id}')">
          Update Price
        </button>

        <button style="margin-top:6px"
          onclick="toggleDishStatus('${d._id}')">
          ${d.isAvailable ? "Disable" : "Enable"}
        </button>

        <button style="margin-top:6px;background:#555"
          onclick="removeDish('${d._id}')">
          Delete
        </button>
      `;

      dishList.appendChild(div);
    });

  } catch (err) {
    dishList.innerHTML = "Error loading dishes";
  }
}

// ================================
// ADD DISH
// ================================
addDishBtn.onclick = async () => {
  const restaurantId = restaurantSelect.value;
  const name = document.getElementById("dishName").value.trim();
  const price = document.getElementById("dishPrice").value;
  const type = document.getElementById("dishType").value;
  const image = document.getElementById("dishImage").value.trim();

  if (!restaurantId || !name || !price || !type || !image) {
    alert("All fields required");
    return;
  }

  try {
    await addDish({
      restaurantId,
      name,
      price: Number(price),
      type,
      image
    });

    alert("Dish added");

    document.getElementById("dishName").value = "";
    document.getElementById("dishPrice").value = "";
    document.getElementById("dishImage").value = "";

    loadDishes();
  } catch (err) {}
};

// ================================
// UPDATE PRICE
// ================================
async function changePrice(id) {
  const price = document.getElementById(`price-${id}`).value;

  if (!price || price <= 0) {
    alert("Enter valid price");
    return;
  }

  try {
    await updateDishPrice(id, Number(price));
    alert("Price updated");
    loadDishes();
  } catch (err) {}
}

// ================================
// TOGGLE DISH STATUS
// ================================
async function toggleDishStatus(id) {
  if (!confirm("Change dish availability?")) return;

  try {
    await toggleDish(id);
    loadDishes();
  } catch (err) {}
}

// ================================
// DELETE DISH
// ================================
async function removeDish(id) {
  if (!confirm("Delete dish permanently?")) return;

  try {
    await deleteDish(id);
    loadDishes();
  } catch (err) {}
}

// ================================
// INIT
// ================================
restaurantSelect.onchange = loadDishes;
loadRestaurantOptions();
