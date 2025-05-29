//target our html container or div
//fetch our products from the api
//display the products in the container

const container = document.getElementById("products-container");
const baseUrl = "https://fakestoreapi.com/products";

const fetchProducts = async () => {
    try {
        const response = await fetch(baseUrl, { method: "GET" });
        console.log(response);
        const data = await response.json()
        displayData(data)
    }   catch (error) {
        console.log(error);      
    }   finally{
        console.log("");
    }
}; 


const displayData = (data) => {
    console.log(data);
    const item = data[0];
   //loopp over the data array
   //create a card element for each item
   //append that item to the container

   data.forEach((item, index) => {
    let productCard =document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
    <img src=${item.image} alt${item.title}/>
    <h2>${item.title}</h2>
    <p>${item.description}<p>
    `;

            container.appendChild(productCard);
   });
};

    fetchProducts();



    const createFloatingEmoji = () => {
    const emoji = document.createElement('div');
    emoji.classList.add('floating-emoji');
    emoji.textContent = Math.random() > 0.5 ? '🌸' : '💖';
    emoji.style.left = Math.random() * window.innerWidth + 'px';
    document.body.appendChild(emoji);

    setTimeout(() => {
        emoji.remove();
    }, 6000);
};

// Start generating emojis every 800ms
setInterval(createFloatingEmoji, 800);

const themeToggle = document.getElementById('theme-switch');

themeToggle.addEventListener('mouseenter', () => {
    document.body.classList.toggle('dark-mode');
});
