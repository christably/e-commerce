//target our html container or div
//fetch our products from the api
//display the products in the container

const container = document.getElementById("products-container");
const baseUrl = "https://fakestoreapi.com/products";
const form = document.getElementById("product-form");
const formMessage = document.getElementById("form-message");
const resetBtn = document.getElementById("reset-all");

let localProducts = JSON.parse(localStorage.getItem("products")) || [];

const saveProducts = () => {
    localStorage.setItem("products", JSON.stringify(localProducts));
};

const createProductCard = (item, index, fromLocal = false) => {
    let productCard = document.createElement("div");
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

const fetchProducts = async () => {
    try {
        const response = await fetch(baseUrl);
        const data = await response.json();
        data.forEach((item, index) => createProductCard(item, index, false));
    } catch (error) {
        console.log(error);
    }
};

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const image = document.getElementById("image").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const brand = document.getElementById("brand").value.trim();

    if (!title || !description || !image || isNaN(price)) {
        formMessage.textContent = "Please fill all fields correctly.";
        formMessage.style.color = "red";
        return;
    }

    const newProduct = { title, description, image, price, brand };
    localProducts.push(newProduct);
    saveProducts();
    createProductCard(newProduct, localProducts.length - 1, true);

    form.reset();
    formMessage.textContent = "Product added!";
    formMessage.style.color = "green";
});

resetBtn.addEventListener("click", () => {
    container.innerHTML = "";
    localProducts = [];
    saveProducts();
    fetchProducts();
});

const loadLocalProducts = () => {
    localProducts.forEach((item, index) => createProductCard(item, index, true));
};

fetchProducts();
loadLocalProducts();

// Floating emoji + theme switch (keep existing)
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
