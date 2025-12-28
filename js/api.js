/* ================================
   HARSHUU 2.0 – Admin API Helper (UPDATED)
   Single source of truth for ALL admin API calls
   Production-grade, error-safe
================================ */

const API_BASE = "https://harshuu2-backend.onrender.com/api";

/* ================================
   CORE FETCH WRAPPER
================================ */
async function apiRequest(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(API_BASE + endpoint, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

/* ================================
   AUTH (ADMIN)
================================ */
async function adminLogin(payload) {
  return apiRequest("/admin/login", "POST", payload);
}

async function getAdminProfile() {
  return apiRequest("/admin/me");
}

/* ================================
   RESTAURANTS
================================ */
async function getRestaurants() {
  return apiRequest("/restaurants");
}

async function getRestaurantById(id) {
  return apiRequest(`/restaurants/${id}`);
}

async function addRestaurant(payload) {
  return apiRequest("/admin/restaurant", "POST", payload);
}

async function updateRestaurant(id, payload) {
  return apiRequest(`/restaurants/${id}`, "PATCH", payload);
}

async function toggleRestaurantStatus(id) {
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

async function toggleDishStatus(id) {
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

async function getOrderById(id) {
  return apiRequest(`/orders/${id}`);
}

async function updateOrderStatus(id, status) {
  return apiRequest(`/orders/${id}/status`, "PATCH", { status });
}

/* ================================
   PAYMENT / SETTINGS
================================ */
async function getPaymentSettings() {
  return apiRequest("/settings");
}

async function savePaymentSettings(payload) {
  return apiRequest("/admin/settings/qr", "POST", payload);
}

/* ================================
   DASHBOARD HELPERS
================================ */
async function getDashboardStats() {
  const [restaurantsRes, ordersRes] = await Promise.all([
    getRestaurants(),
    getOrders()
  ]);

  const restaurants = restaurantsRes.data || [];
  const orders = ordersRes.data || [];

  const totalRestaurants = restaurants.length;
  const activeRestaurants = restaurants.filter(r => r.isActive).length;
  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.bill?.grandTotal || 0),
    0
  );

  return {
    totalRestaurants,
    activeRestaurants,
    totalOrders,
    totalRevenue,
    recentOrders: orders.slice(0, 5)
  };
}
