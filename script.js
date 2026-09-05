/* ================================
   ECW - EVERYTHING YOU NEED
   LocalStorage E-Commerce Prototype
================================ */


const STORAGE = {
    products:"ecwProducts",
    cart:"ecwCart",
    orders:"ecwOrders",
    users:"ecwUsers",
    wishlist:"ecwWishlist",
    feedback:"ecwFeedback",
    user:"ecwCurrentUser",
    theme:"ecwTheme"
};

/* ================================
   PRODUCT IMAGES
================================ */

const productImages = {

    1:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",

    2:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",

    3:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",

    4:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",

    5:"https://images.unsplash.com/photo-1546868871-7041f2a3fca6?auto=format&fit=crop&w=800&q=80",

    6:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",

    7:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",

    8:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",

    9:"https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80",

    10:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80"

};


/* ================================
   DEFAULT PRODUCTS
================================ */

const defaultProducts = [

    {
        id:1,
        name:"iPhone 15",
        category:"Mobiles",
        price:59999,
        description:"Apple iPhone 15 with powerful performance and advanced camera features.",
        emoji:"📱",
        image:productImages[1]
    },

    {
        id:2,
        name:"Samsung Galaxy S24",
        category:"Mobiles",
        price:74999,
        description:"Samsung Galaxy S24 with a premium design, powerful processor and excellent camera.",
        emoji:"📱",
        image:productImages[2]
    },

    {
        id:3,
        name:"HP Pavilion Laptop",
        category:"Laptops",
        price:65999,
        description:"HP Pavilion laptop suitable for study, work and everyday computing.",
        emoji:"💻",
        image:productImages[3]
    },

    {
        id:4,
        name:"MacBook Air",
        category:"Laptops",
        price:99999,
        description:"Apple MacBook Air with a slim design and powerful performance.",
        emoji:"💻",
        image:productImages[4]
    },

    {
        id:5,
        name:"Apple Watch",
        category:"Watches",
        price:42999,
        description:"Apple Watch with smart features for fitness, communication and everyday use.",
        emoji:"⌚",
        image:productImages[5]
    },

    {
        id:6,
        name:"Running Shoes",
        category:"Shoes",
        price:2499,
        description:"Comfortable and lightweight running shoes designed for everyday activity.",
        emoji:"👟",
        image:productImages[6]
    },

    {
        id:7,
        name:"Wireless Headphones",
        category:"Accessories",
        price:2999,
        description:"High-quality wireless headphones with comfortable design and clear sound.",
        emoji:"🎧",
        image:productImages[7]
    },

    {
        id:8,
        name:"Smart Backpack",
        category:"Accessories",
        price:1999,
        description:"Stylish and durable smart backpack suitable for college, work and travel.",
        emoji:"🎒",
        image:productImages[8]
    },

    {
        id:9,
        name:"Gaming Mouse",
        category:"Accessories",
        price:1499,
        description:"Responsive gaming mouse designed for smooth and accurate control.",
        emoji:"🖱️",
        image:productImages[9]
    },

    {
        id:10,
        name:"Bluetooth Speaker",
        category:"Accessories",
        price:1799,
        description:"Portable Bluetooth speaker with clear sound and convenient wireless connectivity.",
        emoji:"🔊",
        image:productImages[10]
    }

];


/* ================================
   DATA
================================ */

let products =
    JSON.parse(localStorage.getItem(STORAGE.products)) || [];

let cart =
    JSON.parse(localStorage.getItem(STORAGE.cart)) || [];

let orders =
    JSON.parse(localStorage.getItem(STORAGE.orders)) || [];

let users =
    JSON.parse(localStorage.getItem(STORAGE.users)) || [];

let wishlist =
    JSON.parse(localStorage.getItem(STORAGE.wishlist)) || [];

let feedback =
    JSON.parse(localStorage.getItem(STORAGE.feedback)) || [];

let currentUser =
    JSON.parse(localStorage.getItem(STORAGE.user)) || null;

let selectedImage = "";

let currentTrackingOrderId = null;


/* ================================
   FIX OLD PRODUCT DATA
================================ */

function fixProductImages(){

    if(!products.length){

        products = [...defaultProducts];

    }else{

        products = products.map(product => {

            if(!product.image){

                product.image =
                    productImages[product.id] || "";

            }

            return product;
        });
    }

    saveData();
}

/* ================================
   SAVE DATA
================================ */

function saveData(){

    localStorage.setItem(
        STORAGE.products,
        JSON.stringify(products)
    );

    localStorage.setItem(
        STORAGE.cart,
        JSON.stringify(cart)
    );

    localStorage.setItem(
        STORAGE.orders,
        JSON.stringify(orders)
    );

    localStorage.setItem(
        STORAGE.users,
        JSON.stringify(users)
    );

    localStorage.setItem(
        STORAGE.wishlist,
        JSON.stringify(wishlist)
    );

    localStorage.setItem(
    STORAGE.feedback,
    JSON.stringify(feedback)
);


}


/* ================================
   NAVIGATION
================================ */

function showSection(id){

    document.querySelectorAll(".section")
        .forEach(section =>
            section.classList.remove("active")
        );

    const section =
        document.getElementById(id);

    if(section)
        section.classList.add("active");


    if(id === "products")
        displayProducts();

    if(id === "cart")
        displayCart();

    if(id === "checkout")
        displayCheckout();

    if(id === "orders")
        displayOrders();

    if(id === "wishlist")
        displayWishlist();

    if(id === "profile")
        displayProfile();

    if(id === "owner")
        checkOwner();

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}


/* ================================
   PRODUCT DISPLAY
================================ */

function displayProducts(list = products){

    const area =
        document.getElementById("productsArea");

    if(!area) return;

    if(!list.length){

        area.innerHTML =
            "<p>No products found.</p>";

        return;
    }

    area.innerHTML =
        list.map(productCard).join("");
}


function productCard(p){

    const wished =
        wishlist.includes(p.id);

    return `

        <div class="product-card">

            <div class="product-image">

                ${
                    p.image
                    ?
                    `
                    <img
                        src="${p.image}"
                        alt="${p.name}"
                        onerror="
                            this.style.display='none';
                            this.nextElementSibling.style.display='flex';
                        ">
                    <div class="image-fallback">
                        ${p.emoji || "🛍️"}
                    </div>
                    `
                    :
                    `
                    <div class="image-fallback"
                         style="display:flex">
                        ${p.emoji || "🛍️"}
                    </div>
                    `
                }

            </div>

            <div class="product-info">

                <h3>${p.name}</h3>

                <p>${p.category}</p>

                <div class="price">
                    ₹${Number(p.price).toLocaleString("en-IN")}
                </div>

                <p>${p.description || ""}</p>

		<div class="card-rating">
    ${ratingSummaryShort(p.id)}
</div>


                <div class="product-actions">

                    <button
                        class="primary"
                        onclick="addToCart(${p.id})">
                        Add to Cart
                    </button>

                    <button
                        class="secondary"
                        onclick="viewProduct(${p.id})">
                        View
                    </button>

                    <button
                        class="secondary"
                        onclick="toggleWishlist(${p.id})">
                        ${wished ? "❤️" : "🤍"}
                    </button>

                </div>

            </div>

        </div>

    `;
}


/* ================================
   SEARCH
================================ */

function filterProducts(){

    const search =
        document.getElementById("search")
            .value.toLowerCase();

    const category =
        document.getElementById("category")
            .value;

    const filtered =
        products.filter(product => {

            const matchSearch =
                product.name.toLowerCase()
                    .includes(search);

            const matchCategory =
                category === "All" ||
                product.category === category;

            return matchSearch &&
                   matchCategory;

        });

    displayProducts(filtered);
}


/* ================================
   PRODUCT DETAILS
================================ */

function viewProduct(id){

    const product =
        products.find(p => p.id === id);

    if(!product) return;

    const area =
        document.getElementById("detailsArea");

    area.innerHTML = `

        <div class="detail-card">

            <div>
                ${
                    product.image
                    ?
                    `<img
                        class="detail-image"
                        src="${product.image}"
                        onerror="this.style.display='none'">
                    `
                    :
                    `<div class="product-image">
                        ${product.emoji || "🛍️"}
                    </div>`
                }
            </div>

            <div class="detail-info">

                <p class="small-title">
                    ${product.category}
                </p>

                <h2>${product.name}</h2>

                <h2>
                    ₹${Number(product.price)
                        .toLocaleString("en-IN")}
                </h2>

                <p>${product.description || ""}</p>

                <br>

                <button
                    class="primary"
                    onclick="addToCart(${product.id})">
                    🛒 Add to Cart
                </button>

                <button
                    class="secondary"
                    onclick="toggleWishlist(${product.id})">
                    ❤️ Wishlist
                </button>

                <button
                    class="secondary"
                    onclick="showSection('products')">
                    ← Back
                </button>

            </div>

        </div>

        <div class="feedback-card">

            <h2>⭐ Customer Feedback</h2>

            <div id="ratingSummary">
                ${ratingSummary(product.id)}
            </div>

            <hr>

            <h3>Write a Review</h3>

            ${
                currentUser
                ?
                `
                <div class="rating-input">

                    <label>Your Rating</label>

                    <select id="feedbackRating">

                        <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                        <option value="4">⭐⭐⭐⭐ Very Good</option>
                        <option value="3">⭐⭐⭐ Good</option>
                        <option value="2">⭐⭐ Fair</option>
                        <option value="1">⭐ Poor</option>

                    </select>

                </div>

                <textarea
                    id="feedbackComment"
                    placeholder="Share your experience with this product..."
                    rows="4">
                </textarea>

                <button
                    class="primary"
                    onclick="submitFeedback(${product.id})">
                    ⭐ Submit Feedback
                </button>
                `
                :
                `
                <div class="login-feedback">
                    <p>
                        🔐 Please login to submit your feedback.
                    </p>

                    <button
                        class="primary"
                        onclick="openLogin()">
                        Login
                    </button>
                </div>
                `
            }

            <div id="feedbackList">
                ${displayFeedback(product.id)}
            </div>

        </div>
    `;

    showSection("productDetails");
}





function ratingSummary(productId){

    const reviews =
        feedback.filter(
            item => item.productId === productId
        );

    if(!reviews.length){

        return `
            <div class="rating-summary">
                <strong>No ratings yet</strong>
                <p>Be the first customer to review this product!</p>
            </div>
        `;
    }

    const total =
        reviews.reduce(
            (sum,item) => sum + Number(item.rating),
            0
        );

    const average =
        (total / reviews.length).toFixed(1);

    return `
        <div class="rating-summary">

            <div class="big-rating">
                ⭐ ${average}
            </div>

            <div>
                <div class="stars">
                    ${"⭐".repeat(Math.round(average))}
                </div>

                <p>
                    Based on ${reviews.length}
                    review${reviews.length > 1 ? "s" : ""}
                </p>
            </div>

        </div>
    `;
}








function displayFeedback(productId){

    const reviews =
        feedback
            .filter(item => item.productId === productId)
            .sort((a,b) =>
                new Date(b.date) -
                new Date(a.date)
            );

    if(!reviews.length){

        return `
            <div class="no-feedback">
                💬 No customer reviews yet.
            </div>
        `;
    }

    return `
        <div class="feedback-list">

            ${reviews.map(review => `

                <div class="feedback-item">

                    <div class="feedback-header">

                        <strong>
                            ${review.userName}
                        </strong>

                        <span>
                            ${"⭐".repeat(Number(review.rating))}
                        </span>

                    </div>

                    <p>
                        ${review.comment}
                    </p>

                    <small>
                        ${new Date(review.date)
                            .toLocaleDateString("en-IN")}
                    </small>

                </div>

            `).join("")}

        </div>
    `;
}








/* ================================
   CART
================================ */

function addToCart(id){

    const item =
        cart.find(item => item.id === id);

    if(item){

        item.qty++;

    }else{

        cart.push({
            id:id,
            qty:1
        });

    }

    saveData();
    updateCartCount();

    toast("Product added to cart 🛒");
}


function updateCartCount(){

    const count =
        cart.reduce(
            (sum,item) => sum + item.qty,
            0
        );

    document.getElementById("cartCount")
        .textContent = count;
}


function displayCart(){

    const area =
        document.getElementById("cartArea");

    if(!cart.length){

        area.innerHTML = `
            <div class="form-card">
                <h3>Your cart is empty 🛒</h3>
                <button
                    class="primary"
                    onclick="showSection('products')">
                    Start Shopping
                </button>
            </div>
        `;

        return;
    }

    let total = 0;

    area.innerHTML =
        cart.map(item => {

            const product =
                products.find(p => p.id === item.id);

            if(!product) return "";

            const itemTotal =
                product.price * item.qty;

            total += itemTotal;

            return `

                <div class="cart-item">

                    ${
                        product.image
                        ?
                        `<img src="${product.image}"
                              alt="${product.name}">`
                        :
                        `<div style="font-size:45px">
                            ${product.emoji}
                        </div>`
                    }

                    <div>

                        <h3>${product.name}</h3>

                        <p>₹${product.price}</p>

                    </div>

                    <div class="qty">

                        <button
                            onclick="changeQty(${product.id},-1)">
                            −
                        </button>

                        <strong>${item.qty}</strong>

                        <button
                            onclick="changeQty(${product.id},1)">
                            +
                        </button>

                    </div>

                    <strong>
                        ₹${itemTotal.toLocaleString("en-IN")}
                    </strong>

                    <button
                        class="danger primary"
                        onclick="removeFromCart(${product.id})">
                        Remove
                    </button>

                </div>

            `;

        }).join("");


    area.innerHTML += `

        <div class="form-card">

            <h2>
                Total:
                ₹${total.toLocaleString("en-IN")}
            </h2>

            <button
                class="primary"
                onclick="startCheckout()">
                Proceed to Checkout →
            </button>

        </div>

    `;
}


function changeQty(id,value){

    const item =
        cart.find(item => item.id === id);

    if(!item) return;

    item.qty += value;

    if(item.qty <= 0){

        cart =
            cart.filter(item => item.id !== id);

    }

    saveData();
    updateCartCount();
    displayCart();
}


function removeFromCart(id){

    cart =
        cart.filter(item => item.id !== id);

    saveData();
    updateCartCount();
    displayCart();

    toast("Product removed.");
}


/* ================================
   CHECKOUT
================================ */

function startCheckout(){

    if(!cart.length){

        toast("Your cart is empty.");

        return;
    }

    showSection("checkout");
    displayCheckout();
}


function displayCheckout(){

    let total = 0;

    cart.forEach(item => {

        const product =
            products.find(p => p.id === item.id);

        if(product)
            total += product.price * item.qty;

    });

    document.getElementById("checkoutTotal")
        .textContent =
        "Total: ₹" +
        total.toLocaleString("en-IN");

    if(currentUser){

        document.getElementById("checkoutName")
            .value = currentUser.name || "";

        document.getElementById("checkoutPhone")
            .value = currentUser.phone || "";

    }

}


function paymentChanged(){

    const method =
        document.querySelector(
            'input[name="payment"]:checked'
        ).value;

    const area =
        document.getElementById("paymentInfo");

    if(method === "UPI"){

        area.innerHTML = `
            <div class="form-card">
                <strong>UPI Payment</strong>
                <input placeholder="Enter UPI ID"
                       id="upiId">
            </div>
        `;

    }

    else if(method === "CARD"){

        area.innerHTML = `
            <div class="form-card">
                <strong>Card Details</strong>

                <input placeholder="Card Number">

                <input placeholder="Card Holder Name">

                <div style="display:flex;gap:8px">
                    <input placeholder="MM/YY">
                    <input placeholder="CVV">
                </div>
            </div>
        `;

    }

    else if(method === "NETBANKING"){

        area.innerHTML = `
            <div class="form-card">
                <strong>Net Banking</strong>

                <select>
                    <option>Select Bank</option>
                    <option>SBI</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Bank of Baroda</option>
                </select>
            </div>
        `;

    }

    else{

        area.innerHTML = `
            <p class="small">
                Pay when your order is delivered.
            </p>
        `;

    }

}


/* ================================
   PLACE ORDER
================================ */

function placeOrder(){

    if(!cart.length){

        toast("Cart is empty.");

        return;
    }


    const name =
        document.getElementById("checkoutName").value.trim();

    const phone =
        document.getElementById("checkoutPhone").value.trim();

    const address =
        document.getElementById("checkoutAddress").value.trim();

    const city =
        document.getElementById("checkoutCity").value.trim();

    const pin =
        document.getElementById("checkoutPin").value.trim();


    if(!name || !phone || !address || !city || !pin){

        toast("Please fill all delivery details.");

        return;
    }


    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    let total = 0;

    const items =
        cart.map(item => {

            const product =
                products.find(p => p.id === item.id);

            const itemTotal =
                product.price * item.qty;

            total += itemTotal;

            return {
                id:product.id,
                name:product.name,
                price:product.price,
                qty:item.qty,
                image:product.image,
                emoji:product.emoji
            };

        });


    const order = {

        id:
            "ECW" +
            Date.now().toString().slice(-8),

        user:
            currentUser
            ? currentUser.phone
            : phone,

        customerName:name,

        phone:phone,

        address:address,

        city:city,

        pin:pin,

        payment:payment.value,

        items:items,

        total:total,

        date:
            new Date().toLocaleString("en-IN"),

        status:0

    };


    orders.unshift(order);

    cart = [];

    saveData();

    updateCartCount();


    showSuccess(order);

}


/* ================================
   ORDER SUCCESS
================================ */

function showSuccess(order){

    showSection("orders");

    const area =
        document.getElementById("ordersArea");

    area.innerHTML = `

        <div class="success-card">

            <div class="success-icon">
                ✓
            </div>

            <h2>Order Placed Successfully!</h2>

            <p>
                Thank you for shopping with ECW ❤️
            </p>

            <p>
                Order ID:
                <strong>${order.id}</strong>
            </p>

            <br>

            <button
                class="primary"
                onclick="trackOrder('${order.id}')">
                📦 Track Order
            </button>

            <button
                class="secondary"
                onclick="generateBill(orders.find(o=>o.id==='${order.id}'))">
                🧾 View Invoice
            </button>

        </div>

    `;

    displayOrders();

    toast("Order placed successfully 🎉");
}


/* ================================
   ORDERS
================================ */

function displayOrders(){

    const area =
        document.getElementById("ordersArea");

    if(!area) return;


    let myOrders = orders;

    if(currentUser){

        myOrders =
            orders.filter(
                order =>
                    order.user === currentUser.phone
            );

    }


    if(!myOrders.length){

        area.innerHTML = `
            <div class="form-card">
                <h3>No orders yet 📦</h3>
                <button
                    class="primary"
                    onclick="showSection('products')">
                    Start Shopping
                </button>
            </div>
        `;

        return;
    }


    area.innerHTML =
        myOrders.map(order => {

            return `

                <div class="order-card">

                    <div class="order-head">

                        <div>
                            <h3>
                                Order ${order.id}
                            </h3>

                            <p class="small">
                                ${order.date}
                            </p>
                        </div>

                        <span class="status-badge">
                            ${statusText(order.status)}
                        </span>

                    </div>


                    <div class="order-items">

                        ${
                            order.items.map(item => `

                                <div class="order-item">

                                    <span>
                                        ${item.emoji || "🛍️"}
                                        ${item.name}
                                        × ${item.qty}
                                    </span>

                                    <strong>
                                        ₹${(
                                            item.price *
                                            item.qty
                                        ).toLocaleString("en-IN")}
                                    </strong>

                                </div>

                            `).join("")
                        }

                    </div>


                    <h3>
                        Total:
                        ₹${order.total.toLocaleString("en-IN")}
                    </h3>

                    <p>
                        Payment:
                        ${paymentName(order.payment)}
                    </p>

                    <br>


                    <button
                        class="track-button"
                        onclick="trackOrder('${order.id}')">
                        📦 Track Order
                    </button>

                    <button
                        class="secondary"
                        onclick="generateBill(
                            orders.find(o=>o.id==='${order.id}')
                        )">
                        🧾 View Invoice
                    </button>

                </div>

            `;

        }).join("");

}


/* ================================
   ORDER STATUS
================================ */

const orderStatuses = [

    "Placed",

    "Confirmed",

    "Shipped",

    "Out for Delivery",

    "Delivered"

];


function statusText(status){

    return orderStatuses[status] ||
        "Placed";

}


/* ================================
   TRACK ORDER
================================ */

function trackOrder(id){

    currentTrackingOrderId = id;

    const order =
        orders.find(
            order => order.id === id
        );

    if(!order){

        toast("Order not found.");

        return;
    }


    const content =
        document.getElementById(
            "trackingContent"
        );


    content.innerHTML = `

        <p class="small-title">
            ORDER TRACKING
        </p>

        <h2>📦 Track Your Order</h2>

        <p>
            <strong>Order ID:</strong>
            ${order.id}
        </p>

        <p class="small">
            Ordered on ${order.date}
        </p>


        <div class="tracking">

            ${trackingHTML(order.status)}

        </div>


        <div class="form-card">

            <h3>
                Current Status:
                ${statusText(order.status)}
            </h3>

            <p>
                ${
                    order.status === 0
                    ? "Your order has been placed successfully."
                    :
                    order.status === 1
                    ? "Your order has been confirmed."
                    :
                    order.status === 2
                    ? "Your order has been shipped."
                    :
                    order.status === 3
                    ? "Your order is out for delivery."
                    :
                    "Your order has been delivered successfully."
                }
            </p>

        </div>


        <div class="form-card">

            <h3>Delivery Address</h3>

            <p>${order.customerName}</p>

            <p>${order.phone}</p>

            <p>
                ${order.address},
                ${order.city} -
                ${order.pin}
            </p>

        </div>


        <div class="form-card">

            <h3>Order Summary</h3>

            ${
                order.items.map(item => `

                    <div class="order-item">

                        <span>
                            ${item.emoji || "🛍️"}
                            ${item.name}
                            × ${item.qty}
                        </span>

                        <strong>
                            ₹${(
                                item.price *
                                item.qty
                            ).toLocaleString("en-IN")}
                        </strong>

                    </div>

                `).join("")
            }

            <hr>

            <h3>
                Total:
                ₹${order.total.toLocaleString("en-IN")}
            </h3>

        </div>

        <button
            class="primary full"
            onclick="closeTracking()">
            Close
        </button>

    `;


    document.getElementById(
        "trackingModal"
    ).classList.add("show");

}


function trackingHTML(status){

    return orderStatuses.map(
        (name,index) => {

            let className = "";

            if(index < status)
                className = "done";

            if(index === status)
                className = "current";

            return `

                <div class="track-step ${className}">

                    <div class="track-dot">

                        ${
                            index <= status
                            ? "✓"
                            : index + 1
                        }

                    </div>

                    <p>${name}</p>

                </div>

            `;

        }
    ).join("");

}


function closeTracking(){

    document.getElementById(
        "trackingModal"
    ).classList.remove("show");

}


/* ================================
   OWNER LOGIN
================================ */

function ownerLogin(){

    const phone =
        document.getElementById("ownerPhone").value;

    const password =
        document.getElementById("ownerPassword").value;


    if(
        phone === "9999999999" &&
        password === "owner123"
    ){

        sessionStorage.setItem(
            "ecwOwner",
            "true"
        );

        checkOwner();

        toast("Owner login successful.");

    }else{

        toast("Invalid owner credentials.");

    }

}


function checkOwner(){

    const logged =
        sessionStorage.getItem("ecwOwner") === "true";


    document.getElementById(
        "ownerLoginArea"
    ).classList.toggle(
        "hidden",
        logged
    );


    document.getElementById(
        "ownerDashboard"
    ).classList.toggle(
        "hidden",
        !logged
    );


    if(logged){

        updateOwnerStats();

        displayManageProducts();

        displayManageOrders();

    }

}


function ownerLogout(){

    sessionStorage.removeItem("ecwOwner");

    checkOwner();

}


function updateOwnerStats(){

    const sales =
        orders.reduce(
            (sum,order) =>
                sum + Number(order.total),
            0
        );


    document.getElementById(
        "statProducts"
    ).textContent = products.length;


    document.getElementById(
        "statUsers"
    ).textContent = users.length;


    document.getElementById(
        "statOrders"
    ).textContent = orders.length;


    document.getElementById(
        "statSales"
    ).textContent =
        "₹" +
        sales.toLocaleString("en-IN");

}


/* ================================
   OWNER PRODUCT MANAGEMENT
================================ */

function saveProduct(){

    const name =
        document.getElementById("productName")
            .value.trim();

    const category =
        document.getElementById("productCategory")
            .value;

    const price =
        Number(
            document.getElementById("productPrice")
                .value
        );

    const description =
        document.getElementById("productDescription")
            .value.trim();

    const emoji =
        document.getElementById("productEmoji")
            .value;

    const editId =
        document.getElementById("editProductId")
            .value;


    if(!name || !price){

        toast("Enter product name and price.");

        return;
    }


    if(editId){

        const product =
            products.find(
                p => p.id === Number(editId)
            );

        if(product){

            product.name = name;
            product.category = category;
            product.price = price;
            product.description = description;
            product.emoji = emoji;

            if(selectedImage)
                product.image = selectedImage;

        }

        toast("Product updated successfully.");

    }else{

        products.push({

            id:Date.now(),

            name:name,

            category:category,

            price:price,

            description:description,

            emoji:emoji,

            image:selectedImage || ""

        });

        toast("Product added successfully.");

    }


    saveData();

    resetProductForm();

    displayProducts();

    displayManageProducts();

    updateOwnerStats();

}


function displayManageProducts(){

    const area =
        document.getElementById(
            "manageProducts"
        );

    if(!area) return;


    area.innerHTML =
        products.map(product => `

            <div class="manage-product">

                ${
                    product.image
                    ?
                    `<img src="${product.image}">`
                    :
                    `<div style="font-size:35px">
                        ${product.emoji}
                    </div>`
                }

                <div style="flex:1">

                    <strong>
                        ${product.name}
                    </strong>

                    <p class="small">
                        ${product.category}
                        · ₹${product.price}
                    </p>

                </div>

                <button
                    class="secondary"
                    onclick="editProduct(${product.id})">
                    Edit
                </button>

                <button
                    class="primary danger"
                    onclick="deleteProduct(${product.id})">
                    Delete
                </button>

            </div>

        `).join("");

}


function editProduct(id){

    const product =
        products.find(p => p.id === id);

    if(!product) return;


    document.getElementById(
        "editProductId"
    ).value = product.id;


    document.getElementById(
        "productName"
    ).value = product.name;


    document.getElementById(
        "productCategory"
    ).value = product.category;


    document.getElementById(
        "productPrice"
    ).value = product.price;


    document.getElementById(
        "productDescription"
    ).value =
        product.description || "";


    document.getElementById(
        "productEmoji"
    ).value =
        product.emoji || "🛍️";


    selectedImage =
        product.image || "";


    document.getElementById(
        "productFormTitle"
    ).textContent =
        "Edit Product";


    document.getElementById(
        "cancelEdit"
    ).classList.remove("hidden");


    document.getElementById(
        "owner"
    ).scrollIntoView({
        behavior:"smooth"
    });

}


function deleteProduct(id){

    if(!confirm(
        "Delete this product?"
    )) return;


    products =
        products.filter(
            p => p.id !== id
        );


    cart =
        cart.filter(
            item => item.id !== id
        );


    wishlist =
        wishlist.filter(
            item => item !== id
        );


    feedback =
    feedback.filter(
        item => item.productId !== id
    );




    saveData();

    displayProducts();

    displayManageProducts();

    updateCartCount();

    updateOwnerStats();

    toast("Product deleted.");

}


function resetProductForm(){

    document.getElementById(
        "editProductId"
    ).value = "";


    document.getElementById(
        "productName"
    ).value = "";


    document.getElementById(
        "productPrice"
    ).value = "";


    document.getElementById(
        "productDescription"
    ).value = "";


    document.getElementById(
        "productImage"
    ).value = "";


    document.getElementById(
        "imagePreview"
    ).innerHTML = "";


    document.getElementById(
        "productFormTitle"
    ).textContent =
        "Add New Product";


    document.getElementById(
        "cancelEdit"
    ).classList.add("hidden");


    selectedImage = "";

}


/* ================================
   IMAGE UPLOAD + COMPRESSION
================================ */

function previewImage(event){

    const file =
        event.target.files[0];

    if(!file) return;


    if(!file.type.startsWith("image/")){

        toast("Please select an image.");

        return;
    }


    const reader =
        new FileReader();


    reader.onload = function(e){

        const img = new Image();


        img.onload = function(){

            const canvas =
                document.createElement("canvas");

            const max = 700;

            let width = img.width;
            let height = img.height;


            if(width > height){

                if(width > max){

                    height =
                        height * max / width;

                    width = max;

                }

            }else{

                if(height > max){

                    width =
                        width * max / height;

                    height = max;

                }

            }


            canvas.width = width;
            canvas.height = height;


            const ctx =
                canvas.getContext("2d");


            ctx.drawImage(
                img,
                0,
                0,
                width,
                height
            );


            selectedImage =
                canvas.toDataURL(
                    "image/jpeg",
                    0.75
                );


            document.getElementById(
                "imagePreview"
            ).innerHTML = `

                <img src="${selectedImage}"
                     alt="Preview">

            `;

        };


        img.src = e.target.result;

    };


    reader.readAsDataURL(file);

}


/* ================================
   OWNER ORDER TRACKING
================================ */

function displayManageOrders(){

    const area =
        document.getElementById(
            "manageOrders"
        );

    if(!area) return;


    if(!orders.length){

        area.innerHTML =
            "<p>No orders available.</p>";

        return;
    }


    area.innerHTML =
        orders.map(order => `

            <div class="manage-order">

                <div class="manage-order-row">

                    <div>

                        <strong>
                            ${order.id}
                        </strong>

                        <p class="small">
                            ${order.customerName}
                            · ₹${order.total}
                        </p>

                    </div>


                    <div>

                        <select
                            id="status-${order.id}">

                            ${orderStatuses.map(
                                (status,index) => `

                                <option
                                    value="${index}"
                                    ${
                                        Number(order.status)
                                        === index
                                        ? "selected"
                                        : ""
                                    }>

                                    ${status}

                                </option>

                            `).join("")}

                        </select>

                    </div>


                    <button
                        class="primary"
                        onclick="updateOrderStatus('${order.id}')">
                        Update Status
                    </button>


                    <button
                        class="secondary"
                        onclick="trackOrder('${order.id}')">
                        View Tracking
                    </button>

                </div>

            </div>

        `).join("");

}


function updateOrderStatus(orderId){

    const order =
        orders.find(
            order => order.id === orderId
        );

    if(!order) return;


    const select =
        document.getElementById(
            "status-" + orderId
        );


    order.status =
        Number(select.value);


    saveData();

    displayManageOrders();

    displayOrders();

    updateOwnerStats();


    toast(
        "Order status updated to " +
        statusText(order.status)
    );

}


/* ================================
   WISHLIST
================================ */

function toggleWishlist(id){

    if(wishlist.includes(id)){

        wishlist =
            wishlist.filter(
                item => item !== id
            );

        toast("Removed from wishlist.");

    }else{

        wishlist.push(id);

        toast("Added to wishlist ❤️");

    }


    saveData();

    displayProducts();

    displayWishlist();

}


function displayWishlist(){

    const area =
        document.getElementById(
            "wishlistArea"
        );

    if(!area) return;


    const items =
        products.filter(
            product =>
                wishlist.includes(product.id)
        );


    if(!items.length){

        area.innerHTML =
            "<p>Your wishlist is empty ❤️</p>";

        return;
    }


    area.innerHTML =
        items.map(productCard).join("");

}


/* ================================
   PROFILE
================================ */

function displayProfile(){

    const area =
        document.getElementById(
            "profileArea"
        );

    if(!area) return;


    if(!currentUser){

        area.innerHTML = `

            <div class="form-card">

                <h3>
                    Please login to view profile.
                </h3>

                <button
                    class="primary"
                    onclick="openLogin()">
                    Login
                </button>

            </div>

        `;

        return;
    }


    area.innerHTML = `

        <div class="form-card">

            <h3>Account Information</h3>

            <p>
                <strong>Name:</strong>
                ${currentUser.name}
            </p>

            <p>
                <strong>Phone:</strong>
                ${currentUser.phone}
            </p>

            <br>

            <button
                class="secondary"
                onclick="logout()">
                Logout
            </button>

        </div>

    `;

}


/* ================================
   LOGIN / SIGNUP
================================ */

function openLogin(){

    closeModal("signupModal");

    document.getElementById(
        "loginModal"
    ).classList.add("show");

}


function openSignup(){

    closeModal("loginModal");

    document.getElementById(
        "signupModal"
    ).classList.add("show");

}


function closeModal(id){

    document.getElementById(id)
        .classList.remove("show");

}


function signup(){

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


    if(!name || !phone || !password){

        toast("Fill all fields.");

        return;
    }


    if(users.some(
        user => user.phone === phone
    )){

        toast("Account already exists.");

        return;
    }


    users.push({
        name,
        phone,
        password
    });


    saveData();

    currentUser = {
        name,
        phone
    };


    localStorage.setItem(
        STORAGE.user,
        JSON.stringify(currentUser)
    );


    closeModal("signupModal");

    updateLoginUI();

    displayProfile();

    showSection("products");

    toast("Account created successfully 🎉");

}


function login(){

    const phone =
        document.getElementById(
            "loginPhone"
        ).value.trim();

    const password =
        document.getElementById(
            "loginPassword"
        ).value;


    const user =
        users.find(
            user =>
                user.phone === phone &&
                user.password === password
        );


    if(!user){

        toast("Invalid phone or password.");

        return;
    }


    currentUser = {
        name:user.name,
        phone:user.phone
    };


    localStorage.setItem(
        STORAGE.user,
        JSON.stringify(currentUser)
    );


    closeModal("loginModal");

    updateLoginUI();

    displayProfile();

    toast("Login successful 👋");

}


function logout(){

    currentUser = null;

    localStorage.removeItem(
        STORAGE.user
    );

    updateLoginUI();

    displayProfile();

    toast("Logged out.");

}


function updateLoginUI(){

    document.getElementById(
        "loginNav"
    ).classList.toggle(
        "hidden",
        !!currentUser
    );


    document.getElementById(
        "logoutNav"
    ).classList.toggle(
        "hidden",
        !currentUser
    );

}


/* ================================
   OTP DEMO
================================ */

function verifyOTP(){

    const otp =
        document.getElementById(
            "otpInput"
        ).value;


    if(otp === "1234"){

        closeModal("otpModal");

        toast(
            "Phone verified successfully."
        );

    }else{

        toast("Invalid OTP.");

    }

}


/* ================================
   BILL / INVOICE
================================ */

function generateBill(order){

    if(!order){

        toast("Order not found.");

        return;
    }


    const area =
        document.getElementById(
            "billArea"
        );


    area.innerHTML = `

        <div class="form-card">

            <div style="
                display:flex;
                justify-content:space-between;
                gap:20px;
                flex-wrap:wrap;
            ">

                <div>

                    <h1>✦ ECW</h1>

                    <p>
                        Everything You Need
                    </p>

                </div>

                <div>

                    <strong>INVOICE</strong>

                    <p>
                        Order:
                        ${order.id}
                    </p>

                    <p>
                        Date:
                        ${order.date}
                    </p>

                </div>

            </div>

            <hr><br>


            <h3>Customer Details</h3>

            <p>
                ${order.customerName}
            </p>

            <p>
                ${order.phone}
            </p>

            <p>
                ${order.address},
                ${order.city} -
                ${order.pin}
            </p>

            <br>


            <table style="
                width:100%;
                border-collapse:collapse;
            ">

                <tr>
                    <th style="text-align:left">
                        Product
                    </th>

                    <th>Qty</th>

                    <th>Price</th>

                    <th>Total</th>
                </tr>


                ${
                    order.items.map(item => `

                        <tr>

                            <td>
                                ${item.name}
                            </td>

                            <td style="text-align:center">
                                ${item.qty}
                            </td>

                            <td style="text-align:center">
                                ₹${item.price}
                            </td>

                            <td style="text-align:right">
                                ₹${item.price * item.qty}
                            </td>

                        </tr>

                    `).join("")
                }

            </table>

            <hr><br>


            <h2 style="text-align:right">
                Total:
                ₹${order.total.toLocaleString("en-IN")}
            </h2>


            <p class="success">
                ✓ Payment Method:
                ${paymentName(order.payment)}
            </p>


            <p style="text-align:center;margin-top:30px">
                Thank you for shopping with ECW ❤️
            </p>


            <button
                class="primary"
                onclick="window.print()">
                🖨 Print / Save Bill
            </button>

            <button
                class="secondary"
                onclick="showSection('orders')">
                ← Back to Orders
            </button>

        </div>

    `;


    showSection("bill");

}


function paymentName(payment){

    const names = {

        COD:"Cash on Delivery",

        UPI:"UPI",

        CARD:"Credit / Debit Card",

        NETBANKING:"Net Banking"

    };

    return names[payment] || payment;

}


/* ================================
   THEME
================================ */

function toggleTheme(){

    document.body.classList.toggle("dark");

    const dark =
        document.body.classList.contains("dark");


    localStorage.setItem(
        STORAGE.theme,
        dark ? "dark" : "light"
    );

}


/* ================================
   TOAST
================================ */

function toast(message){

    const box =
        document.getElementById("toast");


    box.textContent = message;

    box.style.display = "block";


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(() => {

            box.style.display = "none";

        },2500);

}


/* ================================
   INITIALIZE
================================ */

function init(){

    fixProductImages();

    updateCartCount();

    displayProducts();

    displayOrders();

    displayWishlist();

    displayProfile();

    updateLoginUI();


    const theme =
        localStorage.getItem(
            STORAGE.theme
        );


    if(theme === "dark")
        document.body.classList.add("dark");


    checkOwner();

}


document.addEventListener(
    "DOMContentLoaded",
    init
);





function submitFeedback(productId){

    if(!currentUser){

        toast("Please login first.");
        return;
    }

    const rating =
        Number(
            document.getElementById(
                "feedbackRating"
            ).value
        );

    const comment =
        document.getElementById(
            "feedbackComment"
        ).value.trim();

    if(!comment){

        toast("Please write your feedback.");
        return;
    }

    const existing =
        feedback.find(
            item =>
                item.productId === productId &&
                item.userPhone === currentUser.phone
        );

    if(existing){

        existing.rating = rating;
        existing.comment = comment;
        existing.date = new Date().toISOString();

        toast("Your feedback was updated ⭐");

    }else{

        feedback.push({

            id:Date.now(),

            productId:productId,

            userPhone:currentUser.phone,

            userName:currentUser.name,

            rating:rating,

            comment:comment,

            date:new Date().toISOString()
        });

        toast("Feedback submitted successfully ⭐");
    }

    saveData();

    viewProduct(productId);
}






function ratingSummaryShort(productId){

    const reviews =
        feedback.filter(
            item => item.productId === productId
        );

    if(!reviews.length){
        return "⭐ No reviews";
    }

    const total =
        reviews.reduce(
            (sum,item) => sum + Number(item.rating),
            0
        );

    const average =
        (total / reviews.length).toFixed(1);

    return `
        ⭐ ${average}
        (${reviews.length})
    `;
}