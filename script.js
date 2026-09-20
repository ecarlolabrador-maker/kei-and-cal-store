// Set dynamic copyright year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Product Catalog Data
const products = [
    {
        id: 1,
        name: "Vintage Gold Small Round Dial Watch",
        category: "watches",
        price: 250,
        description: "Classic gold-tone vintage watch featuring a petite round dial face and intricate patterned metallic link band.",
        badge: "Featured",
        image: "./images/watch1.jpg",
        isAvailable: false
    },
    {
        id: 2,
        name: "Vintage Gold Square Dial Bracelet Watch",
        category: "watches",
        price: 250,
        description: "Elegant gold watch with a distinct square face and detailed textured link strap.",
        badge: "Popular",
        image: "./images/watch2.jpg",
        isAvailable: false
    },
    {
        id: 3,
        name: "Red Accent Gold Chain Bracelet Watch",
        category: "watches",
        price: 250,
        description: "Dainty round watch featuring a bold red bezel trim paired with an interwoven gold and red leather-style chain band.",
        badge: "New Arrival",
        image: "./images/watch3.jpg",
        isAvailable: true
    },
    {
        id: 4,
        name: "Silver Floral Crystal Bracelet Watch",
        category: "watches",
        price: 250,
        description: "Jewelry-inspired silver watch featuring a diamond-shaped dial surrounded by sparkling crystal floral-pattern link connectors.",
        badge: "Casual Elegance",
        image: "./images/watch4.jpg",
        isAvailable: false
    },
    {
        id: 5,
        name: "Silver Red Dial Floral Crystal Watch",
        category: "watches",
        price: 250,
        description: "Charming silver jewelry watch featuring a striking red round dial, crystal-studded bezel, and delicate floral rhinestone link accents.",
        badge: "Dainty Pick",
        image: "./images/watch5.jpg",
        isAvailable: true
    }
];

let cart = [];
let activeCategory = 'all';

// Render Product Catalog
function renderProducts(filterText = '') {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = products.filter(p => {
        const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(filterText.toLowerCase()) || 
                              p.description.toLowerCase().includes(filterText.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12 text-charcoal/60">
                <i class="fa-regular fa-face-frown text-3xl mb-2 text-maroon-700/50"></i>
                <p class="text-sm">No pieces found matching your query.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(p => {
        const isSoldOut = p.isAvailable === false;
        const card = document.createElement('div');
        card.className = "bg-cream-100 rounded-2xl overflow-hidden border border-maroon-900/10 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between relative";
        
        card.innerHTML = `
            <div>
                <div onclick="openQuickView(${p.id})" class="relative h-64 overflow-hidden bg-cream-200 cursor-pointer">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isSoldOut ? 'opacity-60 grayscale-[30%]' : ''}">
                    
                    ${isSoldOut 
                        ? `<span class="absolute top-3 left-3 bg-red-900 text-cream-50 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-red-500/30">SOLD OUT</span>`
                        : (p.badge ? `<span class="absolute top-3 left-3 bg-maroon-800/90 text-cream-50 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-gold-500/30">${p.badge}</span>` : '')
                    }
                </div>
                <div class="p-5">
                    <h3 onclick="openQuickView(${p.id})" class="font-serif-title font-bold text-lg text-maroon-900 group-hover:text-maroon-700 transition-colors cursor-pointer">${p.name}</h3>
                    <p class="text-xs text-charcoal/70 mt-2 line-clamp-2">${p.description}</p>
                </div>
            </div>
            <div class="p-5 pt-0 flex items-center justify-between border-t border-maroon-900/5 mt-2">
                <span class="font-serif-title font-bold text-lg text-maroon-900">₱${p.price.toFixed(2)}</span>
                
                ${isSoldOut 
                    ? `<button disabled class="px-4 py-2 bg-charcoal/20 text-charcoal/50 rounded-full text-xs font-semibold cursor-not-allowed">
                        <span>Sold Out</span>
                       </button>`
                    : `<button onclick="addToCart(${p.id})" class="px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-cream-50 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm">
                        <i class="fa-solid fa-plus text-[10px]"></i>
                        <span>Add to Bag</span>
                       </button>`
                }
            </div>
        `;
        grid.appendChild(card);
    });
}

// Quick View Modal
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modalImg = document.getElementById('modalMainImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalDesc = document.getElementById('modalDescription');

    if (modalImg) modalImg.src = product.image;
    if (modalTitle) modalTitle.textContent = product.name;
    if (modalPrice) modalPrice.textContent = `₱${product.price.toFixed(2)}`;
    if (modalDesc) modalDesc.textContent = product.description;

    openModal('quickViewModal');
}

// Cart Actions
function addToCart(productId) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        const product = products.find(p => p.id === productId);
        if (product) cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    toggleCartDrawer(true);
}

function updateCartQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cartItemsContainer');
    const badge = document.getElementById('cartBadge');
    const totalEl = document.getElementById('cartTotal');

    if (!container || !totalEl) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (badge) {
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    totalEl.textContent = `₱${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-charcoal/60">
                <i class="fa-solid fa-bag-shopping text-4xl mb-3 text-maroon-700/30"></i>
                <p class="text-sm font-medium">Your shopping bag is empty.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    cart.forEach(item => {
        const el = document.createElement('div');
        el.className = "flex items-center gap-4 bg-cream-100 p-3 rounded-xl border border-maroon-900/10";
        el.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
            <div class="flex-grow">
                <h4 class="font-serif-title font-bold text-sm text-maroon-900">${item.name}</h4>
                <span class="text-xs text-maroon-800 font-semibold">₱${item.price.toFixed(2)}</span>
                <div class="flex items-center gap-2 mt-2">
                    <button onclick="updateCartQuantity(${item.id}, -1)" class="w-5 h-5 bg-cream-200 rounded text-xs font-bold text-maroon-900 flex items-center justify-center">-</button>
                    <span class="text-xs font-semibold px-1">${item.quantity}</span>
                    <button onclick="updateCartQuantity(${item.id}, 1)" class="w-5 h-5 bg-cream-200 rounded text-xs font-bold text-maroon-900 flex items-center justify-center">+</button>
                </div>
            </div>
            <button onclick="updateCartQuantity(${item.id}, -${item.quantity})" class="text-charcoal/40 hover:text-maroon-800 p-1">
                <i class="fa-solid fa-trash-can text-sm"></i>
            </button>
        `;
        container.appendChild(el);
    });
}

function toggleCartDrawer(show) {
    const drawer = document.getElementById('cartDrawer');
    if (!drawer) return;
    if (show) drawer.classList.remove('hidden');
    else drawer.classList.add('hidden');
}

function checkoutViaInstagram() {
    if (cart.length === 0) {
        alert('Your bag is empty!');
        return;
    }

    let message = "✨ NEW ORDER - KEI & CAL ✨\n\n";
    message += "📦 Selected Items:\n";
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (Qty: ${item.quantity}) - ₱${(item.price * item.quantity).toFixed(2)}\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\n💰 Total Amount: ₱${total.toFixed(2)}\n\nPlease assist me with shipping details!`;

    navigator.clipboard.writeText(message).then(() => {
        alert('Order copied! Paste it in our Instagram DM.');
        window.open('https://www.instagram.com/_daintypieces_/', '_blank');
    }).catch(() => {
        window.open('https://www.instagram.com/_daintypieces_/', '_blank');
    });
}

function filterCategory(cat) {
    activeCategory = cat;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-maroon-800', 'text-cream-50');
        btn.classList.add('bg-cream-100', 'text-charcoal/80');
    });
    if (event && event.target) {
        event.target.classList.remove('bg-cream-100', 'text-charcoal/80');
        event.target.classList.add('bg-maroon-800', 'text-cream-50');
    }
    renderProducts();
}

function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Search & Nav Handlers
const searchInput = document.getElementById('searchInput');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const cartBtn = document.getElementById('cartBtn');

if (searchInput) searchInput.addEventListener('input', (e) => renderProducts(e.target.value));
if (mobileSearchInput) mobileSearchInput.addEventListener('input', (e) => renderProducts(e.target.value));
if (cartBtn) cartBtn.addEventListener('click', () => toggleCartDrawer(true));

// Initial Render
renderProducts();
updateCartUI();