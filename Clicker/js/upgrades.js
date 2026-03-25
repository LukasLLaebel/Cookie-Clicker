import { cookie } from "./cookies.js";

let upgrades = [];

class Upgrade {
  constructor(data) {
    Object.assign(this, data);
  }

  render() {
    const div = document.createElement("div");
    div.classList.add("upgrade");
    div.id = `upgrade-${this.id}`;

    div.innerHTML = `
      <img src="./assets/upgrades/${this.name.replaceAll(" ", "-")}.webp" alt="${this.name}">
      
      <div class="upgradeInfo">
        <p>${this.name}</p>
        <p id="price-${this.id}">${Math.floor(this.currentPrice)}</p>
      </div>

      <p id="count-${this.id}">${this.count}</p>
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

      this.currentPrice = Math.floor(
        this.price * Math.pow(1.15, this.count)
      );

      updateUI(this);
    }
  }

  getCPS() {
    return this.count * this.multiplier;
  }
}

// ✅ LOAD FROM JSON
async function loadProducts() {
  try {
    const response = await fetch("./assets/upgrades.json");

    if (!response.ok) {
      throw new Error("Failed to load JSON");
    }

    const data = await response.json();

    // IMPORTANT: ensure fields exist
    upgrades = data.upgrade.map(p =>
      new Product({
        ...p,
        currentPrice: p.currentPrice ?? p.price,
        count: p.count ?? 0
      })
    );

    renderShop();
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

function renderShop() {
  const upgradeShop = document.getElementById("upgrades");
  upgradeShop.innerHTML = "";


  upgrades.forEach(upgrade => {
    if (upgrade.unlocked) {
      shop.appendChild(upgrade.render());
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

// loop
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

// init
loadProducts();
