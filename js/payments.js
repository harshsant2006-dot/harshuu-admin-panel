// harshuu-admin/js/payments.js
const qrPreview = document.getElementById("qrPreview");
const upiQrImage = document.getElementById("upiQrImage");
const platformFee = document.getElementById("platformFee");
const handlingCharge = document.getElementById("handlingCharge");
const deliveryFeePerKm = document.getElementById("deliveryFeePerKm");
const gstPercentage = document.getElementById("gstPercentage");
const saveBtn = document.getElementById("saveSettings");

async function loadSettings() {
  const res = await fetch(API_BASE + "/settings");
  const json = await res.json();
  if (!json.success) return;

  const d = json.data;
  qrPreview.src = d.upiQrImage;
  upiQrImage.value = d.upiQrImage;
  platformFee.value = d.platformFee;
  handlingCharge.value = d.handlingCharge;
  deliveryFeePerKm.value = d.deliveryFeePerKm;
  gstPercentage.value = d.gstPercentage;
}

saveBtn.onclick = async () => {
  const payload = {
    upiQrImage: upiQrImage.value.trim(),
    platformFee: Number(platformFee.value),
    handlingCharge: Number(handlingCharge.value),
    deliveryFeePerKm: Number(deliveryFeePerKm.value),
    gstPercentage: Number(gstPercentage.value)
  };

  const res = await fetch(API_BASE + "/settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const json = await res.json();
  if (json.success) {
    alert("Payment settings saved successfully");
    loadSettings();
  } else {
    alert(json.message || "Failed to save settings");
  }
};

loadSettings();
