import { createShowroom } from "./3d-scene.js";
import { setupScrollJourney } from "./scroll-animation.js";
import { products } from "./products.js";
import { createCart } from "./cart.js";

const $ = (selector) => document.querySelector(selector);
const grid = $("#product-grid");
const toast = $("#toast");
const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
}).format(value);

let activeProduct = null;
let toastTimer;
let activeFilter = "All";

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function matchesDepartment(product, department) {
  if (department === "All") return true;
  if (department === "Men" || department === "Women") return product.category === department;
  if (department === "Essentials") return product.category === "Essentials";
  return product.type === department;
}

function renderProducts(department = activeFilter) {
  activeFilter = department;
  const visible = products.filter(product => matchesDepartment(product, department));
  grid.innerHTML = visible.length ? visible.map(product => `
    <article class="product-card">
      <div class="product-photo" data-product="${product.id}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-label">${product.badge}</span>
      </div>
      <div class="product-info">
        <div><div class="product-name">${product.name}</div><div class="product-kind">${product.kind}</div></div>
        <div class="product-price">${money(product.price)}</div>
      </div>
      <button class="add-button" data-add="${product.id}">QUICK ADD +</button>
    </article>`).join("") : '<p class="empty-products">This department is being prepared. Please explore another collection.</p>';
  $("#filters").querySelectorAll("[data-filter]").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === department);
  });
  const title = $("#products-title");
  if (title) title.textContent = department === "All" ? "Shop the edit." : department + " collection.";
}

function chooseDepartment(department, shouldScroll = true) {
  if (!["Men", "Women", "Dresses", "Tops", "Bottoms", "Essentials", "All"].includes(department)) return;
  renderProducts(department);
  if (shouldScroll) $("#products").scrollIntoView({ behavior: "smooth", block: "start" });
}

renderProducts("All");

document.addEventListener("click", event => {
  const departmentLink = event.target.closest("[data-department]");
  if (departmentLink) {
    event.preventDefault();
    chooseDepartment(departmentLink.dataset.department);
    return;
  }
  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) {
    event.preventDefault();
    chooseDepartment(filterButton.dataset.filter, false);
  }
});

const cart = createCart({ onChange: renderBag });

function renderBag() {
  $("#bag-count").textContent = cart.count();
  $("#drawer-count").textContent = "(" + cart.count() + ")";
  $("#bag-subtotal").textContent = money(cart.total());
  $("#bag-items").innerHTML = cart.items.length ? cart.items.map(item => `
    <div class="bag-row">
      <img src="${item.image}" alt="">
      <div><strong>${item.name}</strong><p>Size: ${item.size} · Qty: ${item.quantity}</p><strong>${money(item.price * item.quantity)}</strong></div>
      <button data-remove="${item.id}" data-size="${item.size}">REMOVE</button>
    </div>`).join("") : '<div class="empty-bag">Your bag is waiting for something considered.</div>';
}

function openBag() {
  $("#bag-drawer").classList.add("open");
  $("#drawer-backdrop").classList.add("open");
  document.body.classList.add("lock");
  $("#bag-drawer").setAttribute("aria-hidden", "false");
}
function closeBag() {
  $("#bag-drawer").classList.remove("open");
  $("#drawer-backdrop").classList.remove("open");
  document.body.classList.remove("lock");
  $("#bag-drawer").setAttribute("aria-hidden", "true");
}
$("#bag-open").addEventListener("click", openBag);
$("#bag-close").addEventListener("click", closeBag);
$("#drawer-backdrop").addEventListener("click", closeBag);

grid.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    const product = products.find(item => item.id === Number(addButton.dataset.add));
    if (product) { cart.add(product, "M"); notify(product.name + " added to your bag (size M)"); }
    return;
  }
  const photo = event.target.closest("[data-product]");
  if (photo) showProduct(Number(photo.dataset.product));
});
$("#bag-items").addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");
  if (button) cart.remove(Number(button.dataset.remove), button.dataset.size);
});

function showProduct(id) {
  activeProduct = products.find(product => product.id === id);
  if (!activeProduct) return;
  $("#modal-image").src = activeProduct.image;
  $("#modal-image").alt = activeProduct.name;
  $("#modal-category").textContent = activeProduct.category + " / AURÉ EDIT";
  $("#modal-name").textContent = activeProduct.name;
  $("#modal-price").textContent = money(activeProduct.price);
  $("#modal-description").textContent = activeProduct.description;
  $("#modal-size").value = "";
  $("#product-modal").classList.add("open");
  $("#product-modal").setAttribute("aria-hidden", "false");
  document.body.classList.add("lock");
}
function closeProduct() {
  $("#product-modal").classList.remove("open");
  $("#product-modal").setAttribute("aria-hidden", "true");
  document.body.classList.remove("lock");
}
$("#product-modal").addEventListener("click", event => {
  if (event.target.hasAttribute("data-close-modal")) closeProduct();
});
$("#modal-add").addEventListener("click", () => {
  const size = $("#modal-size").value;
  if (!size) { notify("Please select a size first."); return; }
  if (!activeProduct) return;
  cart.add(activeProduct, size);
  closeProduct();
  notify(activeProduct.name + " added to your bag.");
});
$("#checkout-button").addEventListener("click", () => notify("Checkout is a demo; online payment is not connected."));
$("#newsletter-form").addEventListener("submit", event => {
  event.preventDefault();
  $("#newsletter-note").textContent = "Thank you — you are on the AURÉ list.";
  event.target.reset();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") { closeBag(); closeProduct(); }
});

try {
  const showroom = createShowroom($("#showroom-canvas"));
  setupScrollJourney({
    journey: $("#journey"),
    onProgress: progress => {
      showroom.setProgress(progress);
      $("#progress-bar").style.width = (progress * 100) + "%";
      $("#journey-caption").textContent = progress > .72 ? "02 — INSIDE THE AURÉ SHOP" : "01 — THE AURÉ ENTRANCE";
      $("#entrance-signs").classList.toggle("visible", progress > .38 && progress < .82);
    }
  });
} catch (error) {
  console.error("AURÉ showroom could not start:", error);
  $("#showroom-canvas").style.background = "#29211b";
  notify("3D view unavailable on this device. The clothing shop is still available.");
}
renderBag();