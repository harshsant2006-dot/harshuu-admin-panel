// harshuu-admin/js/dishes.js

const restaurantSelect = document.getElementById("restaurantSelect");
const dishGrid = document.getElementById("dishGrid");
const modal = document.getElementById("dishModal");

async function loadRestaurants() {
  const res = await fetch(API_BASE + "/restaurants");
  const json = await res.json();
  if (!json.success) return;

  restaurantSelect.innerHTML = json.data
    .map(r => `<option value="${r._id}">${r.name}</option>`)
    .join("");

  loadDishes();
}

async function loadDishes() {
  const rid = restaurantSelect.value;
  if (!rid) return;

  const res = await fetch(API_BASE + `/dishes/restaurant/${rid}`);
  const json = await res.json();
  if (!json.success) return;

  dishGrid.innerHTML = json.data.map(d => `
    <div class="card">
      <img src="${d.image}" style="width:100%;height:140px;object-fit:cover">
      <h4>${d.name}</h4>
      <span class="status ${d.type === "VEG" ? "delivered" : "pending"}">${d.type}</span>
      <div class="price-row">
        ₹ <input value="${d.price}" onchange="updatePrice('${d._id}', this.value)">
      </div>
      <div class="actions">
        <button onclick="toggleStatus('${d._id}')">
          ${d.isAvailable ? "Disable" : "Enable"}
        </button>
        <button onclick="deleteDish('${d._id}')">Delete</button>
      </div>
    </div>
  `).join("");
}

async function updatePrice(id, price) {
  await fetch(API_BASE + `/dishes/${id}/price`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ price: Number(price) })
  });
}

async function toggleStatus(id) {
  await fetch(API_BASE + `/dishes/${id}/status`, { method: "PATCH" });
  loadDishes();
}

async function deleteDish(id) {
  if (!confirm("Delete this dish?")) return;
  await fetch(API_BASE + `/dishes/${id}`, { method: "DELETE" });
  loadDishes();
}

function openAddDish() {
  modal.classList.remove("hidden");
}

function closeAddDish() {
  modal.classList.add("hidden");
}

async function saveDish() {
  const payload = {
    restaurantId: restaurantSelect.value,
    name: dishName.value.trim(),
    price: Number(dishPrice.value),
    type: dishType.value,
    image: dishImage.value.trim()
  };

  const res = await fetch(API_BASE + "/dishes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const json = await res.json();
  if (json.success) {
    closeAddDish();
    loadDishes();
  } else {
    alert(json.message);
  }
}

restaurantSelect.onchange = loadDishes;
loadRestaurants();
