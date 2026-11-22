import { createShowroom } from "./3d-scene.js";
import { products } from "./products.js";
import { createCart } from "./cart.js";

const $ = (selector) => document.querySelector(selector);
const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
}).format(value);

let entered = false;
let department = "All";
let activeProduct = null;
let scrollProgress = 0;
let touchY = null;
let toastTimer;

const showroom = createShowroom($("#showroom-canvas"), openProduct);

function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 2200);
}

function showDirectory() {
  entered = true;
  department = "All";
  document.querySelectorAll("[data-department]").forEach(button => {
    button.classList.remove("active");
    button.setAttribute("aria-pressed", "false");
  });
  scrollProgress = 1;
  showroom.setProgress(1);
  showroom.clearDepartment();
  $("#welcome-panel").classList.add("hidden");
  $("#world-status").textContent = "02 — INSIDE THE AURÉ BOUTIQUE";
}

function enter() {
  if (!entered) showDirectory();
}

window.navigateToDepartment = choose;
window.navigateToMain = () => {
  showDirectory();
  
};

function choose(name) {
  const valid = ["Men", "Women", "Dresses", "Tops", "Bottoms", "Essentials"];
  if (!valid.includes(name)) return;
  entered = true;
  scrollProgress = 1;
  department = name;
  $("#welcome-panel").classList.add("hidden");
  $("#world-status").textContent = "03 — " + name.toUpperCase() + " ROOM";
  document.querySelectorAll("[data-department]").forEach(button => {
    button.classList.toggle("active", button.dataset.department === name);
    button.setAttribute("aria-pressed", button.dataset.department === name ? "true" : "false");
  });
  showroom.setProgress(1);
  showroom.setDepartment(name);
}

function openProduct(id) {
  activeProduct = products.find((item) => item.id === id);
  if (!activeProduct) return;

  $("#modal-image").src = activeProduct.image;
  $("#modal-name").textContent = activeProduct.name;
  $("#modal-price").textContent = money(activeProduct.price);
  $("#modal-category").textContent = activeProduct.category + " / AURÉ EDIT";
  $("#modal-description").textContent = activeProduct.description;

  const quality = activeProduct.quality || {};
  $("#modal-quality").innerHTML =
    '<div class="quality-heading"><span>FABRIC & CONSTRUCTION</span><small>DEMO SPECIFICATION</small></div>' +
    [["Fabric", quality.fabric], ["Yarn / thread", quality.yarn], ["Weave", quality.weave],
      ["Feel", quality.feel], ["Weight", quality.weight], ["Finish", quality.finish],
      ["Fit", quality.fit], ["Care", quality.care]]
      .map(([label, value]) => `<div class="quality-row"><span>${label}</span><strong>${value || "To be confirmed"}</strong></div>`)
      .join("") +
    '<p class="quality-note">Illustrative demo details, not verified supplier or laboratory claims.</p>';

  $("#modal-size").value = "";
  $("#product-modal").classList.add("open");
  document.body.classList.add("lock");
}

function closeProduct() {
  $("#product-modal").classList.remove("open");
  document.body.classList.remove("lock");
}

let cart;
function updateBag() {
  $("#bag-count").textContent = cart.count();
  $("#drawer-count").textContent = "(" + cart.count() + ")";
  $("#bag-subtotal").textContent = money(cart.total());
  $("#bag-items").innerHTML = cart.items.length
    ? cart.items.map((item) => `
      <div class="bag-row">
        <img src="${item.image}" alt="">
        <div><strong>${item.name}</strong><p>Size: ${item.size} · Qty: ${item.quantity}</p>
          <strong>${money(item.price * item.quantity)}</strong></div>
        <button data-remove="${item.id}" data-size="${item.size}">REMOVE</button>
      </div>`).join("")
    : '<div class="empty-bag">Your bag is empty.</div>';
}
cart = createCart({ onChange: updateBag });

document.querySelectorAll("[data-department]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    choose(button.dataset.department);
  });
});

document.addEventListener("click", (event) => {
  const productButton = event.target.closest("[data-product]");
  if (productButton) {
    openProduct(Number(productButton.dataset.product));
    return;
  }

  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    const item = products.find((product) => product.id === Number(addButton.dataset.add));
    if (item) {
      cart.add(item, "M");
      toast("Added to bag · size M");
    }
    return;
  }

  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) cart.remove(Number(removeButton.dataset.remove), removeButton.dataset.size);
  if (event.target.closest("[data-close-modal]")) closeProduct();
});

$("#enter-shop").addEventListener("click", enter);
$("#main-shop").addEventListener("click", window.navigateToMain);

$("#back-departments").addEventListener("click", () => {
  
  try { showroom.clearDepartment(); } catch (error) { console.error(error); }
  
  $("#world-status").textContent = "02 — INSIDE THE AURÉ BOUTIQUE";
  document.querySelectorAll("[data-department]").forEach((button) => {
    button.classList.remove("active");
    button.setAttribute("aria-pressed", "false");
  });
});

$("#brand-home").addEventListener("click", (event) => {
  event.preventDefault();
  entered = false;
  department = "All";
  scrollProgress = 0;
  try { showroom.clearDepartment(); showroom.setProgress(0); } catch (error) { console.error(error); }
  $("#welcome-panel").classList.remove("hidden");
  
  
  
  $("#world-status").textContent = "01 — OUTSIDE THE AURÉ BOUTIQUE";
  document.querySelectorAll("[data-department]").forEach((button) => {
    button.classList.remove("active");
    button.setAttribute("aria-pressed", "false");
  });
});

function driveScroll(delta) {
  if (Math.abs(delta) < 2) return;
  scrollProgress = Math.max(0, Math.min(1, scrollProgress + delta / 850));
  showroom.setProgress(scrollProgress);

  if (scrollProgress > .28) {
    if (!entered) showDirectory();
  } else if (scrollProgress <= .08) {
    entered = false;
    $("#welcome-panel").classList.remove("hidden");
    
    
    $("#world-status").textContent = "01 — OUTSIDE THE AURÉ BOUTIQUE";
  }
}

window.addEventListener("wheel", (event) => {
  if (!$("#bag-drawer").classList.contains("open") && !$("#product-modal").classList.contains("open")) {
    event.preventDefault();
    driveScroll(event.deltaY);
  }
}, { passive: false });

window.addEventListener("touchstart", (event) => { touchY = event.touches[0].clientY; }, { passive: true });
window.addEventListener("touchmove", (event) => {
  if (touchY === null || $("#bag-drawer").classList.contains("open") || $("#product-modal").classList.contains("open")) return;
  const nextY = event.touches[0].clientY;
  driveScroll(touchY - nextY);
  touchY = nextY;
  event.preventDefault();
}, { passive: false });
window.addEventListener("touchend", () => { touchY = null; }, { passive: true });

window.addEventListener("keydown", (event) => {
  if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
  if (["ArrowDown", "PageDown", " "].includes(event.key) && !$("#product-modal").classList.contains("open")) {
    driveScroll(187);
  } else if (["ArrowUp", "PageUp"].includes(event.key)) {
    driveScroll(-187);
  }
});

$("#bag-open").addEventListener("click", () => {
  $("#bag-drawer").classList.add("open");
  $("#drawer-backdrop").classList.add("open");
  document.body.classList.add("lock");
});

function closeBag() {
  $("#bag-drawer").classList.remove("open");
  $("#drawer-backdrop").classList.remove("open");
  document.body.classList.remove("lock");
}
$("#bag-close").addEventListener("click", closeBag);
$("#drawer-backdrop").addEventListener("click", closeBag);

$("#modal-add").addEventListener("click", () => {
  const size = $("#modal-size").value;
  if (!size) return toast("Select a size first");
  cart.add(activeProduct, size);
  closeProduct();
  toast("Added to bag");
});

$("#checkout-button").addEventListener("click", () => toast("Demo checkout — payment not connected"));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeBag();
    closeProduct();
  }
});

updateBag();
