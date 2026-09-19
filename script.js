// Set dynamic copyright year
document.getElementById('year').textContent = new Date().getFullYear();

// Product Catalog Data
const products = [
    {
        id: 1,
        name: "Vintage Gold Elegant Dress Watch",
        category: "watches",
        price: 599,
        description: "Elegant gold mesh watch featuring a classic oval dial and intricate band details.",
        badge: "Featured",
        image: "./images/watch1.jpg"
    },
    {
        id: 2,
        name: "Rose Gold Dainty Chain Watch",
        category: "watches",
        price: 649,
        description: "Minimalist rose gold piece perfect for everyday elegance.",
        badge: "New Arrival",
        image: "./images/watch2.jpg"
    },
    {
        id: 3,
        name: "Classic Silver Square Dial Watch",
        category: "watches",
        price: 550,
        description: "Timeless silver square watch with clear numerical markers.",
        badge: "Bestseller",
        image: "./images/watch3.jpg"
    },
    {
        id: 4,
        name: "Gold Oval Vintage Bracelet Watch",
        category: "watches",
        price: 680,
        description: "Vintage-inspired jewelry watch with detailed gold links.",
        badge: "Dainty Pick",
        image: "./images/watch4.jpg"
    },
    {
        id: 5,
        name: "Minimalist Dual-Tone Petite Watch",
        category: "watches",
        price: 620,
        description: "Chic dual-tone watch band designed for subtle sophistication.",
        badge: "Limited",
        image: "./images/watch5.jpg"
    }
];

let cart = [];
let activeCategory = 'all';

// Render Product Catalog
function renderProducts(filterText = '') {
    const grid = document.getElementById('productGrid');
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
        const card = document.createElement('div');
        card.className = "bg-cream-100 rounded-2xl overflow-hidden border border-maroon-900/10 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between";
        card.innerHTML = `
            <div>
                <div class="relative h-64 overflow-hidden bg-cream-200">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    ${p.badge ? `<span class="absolute top-3 left-3 bg-maroon-800/90 text-cream-50 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-gold-500/30">${p.badge}</span>` : ''}
                </div>
                <div class="p-5">
                    <h3 class="font-serif-title font-bold text-lg text-maroon-900 group-hover:text-maroon-700 transition-colors">${p.name}</h3>
                    <p class="text-xs text-charcoal/70 mt-2 line-clamp-2">${p.description}</p>
                </div>
            </div>
            <div class="p-5 pt-0 flex items-center justify-between border-t border-maroon-900/5 mt-2">
                <span class="font-serif-title font-bold text-lg text-maroon-900">₱${p.price.toFixed(2)}</span>
                <button onclick="addToCart(${p.id})" class="px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-cream-50 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm">
                    <i class="fa-solid fa-plus text-[10px]"></i>
                    <span>Add to Bag</span>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Cart Actions
function addToCart(productId) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        const product = products.find(p => p.id === productId);
        cart.push({ ...product, quantity: 1 });
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

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }

    totalEl.textContent = `₱${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-charcoal/60">
                <i class="fa-solid fa-bag-shopping text-4xl mb-3 text-maroon-700/30"></i>
                <p class="text-sm font-medium">Your shopping bag is empty.</p>
                <p class="text-xs text-charcoal/50 mt-1">Explore our watch collection and select your favorite pieces.</p>
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
    if (show) drawer.classList.remove('hidden');
    else drawer.classList.add('hidden');
}

function checkoutViaInstagram() {
    if (cart.length === 0) {
        alert('Your bag is empty!');
        return;
    }

    let message = "Hello KEI & CAL! I would like to order the following dainty pieces:\n\n";
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (Qty: ${item.quantity}) - ₱${(item.price * item.quantity).toFixed(2)}\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: ₱${total.toFixed(2)}\n\nPlease assist me with shipping details and payment options!`;

    window.open(`https://www.instagram.com/_daintypieces_/`, '_blank');
}

function filterCategory(cat) {
    activeCategory = cat;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-maroon-800', 'text-cream-50');
        btn.classList.add('bg-cream-100', 'text-charcoal/80');
    });
    event.target.classList.remove('bg-cream-100', 'text-charcoal/80');
    event.target.classList.add('bg-maroon-800', 'text-cream-50');
    renderProducts();
}

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Search Handlers
document.getElementById('searchInput').addEventListener('input', (e) => renderProducts(e.target.value));
document.getElementById('mobileSearchInput').addEventListener('input', (e) => renderProducts(e.target.value));
document.getElementById('cartBtn').addEventListener('click', () => toggleCartDrawer(true));

// Initial Render
renderProducts();
updateCartUI();