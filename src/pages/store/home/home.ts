import { PRODUCTS, getCategories } from '../../../data/data';
import type { Product, CartItem } from '../../../types/product';

const productContainer = document.getElementById('product-container') as HTMLDivElement;
const categoryBar = document.getElementById('category-bar') as HTMLDivElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;

let currentCategory: number | null = null;
let currentSearch: string = '';

function renderProducts(products: Product[]) {
  productContainer.innerHTML = '';
  const visible = products.filter(p => p.disponible);
  if (visible.length === 0) {
    productContainer.innerHTML = '<p style="color:rgba(255,255,255,0.4);text-align:center;padding:40px 0;">No hay coincidencias.</p>';
    return;
  }
  visible.forEach(p => {
    const div = document.createElement('div');
    div.className = 'glass-card';
    div.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <div class="card-body">
        <h3>${p.nombre}</h3>
        <p>$${p.precio}</p>
        <button data-id="${p.id}" class="btn-add">Agregar al Carrito</button>
      </div>
    `;
    productContainer.appendChild(div);
  });

  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number((e.target as HTMLButtonElement).dataset.id);
      addToCart(id);
    });
  });
}

function renderCategories() {
  const cats = getCategories();
  categoryBar.innerHTML = '';

  const allPill = document.createElement('button');
  allPill.className = 'cat-pill active';
  allPill.textContent = 'Todos';
  allPill.addEventListener('click', () => {
    setActivePill(allPill);
    currentCategory = null;
    filterProducts();
  });
  categoryBar.appendChild(allPill);

  const divider = document.createElement('div');
  divider.className = 'cat-divider';
  categoryBar.appendChild(divider);

  cats.forEach(c => {
    const pill = document.createElement('button');
    pill.className = 'cat-pill';
    pill.textContent = c.nombre;
    pill.addEventListener('click', () => {
      setActivePill(pill);
      currentCategory = c.id;
      filterProducts();
    });
    categoryBar.appendChild(pill);
  });
}

function setActivePill(active: HTMLButtonElement) {
  categoryBar.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  active.classList.add('active');
}

function filterProducts() {
  let filtered = PRODUCTS;
  if (currentCategory !== null) {
    filtered = filtered.filter(p => p.categorias.some(c => c.id === currentCategory));
  }
  if (currentSearch.trim() !== '') {
    filtered = filtered.filter(p => p.nombre.toLowerCase().includes(currentSearch.toLowerCase()));
  }
  renderProducts(filtered);
}

function addToCart(productId: number) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.cantidad += 1;
  } else {
    cart.push({ ...product, cantidad: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
}

searchInput.addEventListener('input', (e) => {
  currentSearch = (e.target as HTMLInputElement).value;
  filterProducts();
});

renderCategories();
renderProducts(PRODUCTS);