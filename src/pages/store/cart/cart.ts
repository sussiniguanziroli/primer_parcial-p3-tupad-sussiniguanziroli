import type { CartItem } from '../../../types/product';

const cartContainer = document.getElementById('cart-container') as HTMLDivElement;
const cartTotal = document.getElementById('cart-total') as HTMLHeadingElement;

function getCart(): CartItem[] {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
  const cart = getCart();
  cartContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>El carrito está vacío.</p>';
    cartTotal.textContent = 'Total: $0';
    return;
  }

  cart.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}">
      <div class="cart-item-info">
        <h3>${item.nombre}</h3>
        <p>Precio: $${item.precio}</p>
        <p>Subtotal: $${subtotal}</p>
      </div>
      <div class="cart-item-controls">
        <button class="btn-qty btn-restar" data-id="${item.id}">−</button>
        <span class="qty-display">${item.cantidad}</span>
        <button class="btn-qty btn-sumar" data-id="${item.id}">+</button>
        <button class="btn-eliminar" data-id="${item.id}">Eliminar</button>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  cartTotal.textContent = `Total: $${total}`;
  attachEvents();
}

function attachEvents() {
  document.querySelectorAll('.btn-sumar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number((e.target as HTMLButtonElement).dataset.id);
      updateQuantity(id, 1);
    });
  });

  document.querySelectorAll('.btn-restar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number((e.target as HTMLButtonElement).dataset.id);
      updateQuantity(id, -1);
    });
  });

  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number((e.target as HTMLButtonElement).dataset.id);
      removeItem(id);
    });
  });
}

function updateQuantity(id: number, change: number) {
  let cart = getCart();
  const item = cart.find(p => p.id === id);
  if (item) {
    item.cantidad += change;
    if (item.cantidad <= 0) {
      cart = cart.filter(p => p.id !== id);
    }
    saveCart(cart);
    renderCart();
  }
}

function removeItem(id: number) {
  let cart = getCart().filter(p => p.id !== id);
  saveCart(cart);
  renderCart();
}

renderCart();