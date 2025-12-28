// harshuu-admin/js/restaurants.js

const grid = document.getElementById("restaurantGrid");
const modal = document.getElementById("restaurantModal");
const modalTitle = document.getElementById("modalTitle");

const resName = document.getElementById("resName");
const resImage = document.getElementById("resImage");
const resAddress = document.getElementById("resAddress");

let editId = null;

async function loadRestaurants() {
  const res = await fetch(API_BASE + "/restaurants");
  const json = await res.json();
  if (!json.success) return;

  grid.innerHTML = json.data.map(r => `
    <div class="card">
      <img src="${r.image}" style="width:100%;height:140px;object-fit:cover">
      <h4>${r.name}</h4>
      <span class="status ${r.isActive ? "delivered" : "cancelled"}">
        ${r.isActive ? "OPEN" : "CLOSED"}
      </span>
      <div class="actions">
        <button onclick="toggleStatus('${r._id}')">
          ${r.isActive ? "Close" : "Open"}
        </button>
        <button onclick="editRestaurant('${r._id}','${r.name}','${r.image}','${r.address || ""}')">
          Edit
        </button>
        <button onclick="deleteRestaurant('${r._id}')">Delete</button>
      </div>
    </div>
  `).join("");
}

function openAddRestaurant() {
  editId = null;
  modalTitle.innerText = "Add Restaurant";
  resName.value = "";
  resImage.value = "";
  resAddress.value = "";
  modal.classList.remove("hidden");
}

function editRestaurant(id, name, image, address) {
  editId = id;
  modalTitle.innerText = "Edit Restaurant";
  resName.value = name;
  resImage.value = image;
  resAddress.value = address;
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

async function saveRestaurant() {
  const payload = {
    name: resName.value.trim(),
    image: resImage.value.trim(),
    address: resAddress.value.trim()
  };

  if (!payload.name || !payload.image) {
    alert("Name and image are required");
    return;
  }

  const url = editId
    ? API_BASE + `/restaurants/${editId}`
    : API_BASE + "/restaurants";

  const method = editId ? "PATCH" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const json = await res.json();
  if (!json.success) {
    alert(json.message || "Failed");
    return;
  }

  closeModal();
  loadRestaurants();
}

async function toggleStatus(id) {
  await fetch(API_BASE + `/restaurants/${id}/status`, {
    method: "PATCH"
  });
  loadRestaurants();
}

async function deleteRestaurant(id) {
  if (!confirm("Delete restaurant and all dishes?")) return;
  await fetch(API_BASE + `/restaurants/${id}`, {
    method: "DELETE"
  });
  loadRestaurants();
}

loadRestaurants();
