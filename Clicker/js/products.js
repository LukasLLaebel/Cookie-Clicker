import { cookie } from "./cookies.js";
import { saveProductsToLocalStorage, loadProductsFromLocalStorage } from "./saveCookie.js";

export let products = [];

class Product {
  constructor(data) {
    Object.assign(this, data);
  }

  render() {
    //loadProductsFromLocalStorage();
    const div = document.createElement("div");
    div.classList.add("product");
    div.id = `product-${this.id}`;

    div.innerHTML = `
      <img src="./assets/products/${this.name.replaceAll(" ", "")}IconTransparent.webp" alt="${this.name}">
      
      <div class="productInfo">
        <p class="productName">${this.name}</p>
        <p class="productPrice" id="price-${this.id}">${Math.floor(this.currentPrice)}</p>
      </div>

      <p class="productCount" id="count-${this.id}">${this.count}</p>
    `;

    div.addEventListener("click", () => this.buy());

    return div;
  }

  buy() {
    let cookies = cookie.getCount();
    if (cookies >= this.currentPrice) {
      cookies -= this.currentPrice;
      cookie.setCount(cookies);
      this.count++;

      this.currentPrice = Math.ceil(
        this.price * Math.pow(1.15, this.count)
      );

      updateUI(this);

      // Unlock next product if this is the first purchase
      if (this.count === 1) {
        const nextProduct = products.find(p => p.id === this.id + 1);
        if (nextProduct) {
          nextProduct.unlocked = true;
          renderShop();
        }
      }
      saveProductsToLocalStorage();
    }
  }

  getCPS() {
    return this.count * this.multiplier;
  }
}

async function loadProducts() {
  try {
    const response = await fetch("./assets/products.json");

    if (!response.ok) {
      throw new Error("Failed to load JSON");
    }

    const data = await response.json();

    products = data.products.map(p =>
      new Product({
        ...p,
        currentPrice: p.currentPrice ?? p.price,
        count: p.count ?? 0
      })
    );

    loadProductsFromLocalStorage();

    renderShop();
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

function renderShop() {
  const shop = document.getElementById("shop");
  const upgrades = document.getElementById("upgrades");
  shop.innerHTML = "";
  if (upgrades) shop.appendChild(upgrades);


  products.forEach(product => {
    if (product.unlocked) {
      shop.appendChild(product.render());
    }
  });
}

function updateUI(product) {
  document.getElementById(`price-${product.id}`).textContent =
    Math.floor(product.currentPrice);

  document.getElementById(`count-${product.id}`).textContent =
    product.count;
}

// button
document.getElementById("cookieBtn").addEventListener("click", () => {
  cookie.increment();
});

setInterval(() => {
  let totalCPS = products.reduce(
    (sum, product) => sum + product.getCPS(),
    0
  );

  document.getElementById("cps").textContent =
    `per second: ${totalCPS.toFixed(1)}`;

  let current = cookie.getCount();
  let newValue = current + totalCPS / 10;

  newValue = Math.round(newValue * 1000) / 1000;

  cookie.setCount(newValue);
}, 100);

loadProducts();
