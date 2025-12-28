// harshuu-admin/js/dashboard.js

const totalRestaurantsEl = document.getElementById("totalRestaurants");
const activeRestaurantsEl = document.getElementById("activeRestaurants");
const totalOrdersEl = document.getElementById("totalOrders");
const totalRevenueEl = document.getElementById("totalRevenue");
const recentOrdersEl = document.getElementById("recentOrders");

async function loadDashboard() {
  const [resRes, resOrders] = await Promise.all([
    fetch(API_BASE + "/restaurants"),
    fetch(API_BASE + "/orders")
  ]);

  const restaurantsJson = await resRes.json();
  const ordersJson = await resOrders.json();

  if (!restaurantsJson.success || !ordersJson.success) return;

  const restaurants = restaurantsJson.data;
  const orders = ordersJson.data;

  totalRestaurantsEl.innerText = restaurants.length;
  activeRestaurantsEl.innerText =
    restaurants.filter(r => r.isActive).length;

  totalOrdersEl.innerText = orders.length;

  const revenue = orders.reduce(
    (sum, o) => sum + (o.bill?.grandTotal || 0),
    0
  );
  totalRevenueEl.innerText = "₹" + revenue.toFixed(2);

  recentOrdersEl.innerHTML = orders
    .slice(0, 5)
    .map(o => `
      <tr>
        <td>#${o._id.slice(-6)}</td>
        <td>${o.restaurant?.name || "-"}</td>
        <td>₹${o.bill?.grandTotal || 0}</td>
        <td>
          <span class="status ${
            o.status === "DELIVERED"
              ? "delivered"
              : o.status === "CANCELLED"
              ? "cancelled"
              : "pending"
          }">
            ${o.status}
          </span>
        </td>
      </tr>
    `)
    .join("");
}

loadDashboard();
