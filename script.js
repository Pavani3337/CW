/* =========================
   ECW - EVERYTHING YOU NEED
   LocalStorage Prototype
========================= */

const OWNER_PHONE = "9999999999";
const OWNER_PASSWORD = "owner123";

let products = JSON.parse(localStorage.getItem("ecwProducts")) || [
    {
        id:1,
        name:"Wireless Headphones",
        category:"Electronics",
        price:1499,
        description:"Premium wireless headphones with clear sound.",
        emoji:"🎧",
        image:""
    },
    {
        id:2,
        name:"Smart Watch",
        category:"Electronics",
        price:2499,
        description:"Smart watch with fitness and notification features.",
        emoji:"⌚",
        image:""
    },
    {
        id:3,
        name:"Running Shoes",
        category:"Sports",
        price:1999,
        description:"Comfortable shoes for running and daily fitness.",
        emoji:"👟",
        image:""
    },
    {
        id:4,
        name:"Laptop Backpack",
        category:"Fashion",
        price:1299,
        description:"Stylish and durable backpack for laptops.",
        emoji:"🎒",
        image:""
    },
    {
        id:5,
        name:"Smart Phone",
        category:"Electronics",
        price:15999,
        description:"Modern smartphone for everyday use.",
        emoji:"📱",
        image:""
    },
    {
        id:6,
        name:"Cotton T-Shirt",
        category:"Fashion",
        price:699,
        description:"Soft and comfortable cotton T-shirt.",
        emoji:"👕",
        image:""
    },
    {
        id:7,
        name:"Table Lamp",
        category:"Home",
        price:899,
        description:"Elegant LED table lamp for your room.",
        emoji:"💡",
        image:""
    },
    {
        id:8,
        name:"Beauty Kit",
        category:"Beauty",
        price:999,
        description:"Complete everyday beauty care kit.",
        emoji:"💄",
        image:""
    }
];

let cart = JSON.parse(localStorage.getItem("ecwCart")) || [];
let orders = JSON.parse(localStorage.getItem("ecwOrders")) || [];
let users = JSON.parse(localStorage.getItem("ecwUsers")) || [];
let wishlist = JSON.parse(localStorage.getItem("ecwWishlist")) || [];
let currentUser = JSON.parse(localStorage.getItem("ecwCurrentUser")) || null;
let selectedImage = "";
let pendingSignup = null;
let ownerActive = false;


/* =========================
   STORAGE
========================= */

function saveData(){
    localStorage.setItem("ecwProducts",JSON.stringify(products));
    localStorage.setItem("ecwCart",JSON.stringify(cart));
    localStorage.setItem("ecwOrders",JSON.stringify(orders));
    localStorage.setItem("ecwUsers",JSON.stringify(users));
    localStorage.setItem("ecwWishlist",JSON.stringify(wishlist));

    if(currentUser)
        localStorage.setItem("ecwCurrentUser",JSON.stringify(currentUser));
    else
        localStorage.removeItem("ecwCurrentUser");
}


/* =========================
   SECTION NAVIGATION
========================= */

function showSection(id){

    document.querySelectorAll(".section").forEach(s=>{
        s.classList.remove("active");
    });

    const section=document.getElementById(id);

    if(section){
        section.classList.add("active");
    }

    if(id==="products") displayProducts();
    if(id==="cart") displayCart();
    if(id==="checkout") displayCheckout();
    if(id==="orders") displayOrders();
    if(id==="wishlist") displayWishlist();
    if(id==="profile") displayProfile();
    if(id==="owner") updateOwner();
}


/* =========================
   PRODUCTS
========================= */

function displayProducts(){

    const grid=document.getElementById("productGrid");

    if(!grid)return;

    const search=(document.getElementById("searchBox")?.value || "").toLowerCase();

    const category=document.getElementById("categoryFilter")?.value || "All";

    const filtered=products.filter(p=>{

        const matchesSearch=
            p.name.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search);

        const matchesCategory=
            category==="All" || p.category===category;

        return matchesSearch && matchesCategory;
    });

    if(filtered.length===0){
        grid.innerHTML=`
            <div class="empty" style="grid-column:1/-1">
                <div>🔎</div>
                <h3>No products found</h3>
                <p>Try another search or category.</p>
            </div>`;
        return;
    }

    grid.innerHTML=filtered.map(productCard).join("");
}


function productCard(p){

    const liked=wishlist.includes(p.id);

    const image=p.image
        ? `<img src="${p.image}" alt="${p.name}">`
        : `<span>${p.emoji}</span>`;

    return `
        <div class="product">

            <button class="wish" onclick="toggleWishlist(${p.id})">
                ${liked?"❤️":"🤍"}
            </button>

            <div class="product-image">
                ${image}
            </div>

            <div class="product-info">

                <span class="category">${p.category}</span>

                <h3>${p.name}</h3>

                <p class="description">${p.description}</p>

                <div class="price">₹${Number(p.price).toLocaleString("en-IN")}</div>

                <div class="product-actions">

                    <button onclick="viewProduct(${p.id})">
                        View
                    </button>

                    <button class="add" onclick="addToCart(${p.id})">
                        Add to Cart
                    </button>

                </div>

            </div>
        </div>
    `;
}


function filterProducts(){
    displayProducts();
}


/* =========================
   PRODUCT DETAILS
========================= */

function viewProduct(id){

    const p=products.find(x=>x.id===id);

    if(!p)return;

    const image=p.image
        ? `<img src="${p.image}" alt="${p.name}">`
        : `<span>${p.emoji}</span>`;

    document.getElementById("productDetails").innerHTML=`

        <button class="secondary" onclick="showSection('products')">
            ← Back to Products
        </button>

        <div class="detail-card">

            <div class="detail-image">
                ${image}
            </div>

            <div class="detail-info">

                <span class="category">${p.category}</span>

                <h1>${p.name}</h1>

                <p>${p.description}</p>

                <div class="price">
                    ₹${Number(p.price).toLocaleString("en-IN")}
                </div>

                <button class="primary"
                    onclick="addToCart(${p.id});showSection('cart')">
                    🛒 Add to Cart
                </button>

                <button class="secondary"
                    onclick="toggleWishlist(${p.id})">
                    ❤️ Add to Wishlist
                </button>

            </div>

        </div>
    `;

    showSection("details");
}


/* =========================
   CART
========================= */

function addToCart(id){

    const item=cart.find(x=>x.id===id);

    if(item){
        item.qty++;
    }else{
        cart.push({id:id,qty:1});
    }

    saveData();
    updateCartCount();
    displayCart();

    toast("Product added to cart 🛒");
}


function updateCartCount(){

    const count=cart.reduce((sum,item)=>sum+item.qty,0);

    document.getElementById("cartCount").textContent=count;
}


function displayCart(){

    const area=document.getElementById("cartArea");

    if(!area)return;

    if(cart.length===0){

        area.innerHTML=`
            <div class="empty">
                <div>🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add products to continue shopping.</p>
                <button class="primary"
                    onclick="showSection('products')">
                    Explore Products
                </button>
            </div>`;

        return;
    }

    let total=0;

    const items=cart.map(item=>{

        const p=products.find(x=>x.id===item.id);

        if(!p)return "";

        total+=p.price*item.qty;

        const image=p.image
            ? `<img src="${p.image}">`
            : p.emoji;

        return `
            <div class="cart-item">

                <div class="cart-img">${image}</div>

                <div class="cart-details">
                    <h3>${p.name}</h3>
                    <p class="category">${p.category}</p>
                    <b>₹${Number(p.price).toLocaleString("en-IN")}</b>
                </div>

                <div class="qty">
                    <button onclick="changeQty(${p.id},-1)">−</button>
                    <b>${item.qty}</b>
                    <button onclick="changeQty(${p.id},1)">+</button>
                </div>

                <b>₹${Number(p.price*item.qty).toLocaleString("en-IN")}</b>

                <button class="remove"
                    onclick="removeFromCart(${p.id})">
                    Remove
                </button>

            </div>
        `;
    }).join("");

    area.innerHTML=`

        ${items}

        <div class="cart-summary">

            <div class="total">
                <span>Total</span>
                <span>₹${Number(total).toLocaleString("en-IN")}</span>
            </div>

            <button class="primary full"
                onclick="startCheckout()">
                Proceed to Checkout →
            </button>

        </div>
    `;
}


function changeQty(id,value){

    const item=cart.find(x=>x.id===id);

    if(!item)return;

    item.qty+=value;

    if(item.qty<=0){
        cart=cart.filter(x=>x.id!==id);
    }

    saveData();
    updateCartCount();
    displayCart();
}


function removeFromCart(id){

    cart=cart.filter(x=>x.id!==id);

    saveData();
    updateCartCount();
    displayCart();

    toast("Item removed");
}


function startCheckout(){

    if(!currentUser){
        toast("Please login first 🔐");
        openLogin();
        return;
    }

    showSection("checkout");
    displayCheckout();
}


function displayCheckout(){

    if(cart.length===0){
        showSection("cart");
        toast("Your cart is empty");
    }
}


/* =========================
   PAYMENT
========================= */

function paymentChanged(){

    const selected=document.querySelector(
        'input[name="payment"]:checked'
    );

    const box=document.getElementById("paymentBox");

    if(!selected){
        box.innerHTML="";
        return;
    }

    if(selected.value==="COD"){

        box.innerHTML=`
            <div class="payment-info">
                💵 <b>Cash on Delivery</b>
                <p>Pay when your order arrives.</p>
            </div>
        `;
    }

    if(selected.value==="UPI"){

        box.innerHTML=`
            <input id="upiId"
                placeholder="Enter UPI ID e.g. pavani@upi">

            <p class="description">
                Prototype payment interface.
            </p>
        `;
    }

    if(selected.value==="CARD"){

        box.innerHTML=`
            <input id="cardNumber"
                maxlength="19"
                placeholder="Card Number">

            <div class="two">
                <input id="cardExpiry"
                    placeholder="MM/YY">

                <input id="cardCVV"
                    maxlength="3"
                    type="password"
                    placeholder="CVV">
            </div>

            <input id="cardName"
                placeholder="Name on Card">
        `;
    }

    if(selected.value==="NET"){

        box.innerHTML=`
            <select id="bank">
                <option value="">Select Bank</option>
                <option>State Bank of India</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Axis Bank</option>
                <option>Canara Bank</option>
                <option>Bank of Baroda</option>
            </select>
        `;
    }
}


/* =========================
   ORDER
========================= */

function placeOrder(){

    if(!currentUser){
        toast("Please login first");
        openLogin();
        return;
    }

    if(cart.length===0){
        toast("Cart is empty");
        return;
    }

    const name=document.getElementById("deliveryName").value.trim();
    const phone=document.getElementById("deliveryPhone").value.trim();
    const address=document.getElementById("deliveryAddress").value.trim();
    const city=document.getElementById("deliveryCity").value.trim();
    const pin=document.getElementById("deliveryPin").value.trim();

    const payment=document.querySelector(
        'input[name="payment"]:checked'
    );

    if(!name || !phone || !address || !city || !pin){
        toast("Please fill all delivery details");
        return;
    }

    if(!/^\d{10}$/.test(phone)){
        toast("Enter valid 10 digit phone number");
        return;
    }

    if(!/^\d{6}$/.test(pin)){
        toast("Enter valid 6 digit PIN");
        return;
    }

    if(!payment){
        toast("Please select payment method");
        return;
    }

    const items=cart.map(item=>{

        const p=products.find(x=>x.id===item.id);

        return {
            id:p.id,
            name:p.name,
            price:p.price,
            qty:item.qty,
            emoji:p.emoji,
            image:p.image
        };
    });

    const total=items.reduce(
        (sum,item)=>sum+item.price*item.qty,0
    );

    const order={
        id:"ECW"+Date.now().toString().slice(-8),
        user:currentUser.phone,
        customerName:name,
        phone:phone,
        address:address,
        city:city,
        pin:pin,
        payment:payment.value,
        items:items,
        total:total,
        date:new Date().toLocaleString("en-IN"),
        status:0
    };

    orders.unshift(order);

    cart=[];

    saveData();
    updateCartCount();

    generateBill(order);

    showSuccess(order);
}


function showSuccess(order){

    document.getElementById("billContent").innerHTML=`

        <div class="success-card">

            <div class="success-icon">✓</div>

            <h1>Order Placed Successfully!</h1>

            <p>Thank you for shopping with ECW ❤️</p>

            <h3>Order ID: ${order.id}</h3>

            <p>Total: ₹${Number(order.total).toLocaleString("en-IN")}</p>

            <button class="primary"
                onclick="showSection('orders')">
                Track Order 📦
            </button>

            <button class="secondary"
                onclick="showSection('bill')">
                View Invoice 🧾
            </button>

        </div>
    `;

    showSection("bill");

    toast("Order placed successfully 🎉");
}


/* =========================
   ORDERS
========================= */

function displayOrders(){

    const area=document.getElementById("ordersArea");

    if(!area)return;

    if(!currentUser){

        area.innerHTML=`
            <div class="empty">
                <div>🔐</div>
                <h3>Please login</h3>
                <button class="primary" onclick="openLogin()">
                    Login
                </button>
            </div>`;

        return;
    }

    const myOrders=orders.filter(
        o=>o.user===currentUser.phone
    );

    if(myOrders.length===0){

        area.innerHTML=`
            <div class="empty">
                <div>📦</div>
                <h3>No orders yet</h3>
                <button class="primary"
                    onclick="showSection('products')">
                    Start Shopping
                </button>
            </div>`;

        return;
    }

    area.innerHTML=myOrders.map(order=>`

        <div class="order-card">

            <div class="order-top">
                <div>
                    <div class="order-id">#${order.id}</div>
                    <small>${order.date}</small>
                </div>

                <span class="status">
                    ${statusText(order.status)}
                </span>
            </div>

            <div class="tracking">
                ${trackingHTML(order.status)}
            </div>

            <p><b>Payment:</b> ${paymentName(order.payment)}</p>

            <p><b>Total:</b>
                ₹${Number(order.total).toLocaleString("en-IN")}
            </p>

            <button class="secondary"
                onclick="generateBill(orders.find(o=>o.id==='${order.id}'))">
                🧾 View Invoice
            </button>

        </div>

    `).join("");
}


function statusText(status){

    const names=[
        "Order Placed",
        "Confirmed",
        "Shipped",
        "Out for Delivery",
        "Delivered"
    ];

    return names[status] || names[0];
}


function trackingHTML(status){

    const names=[
        ["✓","Placed"],
        ["✓","Confirmed"],
        ["🚚","Shipped"],
        ["📍","Out for Delivery"],
        ["✓","Delivered"]
    ];

    return names.map((x,i)=>`

        <div class="track-step ${i<=status?"done":""}">

            <div class="track-dot">${x[0]}</div>

            <span>${x[1]}</span>

        </div>

    `).join("");
}


function paymentName(value){

    return {
        COD:"Cash on Delivery",
        UPI:"UPI",
        CARD:"Credit / Debit Card",
        NET:"Net Banking"
    }[value] || value;
}


/* =========================
   WISHLIST
========================= */

function toggleWishlist(id){

    if(wishlist.includes(id)){

        wishlist=wishlist.filter(x=>x!==id);
        toast("Removed from wishlist");

    }else{

        wishlist.push(id);
        toast("Added to wishlist ❤️");
    }

    saveData();

    displayProducts();
    displayWishlist();
    displayProfile();
}


function displayWishlist(){

    const area=document.getElementById("wishlistArea");

    if(!area)return;

    const items=products.filter(
        p=>wishlist.includes(p.id)
    );

    if(items.length===0){

        area.innerHTML=`
            <div class="empty">
                <div>❤️</div>
                <h3>Your wishlist is empty</h3>
                <p>Save products you love.</p>
            </div>`;

        return;
    }

    area.innerHTML=`
        <div class="product-grid">
            ${items.map(productCard).join("")}
        </div>
    `;
}


/* =========================
   PROFILE
========================= */

function displayProfile(){

    if(!currentUser){

        document.getElementById("profileName").textContent="Guest";
        document.getElementById("profilePhone").textContent=
            "Please login to view your profile.";

        return;
    }

    document.getElementById("profileName").textContent=
        currentUser.name;

    document.getElementById("profilePhone").textContent=
        "📱 "+currentUser.phone;

    const myOrders=orders.filter(
        o=>o.user===currentUser.phone
    );

    const spent=myOrders.reduce(
        (sum,o)=>sum+o.total,0
    );

    document.getElementById("profileOrders").textContent=
        myOrders.length;

    document.getElementById("profileWishlist").textContent=
        wishlist.length;

    document.getElementById("profileSpent").textContent=
        "₹"+Number(spent).toLocaleString("en-IN");
}


/* =========================
   LOGIN / SIGNUP
========================= */

function openLogin(){

    document.getElementById("authModal").classList.add("show");

    showLogin();
}


function closeAuth(){

    document.getElementById("authModal").classList.remove("show");
}


function showLogin(){

    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("signupForm").classList.add("hidden");
    document.getElementById("otpForm").classList.add("hidden");
}


function showSignup(){

    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("signupForm").classList.remove("hidden");
    document.getElementById("otpForm").classList.add("hidden");
}


function login(){

    const phone=document.getElementById("loginPhone").value.trim();
    const password=document.getElementById("loginPassword").value;

    if(!/^\d{10}$/.test(phone)){
        toast("Enter valid phone number");
        return;
    }

    const user=users.find(
        u=>u.phone===phone && u.password===password
    );

    if(!user){
        toast("Invalid phone number or password");
        return;
    }

    currentUser=user;

    saveData();

    closeAuth();
    updateHeader();
    displayProfile();

    toast("Welcome back, "+user.name+" 👋");
}


function signup(){

    const name=document.getElementById("signupName").value.trim();
    const phone=document.getElementById("signupPhone").value.trim();
    const password=document.getElementById("signupPassword").value;

    if(!name || !phone || !password){
        toast("Please fill all fields");
        return;
    }

    if(!/^\d{10}$/.test(phone)){
        toast("Enter valid 10 digit phone number");
        return;
    }

    if(password.length<4){
        toast("Password must contain at least 4 characters");
        return;
    }

    if(users.some(u=>u.phone===phone)){
        toast("Phone number already registered");
        return;
    }

    pendingSignup={
        name:name,
        phone:phone,
        password:password
    };

    document.getElementById("signupForm").classList.add("hidden");
    document.getElementById("otpForm").classList.remove("hidden");

    toast("OTP sent! Use 1234 for prototype.");
}


function verifyOTP(){

    const otp=document.getElementById("otpInput").value.trim();

    if(otp!=="1234"){
        toast("Invalid OTP");
        return;
    }

    users.push(pendingSignup);

    currentUser=pendingSignup;

    pendingSignup=null;

    saveData();

    closeAuth();

    updateHeader();
    displayProfile();

    toast("Account created successfully 🎉");
}


function logout(){

    currentUser=null;

    saveData();
    updateHeader();

    toast("Logged out successfully");
}


function updateHeader(){

    const login=document.getElementById("loginNav");
    const logout=document.getElementById("logoutNav");

    if(currentUser){

        login.classList.add("hidden");
        logout.classList.remove("hidden");

    }else{

        login.classList.remove("hidden");
        logout.classList.add("hidden");
    }
}


/* =========================
   OWNER
========================= */

function ownerLogin(){

    const phone=document.getElementById("ownerPhone").value.trim();
    const password=document.getElementById("ownerPassword").value;

    if(phone===OWNER_PHONE && password===OWNER_PASSWORD){

        ownerActive=true;

        document.getElementById("ownerLoginBox")
            .classList.add("hidden");

        document.getElementById("ownerDashboard")
            .classList.remove("hidden");

        updateOwner();

        toast("Owner login successful 👨‍💼");

    }else{

        toast("Invalid owner credentials");
    }
}


function ownerLogout(){

    ownerActive=false;

    document.getElementById("ownerLoginBox")
        .classList.remove("hidden");

    document.getElementById("ownerDashboard")
        .classList.add("hidden");
}


function updateOwner(){

    if(!ownerActive)return;

    document.getElementById("statProducts").textContent=
        products.length;

    document.getElementById("statOrders").textContent=
        orders.length;

    document.getElementById("statCustomers").textContent=
        users.length;

    const sales=orders.reduce(
        (sum,o)=>sum+o.total,0
    );

    document.getElementById("statSales").textContent=
        "₹"+Number(sales).toLocaleString("en-IN");

    displayManageProducts();
}


function displayManageProducts(){

    const area=document.getElementById("manageProducts");

    if(products.length===0){
        area.innerHTML="<p class='no-data'>No products.</p>";
        return;
    }

    area.innerHTML=products.map(p=>{

        const image=p.image
            ? `<img src="${p.image}">`
            : p.emoji;

        return `
            <div class="manage-item">

                <div class="manage-img">
                    ${image}
                </div>

                <div class="manage-text">
                    <b>${p.name}</b>
                    <small>
                        ${p.category} • ₹${Number(p.price).toLocaleString("en-IN")}
                    </small>
                </div>

                <div class="manage-actions">

                    <button class="edit"
                        onclick="editProduct(${p.id})">
                        ✏️
                    </button>

                    <button class="danger"
                        onclick="deleteProduct(${p.id})">
                        🗑️
                    </button>

                </div>

            </div>
        `;
    }).join("");
}


/* =========================
   IMAGE UPLOAD
========================= */

function previewImage(event){

    const file=event.target.files[0];

    if(!file)return;

    const reader=new FileReader();

    reader.onload=function(e){

        selectedImage=e.target.result;

        document.getElementById("imagePreview").innerHTML=`
            <img src="${selectedImage}">
        `;
    };

    reader.readAsDataURL(file);
}


/* =========================
   ADD / EDIT PRODUCT
========================= */

function saveProduct(){

    const name=document.getElementById("productName").value.trim();
    const category=document.getElementById("productCategory").value;
    const price=Number(document.getElementById("productPrice").value);
    const description=document.getElementById("productDescription").value.trim();
    const emoji=document.getElementById("productEmoji").value;
    const editId=document.getElementById("editProductId").value;

    if(!name || !price || !description){
        toast("Fill all product details");
        return;
    }

    if(editId){

        const p=products.find(
            x=>x.id===Number(editId)
        );

        if(p){

            p.name=name;
            p.category=category;
            p.price=price;
            p.description=description;
            p.emoji=emoji;

            if(selectedImage){
                p.image=selectedImage;
            }

            toast("Product updated ✏️");
        }

    }else{

        products.push({
            id:Date.now(),
            name:name,
            category:category,
            price:price,
            description:description,
            emoji:emoji,
            image:selectedImage
        });

        toast("Product added successfully 🎉");
    }

    saveData();

    resetProductForm();
    displayProducts();
    updateOwner();
}


function editProduct(id){

    const p=products.find(x=>x.id===id);

    if(!p)return;

    document.getElementById("editProductId").value=p.id;
    document.getElementById("productName").value=p.name;
    document.getElementById("productCategory").value=p.category;
    document.getElementById("productPrice").value=p.price;
    document.getElementById("productDescription").value=p.description;
    document.getElementById("productEmoji").value=p.emoji;

    selectedImage=p.image || "";

    document.getElementById("productFormTitle").textContent=
        "Edit Product";

    document.getElementById("cancelEdit")
        .classList.remove("hidden");

    if(p.image){

        document.getElementById("imagePreview").innerHTML=
            `<img src="${p.image}">`;
    }

    document.getElementById("productName")
        .scrollIntoView({behavior:"smooth"});
}


function resetProductForm(){

    document.getElementById("editProductId").value="";
    document.getElementById("productName").value="";
    document.getElementById("productPrice").value="";
    document.getElementById("productDescription").value="";
    document.getElementById("productImage").value="";
    document.getElementById("imagePreview").innerHTML="";

    selectedImage="";

    document.getElementById("productFormTitle").textContent=
        "Add New Product";

    document.getElementById("cancelEdit")
        .classList.add("hidden");
}


function deleteProduct(id){

    const p=products.find(x=>x.id===id);

    if(!p)return;

    if(!confirm(`Delete ${p.name}?`))return;

    products=products.filter(x=>x.id!==id);

    cart=cart.filter(x=>x.id!==id);

    wishlist=wishlist.filter(x=>x!==id);

    saveData();

    updateCartCount();
    displayProducts();
    displayCart();
    displayWishlist();
    updateOwner();

    toast("Product deleted");
}


/* =========================
   BILL / INVOICE
========================= */

function generateBill(order){

    if(!order)return;

    const subtotal=order.total;
    const gst=0;
    const grand=order.total;

    document.getElementById("billContent").innerHTML=`

        <div class="bill">

            <div class="bill-header">

                <div>
                    <h1>✦ ECW</h1>
                    <p>Everything You Need</p>
                    <p>Smart Shopping. Simple Living.</p>
                </div>

                <div>
                    <b>INVOICE</b>
                    <p>#${order.id}</p>
                    <p>${order.date}</p>
                </div>

            </div>

            <br>

            <h3>Bill To</h3>

            <p>${order.customerName}</p>
            <p>${order.phone}</p>
            <p>${order.address}, ${order.city} - ${order.pin}</p>

            <table class="bill-table">

                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>

                    ${order.items.map(item=>`

                        <tr>
                            <td>${item.name}</td>
                            <td>${item.qty}</td>
                            <td>₹${Number(item.price).toLocaleString("en-IN")}</td>
                            <td>₹${Number(item.price*item.qty).toLocaleString("en-IN")}</td>
                        </tr>

                    `).join("")}

                </tbody>

            </table>

            <div class="bill-total">

                <div>
                    <span>Subtotal</span>
                    <b>₹${Number(subtotal).toLocaleString("en-IN")}</b>
                </div>

                <div>
                    <span>GST</span>
                    <b>₹${gst}</b>
                </div>

                <div>
                    <span>Delivery</span>
                    <b>FREE</b>
                </div>

                <div class="bill-grand">
                    <span>Total</span>
                    <b>₹${Number(grand).toLocaleString("en-IN")}</b>
                </div>

            </div>

            <p style="margin-top:25px">
                <b>Payment:</b> ${paymentName(order.payment)}
            </p>

            <p style="margin-top:20px;text-align:center">
                ✓ Payment Confirmed
            </p>

            <p style="text-align:center">
                Thank you for shopping with ECW ❤️
            </p>

            <button class="print-btn"
                onclick="window.print()">
                🖨 Print / Save Bill
            </button>

        </div>
    `;

    showSection("bill");
}


/* =========================
   THEME
========================= */

function toggleTheme(){

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "ecwTheme",
        document.body.classList.contains("dark")
            ? "dark"
            : "light"
    );
}


/* =========================
   TOAST
========================= */

let toastTimer;

function toast(message){

    const box=document.getElementById("toast");

    box.textContent=message;
    box.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer=setTimeout(()=>{
        box.classList.remove("show");
    },2500);
}


/* =========================
   INITIALIZATION
========================= */

function init(){

    if(localStorage.getItem("ecwTheme")==="dark"){
        document.body.classList.add("dark");
    }

    saveData();

    updateCartCount();
    updateHeader();
    displayProducts();
    displayCart();
    displayWishlist();
    displayProfile();

    document.getElementById("ownerDashboard")
        .classList.add("hidden");

    document.getElementById("ownerLoginBox")
        .classList.remove("hidden");
}

init();