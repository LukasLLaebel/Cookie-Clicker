import { cookie } from "./cookies.js";
import { products } from "./products.js";

export function updateCookieAndDisplay() {
  document.cookie = `cookies=${Math.floor(cookie.getCount())};expires=25 Mar 2026 15:00 UTC;path=/`;
  // DEBUG
  //document.getElementById("cookieDisplay").textContent = document.cookie;
}

export function saveProductsToLocalStorage() {
  const productState = products.map(p => ({
    id: p.id,
    count: p.count,
    unlocked: p.unlocked,
    currentPrice: p.currentPrice
  }));
  localStorage.setItem("products", JSON.stringify(productState));
}

export function loadProductsFromLocalStorage() {
  const saved = localStorage.getItem("products");
  if (saved) {
    try {
      const savedProducts = JSON.parse(saved);
      savedProducts.forEach(savedProduct => {
        const product = products.find(p => p.id === savedProduct.id);
        if (product) {
          product.count = savedProduct.count;
          product.unlocked = savedProduct.unlocked;
          product.currentPrice = savedProduct.currentPrice;
        }
      });
    } catch (e) {
    }
  }
}

