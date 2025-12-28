// harshuu-admin/js/orders.js

const table = document.getElementById("ordersTable");

async function loadOrders() {
  const res = await fetch(API_BASE + "/orders");
  const json = await res.json();

  if (!json.success) {
    alert("Failed to load orders");
    return;
  }

  table.innerHTML = json.data.map(o => `
    <tr>
      <td>#${o._id.slice(-6)}</td>
      <td>${o.customer.name || "Customer"}</td>
      <td>${o.restaurant?.name || "-"}</td>
      <td>${o.bill.grandTotal}</td>
      <td>
        <span class="status ${statusClass(o.status)}">${o.status}</span>
      </td>
      <td>
        <select onchange="updateStatus('${o._id}', this.value)">
          ${statusOptions(o.status)}
        </select>
      </td>
    </tr>
  `).join("");
}

function statusClass(status) {
  if (status === "DELIVERED") return "delivered";
  if (status === "CANCELLED") return "cancelled";
  return "pending";
}

function statusOptions(current) {
  const statuses = ["CREATED", "CONFIRMED", "DELIVERED", "CANCELLED"];
  return statuses.map(s =>
    `<option value="${s}" ${s === current ? "selected" : ""}>${s}</option>`
  ).join("");
}

async function updateStatus(orderId, status) {
  const res = await fetch(API_BASE + `/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  const json = await res.json();

  if (json.success) {
    loadOrders();
  } else {
    alert(json.message || "Failed to update status");
  }
}

loadOrders();
