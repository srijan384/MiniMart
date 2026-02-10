const API_URL = "/api/sneakers";


// ---------------- ADD TO CART ----------------
function addToCart(name, price, image) {
    console.log("Attempting to add:", name);

    fetch('/add_to_cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, image })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success:", data);
        alert("Added to Cart: " + name);

        // update cart counter
        const counter = document.querySelector('.icons span');
        if (counter) counter.innerText = data.count;
    })
    .catch(error => {
        console.error('Cart Error:', error);
        alert("Error adding to cart.");
    });
}


// ---------------- LOAD SNEAKERS ----------------
async function loadSneakers() {
    try {
        const res = await fetch(API_URL);

        // stop crash if API fails
        if (!res.ok) {
            throw new Error("API returned status " + res.status);
        }

        const data = await res.json();

        const grid = document.getElementById("product-grid");
        if (!grid) return;

        grid.innerHTML = "";

        data.slice(0, 8).forEach(shoe => {

            const price = shoe.retailPrice || Math.floor(Math.random()*10000)+5000;
            const image = shoe.image || "/static/assets/images/shoe1.webp";
            const name = shoe.name || "Sneaker";

            const card = document.createElement("div");
            card.className = "product";

            card.innerHTML = `
    <a href="/product/${shoe.id}">
        <img src="${image}" alt="${name}">
    </a>
    <h3>${name}</h3>
    <p>₹${price.toLocaleString()}</p>
    <button class="cart-btn">Add to Cart</button>
`;

            card.querySelector(".cart-btn").addEventListener("click", () => {
                addToCart(name, price, image);
            });

            grid.appendChild(card);
        });

    } catch (error) {
        console.error("API failed:", error);

        // show user friendly message
        const grid = document.getElementById("product-grid");
        if (grid) {
            grid.innerHTML = "<p style='color:red'>Failed to load sneakers. Please refresh.</p>";
        }
    }
}


// Run after page loads
document.addEventListener("DOMContentLoaded", loadSneakers);