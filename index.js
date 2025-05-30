// Target elements
const container = document.getElementById("products-container");
const baseUrl = "https://fakestoreapi.com/products";
const form = document.getElementById("product-form");
const formMessage = document.getElementById("form-message");
const resetBtn = document.getElementById("reset-all");
const restoreBtn = document.getElementById("restore-products");

// Load saved products or initialize
let localProducts = JSON.parse(localStorage.getItem("products")) || [];

// Save local products to storage
const saveProducts = () => {
    localStorage.setItem("products", JSON.stringify(localProducts));
};

// Create and display a product card
const createProductCard = (item, index, fromLocal = false) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.setAttribute("data-index", index);
    productCard.setAttribute("data-source", fromLocal ? "local" : "api");

    productCard.innerHTML = `
        <img src="${item.image}" alt="${item.title}"/>
        <h2>${item.title}</h2>
        <p>${item.description}</p>
        <p><strong>Price:</strong> $${item.price}</p>
        <p><strong>Brand:</strong> ${item.brand || "N/A"}</p>
        <button class="delete-btn">Delete</button>
    `;

    productCard.querySelector(".delete-btn").addEventListener("click", () => {
        if (fromLocal) {
            localProducts.splice(index, 1);
            saveProducts();
        }
        productCard.remove();
    });

    container.appendChild(productCard);
};

// Fetch products from the API
const fetchProducts = async () => {
    try {
        const response = await fetch(baseUrl);
        const data = await response.json();
        data.forEach((item, index) => createProductCard(item, index, false));
    } catch (error) {
        console.log(error);
    }
};

// Handle form submission
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const titleEl = document.getElementById("title");
    const descriptionEl = document.getElementById("description");
    const imageEl = document.getElementById("image");
    const priceEl = document.getElementById("price");
    const brandEl = document.getElementById("brand");

    const title = titleEl.value.trim();
    const description = descriptionEl.value.trim();
    const image = imageEl.value.trim();
    const price = priceEl.value.trim();
    const brand = brandEl.value.trim();

    let errorMessage = "";

    if (!title || !description || !image || !price) {
        errorMessage = "Please fill out all required fields.";
    } else if (isNaN(price)) {
        errorMessage = "Price must be a valid number.";
    }

    if (errorMessage) {
        formMessage.textContent = errorMessage;
        formMessage.style.color = "red";
        return;
    }

    const newProduct = {
        title,
        description,
        image,
        price: parseFloat(price),
        brand
    };

    localProducts.push(newProduct);
    saveProducts();
    createProductCard(newProduct, localProducts.length - 1, true);
    form.reset();

    formMessage.textContent = "Product added!";
    formMessage.style.color = "green";
    setTimeout(() => {
        formMessage.textContent = "";
    }, 3000);
});

// Reset all products and back them up
resetBtn.addEventListener("click", () => {
    localStorage.setItem("backupProducts", JSON.stringify(localProducts));

    container.innerHTML = "";
    localProducts = [];
    saveProducts();
    fetchProducts();
});

// Restore backed up products
restoreBtn.addEventListener("click", () => {
    const backup = JSON.parse(localStorage.getItem("backupProducts"));
    if (backup && backup.length) {
        localProducts = backup;
        saveProducts();
        container.innerHTML = "";
        fetchProducts();
        loadLocalProducts();

        formMessage.textContent = "Products restored!";
        formMessage.style.color = "green";
    } else {
        formMessage.textContent = "No backup to restore.";
        formMessage.style.color = "red";
    }
});

// Load locally stored products
const loadLocalProducts = () => {
    localProducts.forEach((item, index) => createProductCard(item, index, true));
};

// Init
fetchProducts();
loadLocalProducts();

// Floating emoji and theme switch
const createFloatingEmoji = () => {
    const emoji = document.createElement('div');
    emoji.classList.add('floating-emoji');
    emoji.textContent = Math.random() > 0.5 ? '🌸' : '💖';
    emoji.style.left = Math.random() * window.innerWidth + 'px';
    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), 6000);
};
setInterval(createFloatingEmoji, 800);
document.getElementById('theme-switch').addEventListener('mouseenter', () => {
    document.body.classList.toggle('dark-mode');
});
