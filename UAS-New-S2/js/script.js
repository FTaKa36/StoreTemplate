// Navigasi antar halaman
function navigate(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
    
    if (pageId === 'HKeranjang') {
        loadCart();
    }
}

// Toggling buku tamu
function toggleGuestBook() {
    const form = document.getElementById('guestBookForm');
    form.classList.toggle('closed');
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
}

// Ganti tampilan Login/Register
function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLogin() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function logout() {
    document.getElementById('userWelcome').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    localStorage.removeItem('userName');
}

// Simpan login user ke localStorage
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const name = email.split('@')[0];
    localStorage.setItem('userName', name);
    showWelcome(name);
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    localStorage.setItem('userName', name);
    showWelcome(name);
});

function showWelcome(name) {
    document.getElementById('userName').textContent = name;
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('userWelcome').style.display = 'block';
}

window.onload = () => {
    const savedName = localStorage.getItem('userName');
    if (savedName) showWelcome(savedName);
    document.querySelectorAll('.submenu-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const parent = this.parentElement;
        parent.classList.toggle('active');
    });
});
};

// ---------------- Keranjang Belanja ----------------
let cart = [];

function updateCartCount() {
    document.getElementById('cartCount').textContent = cart.length;
}

function addToCart(name, price) {
    const item = { name, price: parseFloat(price.replace(/[^\d]/g, '')), qty: 1 };
    cart.push(item);
    updateCartCount();
    alert(`Produk "${name}" ditambahkan ke keranjang.`);
    localStorage.setItem('cart', JSON.stringify(cart));
}

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('tombol-beli')) {
        const card = e.target.closest('.ProdukItem');
        const name = card.querySelector('h3').textContent;
        const price = card.querySelector('.harga').textContent;
        addToCart(name, price);
    }
});

function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
    const tbody = document.getElementById('cartItems');
    tbody.innerHTML = '';

    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        total += subtotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>Rp ${item.price.toLocaleString()}</td>
            <td>
                <div class="QtyControl">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                    <div class="qty-display">${item.qty}</div>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </div>
            </td>
            <td>Rp ${subtotal.toLocaleString()}</td>
            <td><button class="btn-hapus" onclick="removeItem(${index})">Hapus</button></td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('totalPrice').textContent = `Rp ${total.toLocaleString()}`;
    document.getElementById('totalKonfirmasi').textContent = `Rp ${total.toLocaleString()}`;
    document.getElementById('listPesanan').innerHTML = cart.map(i => `<li>${i.qty}x ${i.name}</li>`).join('');
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty < 1) cart[index].qty = 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// ---------------- Checkout ----------------
document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (cart.length === 0) {
        alert("Keranjang kosong!");
        return;
    }
    navigate('KonBayar');
});

document.querySelector('.BtnBayarSekarang').addEventListener('click', function() {
    alert("Terima kasih! Pesanan Anda telah dikonfirmasi.");
    cart = [];
    localStorage.removeItem('cart');
    loadCart();
    navigate('BarangDiterima');
});

loadCart();

// Event khusus produk detail KBPZX (Poseidon ZX)
const tombolKBPZX = document.getElementById('addToCartKBPZX');
if (tombolKBPZX) {
    tombolKBPZX.addEventListener('click', function () {
        const name = "Poseidon ZX (Blue Switch Edition)";
        const price = "Rp 1.000.000";
        addToCart(name, price);
    });
}

document.querySelector('.SearchContainer button').addEventListener('click', function() {
    const keyword = document.querySelector('.SearchContainer input').value.toLowerCase();
    const produk = document.querySelectorAll('.ProdukItem');

    produk.forEach(item => {
        const nama = item.querySelector('h3').textContent.toLowerCase();
        if (nama.includes(keyword)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});
