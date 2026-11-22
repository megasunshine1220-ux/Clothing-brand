const STORAGE_KEY = "aure-bag-v1";

function readSavedItems() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved)
      ? saved.filter(item => item && Number.isFinite(item.id) && Number.isFinite(item.price) &&
          typeof item.name === "string" && typeof item.size === "string" &&
          Number.isFinite(item.quantity) && item.quantity > 0)
      : [];
  } catch {
    return [];
  }
}

export function createCart({ onChange }) {
  const items = readSavedItems();

  const publish = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
    onChange([...items]);
  };

  const add = (product, size = "M") => {
    if (!product || !Number.isFinite(product.id) || !size) return;
    const found = items.find(item => item.id === product.id && item.size === size);
    if (found) found.quantity += 1;
    else items.push({ ...product, size, quantity: 1 });
    publish();
  };

  const remove = (id, size) => {
    const index = items.findIndex(item => item.id === id && item.size === size);
    if (index >= 0) items.splice(index, 1);
    publish();
  };

  const count = () => items.reduce((sum, item) => sum + item.quantity, 0);
  const total = () => items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { items, add, remove, count, total };
}