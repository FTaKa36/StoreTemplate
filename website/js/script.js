// ---------- Helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const rupiah = n => 'Rp ' + n.toLocaleString('id-ID');

// ---------- Page navigation ----------
function navigate(pageId) {
    $$('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(pageId);
    if (!page) return;
    page.classList.add('active');
    window.scrollTo(0, 0);
    if (pageId === 'HKeranjang') renderCart();
    if (pageId === 'KonBayar') renderConfirm();
    setTimeout(initReveal, 50);
}

// Mobile menu toggle
function toggleMobileNav(btn) {
    const open = $('.NavBar').classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.innerHTML = open ? '&times;' : '&#9776;';
}

function closeMobileNav() {
    const nav = $('.NavBar');
    const btn = $('.NavToggle');
    nav.classList.remove('open');
    if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '&#9776;';
    }
}

// Scroll reveal
function initReveal() {
    const items = $$('.reveal:not(.visible)');
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('visible'));
        return;
    }
    const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add('visible');
                io.unobserve(en.target);
            }
        });
    }, { threshold: 0.15 });
    items.forEach(el => io.observe(el));
}

// Open home page and scroll to a section\nfunction goHome(sectionId) {\n    navigate('home');\n    const el = document.getElementById(sectionId);\n    if (el) el.scrollIntoView({ behavior: 'smooth' });\n}\n\n// ---------- Guestbook ----------
function toggleGuestBook() {
    const form = document.getElementById('guestBookForm');
    const open = form.style.display === 'block';
    form.style.display = open ? 'none' : 'block';
}

// ---------- Login / register (localStorage only) ----------
function showRegister() {
    $('#loginForm').style.display = 'none';
    $('#registerForm').style.display = 'block';
}

function showLogin() {
    $('#registerForm').style.display = 'none';
    $('#loginForm').style.display = 'block';
}

function showWelcome(name) {
    $('#userName').textContent = name;
    $('#loginForm').style.display = 'none';
    $('#registerForm').style.display = 'none';
    $('#userWelcome').style.display = 'block';
}

function logout() {
    localStorage.removeItem('userName');
    $('#userWelcome').style.display = 'none';
    $('#loginForm').style.display = 'block';
}

$('#loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#loginEmail').value.split('@')[0];
    localStorage.setItem('userName', name);
    showWelcome(name);
});

$('#registerForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#registerName').value;
    localStorage.setItem('userName', name);
    showWelcome(name);
});

// ---------- Cart ----------
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const badge = $('#cartCount');
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    if (badge.textContent !== String(count)) {
        badge.classList.remove('bump');
        void badge.offsetWidth; // restart the animation
        badge.classList.add('bump');
    }
    badge.textContent = count;
}

function parsePrice(text) {
    return parseInt(text.replace(/\D/g, ''), 10) || 0;
}

function addToCart(name, priceText) {
    const existing = cart.find(i => i.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price: parsePrice(priceText), qty: 1 });
    }
    saveCart();
    alert(`Produk "${name}" ditambahkan ke keranjang.`);
}

function changeQty(index, delta) {
    cart[index].qty = Math.max(1, cart[index].qty + delta);
    saveCart();
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

function renderCart() {
    const tbody = $('#cartItems');
    tbody.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${rupiah(item.price)}</td>
            <td>
                <div class="QtyControl">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                    <div class="qty-display">${item.qty}</div>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </div>
            </td>
            <td>${rupiah(subtotal)}</td>
            <td><button class="btn-hapus" onclick="removeItem(${index})">Hapus</button></td>`;
        tbody.appendChild(row);
    });

    $('#totalPrice').textContent = rupiah(total);
    updateCartCount();
}

function renderConfirm() {
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    $('#listPesanan').innerHTML = cart.map(i => `<li>${i.qty}x ${i.name}</li>`).join('');
    $('#totalKonfirmasi').textContent = rupiah(total);
}

// Checkout: require items, then go to payment confirmation
$('#checkoutForm').addEventListener('submit', e => {
    e.preventDefault();
    if (cart.length === 0) {
        alert('Keranjang kosong!');
        return;
    }
    navigate('KonBayar');
});

// Pay: clear cart and show thank-you page
$('.BtnBayarSekarang').addEventListener('click', () => {
    alert('Terima kasih! Pesanan Anda telah dikonfirmasi.');
    cart = [];
    saveCart();
    navigate('BarangDiterima');
});

// Add to cart: product cards (.ProdukItem / .BeritaBox) and detail pages
document.addEventListener('click', e => {
    const btn = e.target.closest('.tombol-beli');
    if (!btn) return;

    // Product detail page
    const detail = btn.closest('.ProdukDetailInfo');
    if (detail) {
        const name = $('.nama-produk', detail).textContent.trim();
        const price = $('.harga', detail).textContent;
        addToCart(name, price);
        return;
    }

    // Product card on the home / category pages
    const card = btn.closest('.ProdukItem');
    if (card) {
        addToCart($('h3', card).textContent.trim(), $('.harga', card).textContent);
    }
});

// Close mobile menu after choosing a link
document.addEventListener('click', e => {
    if (e.target.closest('.NavBar a:not(.submenu-toggle)')) closeMobileNav();
});

// Submenu toggle (mobile)
$$('.submenu-toggle').forEach(toggle => {
    toggle.addEventListener('click', e => {
        e.preventDefault();
        toggle.parentElement.classList.toggle('active');
    });
});

// Search: filter product cards by name
$('.SearchContainer button').addEventListener('click', () => {
    const keyword = $('.SearchContainer input').value.trim().toLowerCase();
    $$('.ProdukItem').forEach(item => {
        const name = $('h3', item).textContent.toLowerCase();
        item.style.display = name.includes(keyword) ? '' : 'none';
    });
});

// ---------- Init ----------
window.addEventListener('load', () => {
    const savedName = localStorage.getItem('userName');
    if (savedName) showWelcome(savedName);
    updateCartCount();
    initReveal();
});
