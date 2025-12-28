/* ================================
   HARSHUU 2.0 – Orders Admin JS
   Used in orders.html
================================ */

const orderList = document.getElementById("orderList");

/* ================================
   LOAD ORDERS
================================ */
async function loadOrders() {
  orderList.innerHTML = "Loading orders...";

  try {
    const res = await getOrders(); // from api.js
    const orders = res.data;

    if (!orders || orders.length === 0) {
      orderList.innerHTML = "No orders found";
      return;
    }

    orderList.innerHTML = "";

    orders.forEach(o => {
      const div = document.createElement("div");
      div.className = "card";

      let itemsHtml = "";
      o.items.forEach(i => {
        itemsHtml += `<div class="item">• ${i.name} × ${i.quantity}</div>`;
      });

      div.innerHTML = `
        <h3>Order</h3>
        <p><b>Customer:</b> ${o.customer.name}</p>
        <p><b>Mobile:</b> ${o.customer.mobile}</p>
        <p><b>Total:</b> ₹${o.bill?.grandTotal || o.grandTotal}</p>

        <p>Status:
          <span class="${
            o.status === "DELIVERED" ? "status-open" : "status-closed"
          }">
            ${o.status}
          </span>
        </p>

        <select id="status-${o._id}">
          <option value="">Change Status</option>
          <option value="ACCEPTED">ACCEPTED</option>
          <option value="PREPARING">PREPARING</option>
          <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <button onclick="changeStatus('${o._id}')">
          Update Status
        </button>

        <div class="badge">Items</div>
        ${itemsHtml}
      `;

      orderList.appendChild(div);
    });

  } catch (err) {
    orderList.innerHTML = "Error loading orders";
  }
}

/* ================================
   UPDATE ORDER STATUS
================================ */
async function changeStatus(orderId) {
  const status = document.getElementById(`status-${orderId}`).value;

  if (!status) {
    alert("Select status first");
    return;
  }

  if (!confirm("Change order status?")) return;

  try {
    await updateOrderStatus(orderId, status);
    alert("Order status updated");
    loadOrders();
  } catch (err) {}
}

/* ================================
   INIT
================================ */
loadOrders();
