/* =========================
   ECW DATA
========================= */

const defaultProducts = [
    {
        id: 1,
        name: "iPhone 15",
        category: "Mobiles",
        price: 59999,
        icon: "📱",
        description: "Powerful smartphone with premium design."
    },
    {
        id: 2,
        name: "Samsung Galaxy S24",
        category: "Mobiles",
        price: 74999,
        icon: "📱",
        description: "Modern smartphone with advanced features."
    },
    {
        id: 3,
        name: "HP Pavilion",
        category: "Laptops",
        price: 65999,
        icon: "💻",
        description: "Powerful laptop for work and study."
    },
    {
        id: 4,
        name: "MacBook Air",
        category: "Laptops",
        price: 99999,
        icon: "💻",
        description: "Lightweight and powerful laptop."
    },
    {
        id: 5,
        name: "Apple Watch",
        category: "Watches",
        price: 42999,
        icon: "⌚",
        description: "Smart watch for everyday life."
    },
    {
        id: 6,
        name: "Running Shoes",
        category: "Shoes",
        price: 2499,
        icon: "👟",
        description: "Comfortable shoes for running."
    },
    {
        id: 7,
        name: "Wireless Headphones",
        category: "Accessories",
        price: 2999,
        icon: "🎧",
        description: "Clear sound with wireless connectivity."
    },
    {
        id: 8,
        name: "Smart Backpack",
        category: "Accessories",
        price: 1999,
        icon: "🎒",
        description: "Stylish backpack for students and professionals."
    }
];


let products =
    JSON.parse(localStorage.getItem("ecwProducts")) ||
    defaultProducts;

let cart =
    JSON.parse(localStorage.getItem("ecwCart")) || [];

let orders =
    JSON.parse(localStorage.getItem("ecwOrders")) || [];

let users =
    JSON.parse(localStorage.getItem("ecwUsers")) || [];

let currentUser =
    JSON.parse(localStorage.getItem("ecwCurrentUser")) || null;


/* =========================
   SAVE DATA
========================= */

function saveData() {

    localStorage.setItem(
        "ecwProducts",
        JSON.stringify(products)
    );

    localStorage.setItem(
        "ecwCart",
        JSON.stringify(cart)
    );

    localStorage.setItem(
        "ecwOrders",
        JSON.stringify(orders)
    );

    localStorage.setItem(
        "ecwUsers",
        JSON.stringify(users)
    );
}


/* =========================
   NAVIGATION
========================= */

function showSection(id) {

    document
        .querySelectorAll("main > section")
        .forEach(section =>
            section.classList.add("hidden")
        );

    const section = document.getElementById(id);

    if (!section) return;

    section.classList.remove("hidden");

    if (id === "products")
        displayProducts();

    if (id === "cart")
        displayCart();

    if (id === "checkout")
        displayCheckout();

    if (id === "orders")
        displayOrders();

    if (id === "owner")
        displayOwnerProducts();

    if (id === "home")
        updateHeader();
}


/* =========================
   PRODUCTS
========================= */

function displayProducts() {

    const search =
        document
            .getElementById("search")
            .value
            .toLowerCase();

    const category =
        document.getElementById("category").value;

    const list = products.filter(product => {

        const matchSearch =
            product.name
                .toLowerCase()
                .includes(search);

        const matchCategory =
            category === "All" ||
            product.category === category;

        return matchSearch && matchCategory;
    });

    const box =
        document.getElementById("productList");

    if (list.length === 0) {

        box.innerHTML = `
            <div class="product">
                <h3>No products found</h3>
                <p>Try another search.</p>
            </div>
        `;

        return;
    }

    box.innerHTML = list.map(product => `

        <div class="product">

            <div class="product-image">
                ${product.icon}
            </div>

            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <div class="price">
                ₹${product.price.toLocaleString("en-IN")}
            </div>

            <button
                class="primary"
                onclick="addToCart(${product.id})">
                🛒 Add to Cart
            </button>

        </div>

    `).join("");
}


/* =========================
   CART
========================= */

function addToCart(id) {

    const product =
        products.find(p => p.id === id);

    if (!product) return;

    const item =
        cart.find(p => p.id === id);

    if (item)
        item.quantity++;
    else
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            icon: product.icon,
            quantity: 1
        });

    saveData();
    updateCartCount();

    toast(product.name + " added to cart 🛒");
}


function updateCartCount() {

    const count =
        cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

    document.getElementById("cartCount")
        .textContent = count;
}


function displayCart() {

    const list =
        document.getElementById("cartList");

    const totalBox =
        document.getElementById("cartTotal");

    if (cart.length === 0) {

        list.innerHTML = `
            <div class="product">
                <h2>Your cart is empty 🛒</h2>
                <p>Add some products to continue shopping.</p>
                <br>
                <button
                    class="primary"
                    onclick="showSection('products')">
                    Explore Products
                </button>
            </div>
        `;

        totalBox.innerHTML = "";

        return;
    }


    list.innerHTML =
        cart.map(item => `

        <div class="cart-item">

            <div>
                <h3>${item.icon} ${item.name}</h3>
                <p>₹${item.price.toLocaleString("en-IN")}</p>
            </div>

            <div class="quantity">

                <button
                    onclick="changeQuantity(${item.id},-1)">
                    −
                </button>

                <b>${item.quantity}</b>

                <button
                    onclick="changeQuantity(${item.id},1)">
                    +
                </button>

            </div>

            <strong>
                ₹${(item.price * item.quantity)
                    .toLocaleString("en-IN")}
            </strong>

            <button
                class="remove"
                onclick="removeItem(${item.id})">
                Delete
            </button>

        </div>

    `).join("");


    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );

    totalBox.innerHTML = `

        <div class="total">

            <h2>
                Total:
                ₹${total.toLocaleString("en-IN")}
            </h2>

            <br>

            <button
                class="primary"
                onclick="startCheckout()">
                Proceed to Checkout →
            </button>

        </div>
    `;
}


function changeQuantity(id, amount) {

    const item =
        cart.find(p => p.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0)
        cart =
            cart.filter(p => p.id !== id);

    saveData();
    updateCartCount();
    displayCart();
}


function removeItem(id) {

    cart =
        cart.filter(item => item.id !== id);

    saveData();
    updateCartCount();
    displayCart();

    toast("Product removed");
}


/* =========================
   CHECKOUT
========================= */

function startCheckout() {

    if (!cart.length) {

        toast("Your cart is empty");

        return;
    }

    showSection("checkout");
}


function displayCheckout() {

    if (!cart.length) {

        showSection("cart");

        return;
    }

    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );

    document.getElementById("checkoutTotal")
        .textContent =
        "Order Total: ₹" +
        total.toLocaleString("en-IN");
}


document
    .getElementById("checkoutForm")
    .addEventListener("submit", function(e) {

        e.preventDefault();

        if (!currentUser) {

            toast("Please login before placing an order");

            showAuth("login");

            return;
        }


        const total =
            cart.reduce(
                (sum, item) =>
                    sum + item.price * item.quantity,
                0
            );


        const payment =
            document.querySelector(
                'input[name="payment"]:checked'
            ).value;


        const order = {

            id:
                "ECW-" +
                Math.floor(
                    100000 +
                    Math.random() * 900000
                ),

            date:
                new Date().toLocaleString("en-IN"),

            customer:
                document.getElementById("name").value,

            phone:
                document.getElementById("phone").value,

            address:
                document.getElementById("address").value,

            city:
                document.getElementById("city").value,

            pincode:
                document.getElementById("pincode").value,

            items:
                JSON.parse(JSON.stringify(cart)),

            total: total,

            payment: payment,

            status: "Confirmed"

        };


        orders.push(order);

        cart = [];

        saveData();

        updateCartCount();

        this.reset();

        createBill(order);

        toast("Order placed successfully 🎉");

        setTimeout(() =>
            showSection("bill"), 500);

    });


/* =========================
   BILL
========================= */

function createBill(order) {

    document.getElementById("billId")
        .textContent =
        "Invoice: " + order.id;


    document.getElementById("billCustomer")
        .innerHTML = `

        <p><b>Customer:</b> ${order.customer}</p>
        <p><b>Phone:</b> ${order.phone}</p>
        <p><b>Address:</b>
            ${order.address},
            ${order.city} -
            ${order.pincode}
        </p>

        <p>
            <b>Date:</b> ${order.date}
        </p>

        <p>
            <b>Payment:</b> ${order.payment}
        </p>
    `;


    document.getElementById("billItems")
        .innerHTML =
        order.items.map(item => `

        <tr>

            <td>
                ${item.icon} ${item.name}
            </td>

            <td>${item.quantity}</td>

            <td>
                ₹${item.price.toLocaleString("en-IN")}
            </td>

            <td>
                ₹${(item.price * item.quantity)
                    .toLocaleString("en-IN")}
            </td>

        </tr>

    `).join("");


    document.getElementById("billTotal")
        .textContent =
        "Grand Total: ₹" +
        order.total.toLocaleString("en-IN");
}


/* =========================
   ORDERS
========================= */

function displayOrders() {

    const list =
        document.getElementById("orderList");

    if (!currentUser) {

        list.innerHTML = `

            <div class="product">

                <h2>Login Required 🔐</h2>

                <p>
                    Login to view your orders.
                </p>

                <br>

                <button
                    class="primary"
                    onclick="showAuth('login')">
                    Login
                </button>

            </div>
        `;

        return;
    }


    const userOrders =
        orders.filter(
            order =>
                order.phone === currentUser.phone
        );


    if (!userOrders.length) {

        list.innerHTML = `
            <div class="product">
                <h2>No orders yet 📦</h2>
                <p>Your placed orders will appear here.</p>
            </div>
        `;

        return;
    }


    list.innerHTML =
        userOrders.reverse().map(order => `

        <div class="order">

            <h2>${order.id}</h2>

            <span class="status">
                ✓ ${order.status}
            </span>

            <p>${order.date}</p>

            <hr><br>

            ${order.items.map(item => `
                <p>
                    ${item.icon}
                    ${item.name}
                    × ${item.quantity}
                </p>
            `).join("")}

            <br>

            <h3>
                Total:
                ₹${order.total.toLocaleString("en-IN")}
            </h3>

            <p>
                Payment:
                <b>${order.payment}</b>
            </p>

        </div>

    `).join("");
}


/* =========================
   OWNER
========================= */

document
    .getElementById("productForm")
    .addEventListener("submit", function(e) {

        e.preventDefault();

        if (!currentUser || !currentUser.owner) {

            toast("Owner login required");

            return;
        }


        const product = {

            id: Date.now(),

            name:
                document.getElementById(
                    "productName"
                ).value,

            category:
                document.getElementById(
                    "productCategory"
                ).value,

            price:
                Number(
                    document.getElementById(
                        "productPrice"
                    ).value
                ),

            description:
                document.getElementById(
                    "productDescription"
                ).value,

            icon:
                document.getElementById(
                    "productIcon"
                ).value
        };


        products.push(product);

        saveData();

        this.reset();

        displayOwnerProducts();
        displayProducts();

        toast("Product added successfully ✨");
    });


function displayOwnerProducts() {

    const box =
        document.getElementById(
            "ownerProductList"
        );


    if (!currentUser || !currentUser.owner) {

        box.innerHTML = `
            <p>
                🔒 Owner access required.
            </p>
        `;

        return;
    }


    box.innerHTML =
        products.map(product => `

        <div class="owner-product">

            <div>
                <b>
                    ${product.icon}
                    ${product.name}
                </b>

                <br>

                <small>
                    ₹${product.price.toLocaleString("en-IN")}
                </small>
            </div>

            <button
                class="delete"
                onclick="deleteProduct(${product.id})">
                Delete
            </button>

        </div>

    `).join("");
}


function deleteProduct(id) {

    if (!confirm(
        "Delete this product?"
    )) return;

    products =
        products.filter(
            product =>
                product.id !== id
        );

    saveData();

    displayOwnerProducts();
    displayProducts();

    toast("Product deleted");
}


/* =========================
   AUTHENTICATION
========================= */

function showAuth(type) {

    document
        .getElementById("authModal")
        .classList.remove("hidden");


    document
        .getElementById("loginBox")
        .classList.toggle(
            "hidden",
            type !== "login"
        );


    document
        .getElementById("signupBox")
        .classList.toggle(
            "hidden",
            type !== "signup"
        );
}


function closeAuth() {

    document
        .getElementById("authModal")
        .classList.add("hidden");
}


function signup() {

    const name =
        document.getElementById(
            "signupName"
        ).value.trim();

    const phone =
        document.getElementById(
            "signupPhone"
        ).value.trim();

    const password =
        document.getElementById(
            "signupPassword"
        ).value;


    if (!name || !phone || !password) {

        toast("Please fill all fields");

        return;
    }


    if (!/^\d{10}$/.test(phone)) {

        toast("Enter a valid 10-digit phone number");

        return;
    }


    if (users.some(user =>
        user.phone === phone)) {

        toast("Phone number already registered");

        return;
    }


    users.push({
        name,
        phone,
        password,
        owner: false
    });


    saveData();

    toast("Account created successfully 🎉");

    showAuth("login");

    document.getElementById(
        "loginPhone"
    ).value = phone;
}


function login() {

    const phone =
        document.getElementById(
            "loginPhone"
        ).value.trim();

    const password =
        document.getElementById(
            "loginPassword"
        ).value;


    /* OWNER ACCOUNT */

    if (
        phone === "9999999999" &&
        password === "owner123"
    ) {

        currentUser = {

            name: "ECW Owner",

            phone: phone,

            owner: true

        };

        localStorage.setItem(
            "ecwCurrentUser",
            JSON.stringify(currentUser)
        );

        closeAuth();

        updateHeader();

        toast("Owner login successful 👨‍💼");

        showSection("owner");

        return;
    }


    const user =
        users.find(
            u =>
                u.phone === phone &&
                u.password === password
        );


    if (!user) {

        toast("Invalid phone number or password");

        return;
    }


    currentUser = user;

    localStorage.setItem(
        "ecwCurrentUser",
        JSON.stringify(currentUser)
    );

    closeAuth();

    updateHeader();

    toast("Welcome " + user.name + " 👋");
}


function logout() {

    currentUser = null;

    localStorage.removeItem(
        "ecwCurrentUser"
    );

    updateHeader();

    toast("Logged out successfully");

    showSection("home");
}


/* =========================
   HEADER
========================= */

function updateHeader() {

    const loginBtn =
        document.getElementById("loginBtn");

    const ownerBtn =
        document.getElementById("ownerBtn");


    if (currentUser) {

        loginBtn.textContent =
            currentUser.owner
                ? "Owner Logout"
                : "Logout";

        loginBtn.onclick = logout;

        ownerBtn.style.display =
            currentUser.owner
                ? "block"
                : "none";

    } else {

        loginBtn.textContent =
            "Login";

        loginBtn.onclick =
            () => showAuth("login");

        ownerBtn.style.display =
            "none";
    }
}


/* =========================
   TOAST
========================= */

function toast(message) {

    const box =
        document.getElementById("toast");

    box.textContent = message;

    box.classList.add("show");

    setTimeout(() => {

        box.classList.remove("show");

    }, 2500);
}


/* =========================
   INITIALIZE
========================= */

updateHeader();

displayProducts();

updateCartCount();