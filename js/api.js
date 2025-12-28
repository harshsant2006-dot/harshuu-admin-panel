/* ================================
   HARSHUU 2.0 – Admin API Helper
   One place for all backend calls
================================ */

const API_BASE = "https://harshuu2-backend.onrender.com/api";

/* ================================
   COMMON FETCH FUNCTION
================================ */
async function apiRequest(url, method = "GET", body = null) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(API_BASE + url, options);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "API Error");
    }

    return data;
  } catch (error) {
    alert(error.message);
    throw error;
  }
}

/* ================================
   RESTAURANTS
================================ */
async function getRestaurants() {
  return apiRequest("/restaurants");
}

async function addRestaurant(payload) {
  return apiRequest("/admin/restaurant", "POST", payload);
}

async function toggleRestaurant(id) {
  return apiRequest(`/admin/restaurant/${id}/status`, "PATCH");
}

async function deleteRestaurant(id) {
  return apiRequest(`/admin/restaurant/${id}`, "DELETE");
}

/* ================================
   DISHES
================================ */
async function getDishesByRestaurant(restaurantId) {
  return apiRequest(`/dishes/restaurant/${restaurantId}`);
}

async function addDish(payload) {
  return apiRequest("/admin/dish", "POST", payload);
}

async function updateDishPrice(id, price) {
  return apiRequest(`/admin/dish/${id}/price`, "PATCH", { price });
}

async function toggleDish(id) {
  return apiRequest(`/dishes/${id}/status`, "PATCH");
}

async function deleteDish(id) {
  return apiRequest(`/admin/dish/${id}`, "DELETE");
}

/* ================================
   ORDERS
================================ */
async function getOrders() {
  return apiRequest("/orders");
}

async function updateOrderStatus(id, status) {
  return apiRequest(`/orders/${id}/status`, "PATCH", { status });
}

/* ================================
   SETTINGS
================================ */
async function getSettings() {
  return apiRequest("/settings");
}

async function saveSettings(payload) {
  return apiRequest("/admin/settings/qr", "POST", payload);
}
