const products = [
    {id: 1, name: "iPhone 15", category: "Mobiles", price: 59999, icon: "📱"},
    {id: 2, name: "Samsung Galaxy S24", category: "Mobiles", price: 74999, icon: "📱"},
    {id: 3, name: "HP Pavilion", category: "Laptops", price: 65999, icon: "💻"},
    {id: 4, name: "MacBook Air", category: "Laptops", price: 99999, icon: "💻"},
    {id: 5, name: "Apple Watch", category: "Watches", price: 42999, icon: "⌚"},
    {id: 6, name: "Running Shoes", category: "Shoes", price: 2499, icon: "👟"},
    {id: 7, name: "Headphones", category: "Accessories", price: 2999, icon: "🎧"},
    {id: 8, name: "Smart Backpack", category: "Accessories", price: 1999, icon: "🎒"}
];

let cart = JSON.parse(localStorage.getItem("ecwCart")) || [];
let orders = JSON.parse(localStorage.getItem("ecwOrders")) || [];

function saveData() {
    localStorage.setItem("ecwCart", JSON.stringify(cart));
    localStorage.setItem("ecwOrders", JSON.stringify(orders));
}

function showSection(id) {

    document.querySelectorAll("main section").forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(id).classList.remove("hidden");

    if (id === "products") displayProducts();
    if (id === "cart") displayCart();
    if (id === "checkout") displayCheckout();
    if (id === "orders") displayOrders();
}

function displayProducts() {

    const search = document.getElementById("search").value.toLowerCase();
    const category = document.getElementById("category").value;

    const list = products.filter(product => {

        const matchSearch =
            product.name.toLowerCase().includes(search);

        const matchCategory =
            category === "All" ||
            product.category === category;

        return matchSearch && matchCategory;
    });

    document.getElementById("productList").innerHTML =
        list.map(product => `
            <div class="product">

                <div class="product-image">
                    ${product.icon}
                </div>

                <h3>${product.name}</h3>

                <p>${product.category}</p>

                <div class="price">
                    ₹${product.price.toLocaleString("en-IN")}
                </div>

                <button class="btn"
                    onclick="addToCart(${product.id})">
                    Add to Cart
                </button>

            </div>
        `).join("");
}

function addToCart(id) {

    const product = products.find(p => p.id === id);

    const item = cart.find(p => p.id === id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            icon: product.icon,
            quantity: 1
        });
    }

    saveData();
    updateCartCount();

    alert(product.name + " added to cart!");
}

function updateCartCount() {

    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    document.getElementById("cartCount").textContent = count;
}

function displayCart() {

    const list = document.getElementById("cartList");
    const totalBox = document.getElementById("cartTotal");

    if (cart.length === 0) {

        list.innerHTML = "<p>Your cart is empty.</p>";
        totalBox.innerHTML = "";

        return;
    }

    list.innerHTML = cart.map(item => `
        <div class="cart-item">

            <div>
                <b>${item.icon} ${item.name}</b>
                <p>₹${item.price.toLocaleString("en-IN")}</p>
            </div>

            <div class="quantity">
                <button onclick="changeQuantity(${item.id}, -1)">
                    -
                </button>

                ${item.quantity}

                <button onclick="changeQuantity(${item.id}, 1)">
                    +
                </button>
            </div>

            <b>
                ₹${(item.price * item.quantity)
                    .toLocaleString("en-IN")}
            </b>

            <button class="remove"
                onclick="removeItem(${item.id})">
                Remove
            </button>

        </div>
    `).join("");

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    totalBox.innerHTML = `
        <h3>Total: ₹${subtotal.toLocaleString("en-IN")}</h3>
        <br>
        <button class="btn"
            onclick="showSection('checkout')">
            Proceed to Checkout
        </button>
    `;
}

function changeQuantity(id, amount) {

    const item = cart.find(p => p.id === id);

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }

    saveData();
    updateCartCount();
    displayCart();
}

function removeItem(id) {

    cart = cart.filter(item => item.id !== id);

    saveData();
    updateCartCount();
    displayCart();
}

function displayCheckout() {

    if (cart.length === 0) {
        document.getElementById("checkout").innerHTML =
            "<h1>Your cart is empty.</h1>";
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    document.getElementById("checkoutTotal").textContent =
        "Total: ₹" + total.toLocaleString("en-IN");
}

document.getElementById("checkoutForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const order = {
        id: "ECW" + Date.now(),
        date: new Date().toLocaleString("en-IN"),
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        pincode: document.getElementById("pincode").value,
        items: [...cart],
        total: total,
        payment: "Cash on Delivery",
        status: "Confirmed"
    };

    orders.push(order);

    cart = [];

    saveData();
    updateCartCount();

    this.reset();

    alert("Order placed successfully!");

    showSection("orders");
});

function displayOrders() {

    const list = document.getElementById("orderList");

    if (orders.length === 0) {
        list.innerHTML = "<p>No orders yet.</p>";
        return;
    }

    list.innerHTML = orders.map(order => `

        <div class="order">

            <h3>Order ID: ${order.id}</h3>

            <p>${order.date}</p>

            <p class="success">
                ${order.status}
            </p>

            <hr><br>

            ${order.items.map(item => `
                <p>
                    ${item.name} × ${item.quantity}
                </p>
            `).join("")}

            <br>

            <h3>
                Total: ₹${order.total.toLocaleString("en-IN")}
            </h3>

            <p>Payment: ${order.payment}</p>

            <p>
                Delivery: ${order.city} - ${order.pincode}
            </p>

        </div>

    `).join("");
}

displayProducts();
updateCartCount();