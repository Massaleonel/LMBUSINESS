// Sélection des éléments
const cartBtn = document.querySelector('.cart-icon');
const closeCartBtn = document.querySelector('.close-cart');
const cartOverlay = document.querySelector('.cart-overlay');
const addToCartBtns = document.querySelectorAll('.add-to-cart');
const cartContent = document.querySelector('.cart-content');
const cartTotal = document.querySelector('.cart-total-amount');
const cartCount = document.querySelector('.cart-count');

// Panier
let cart = [];

// Charger le panier depuis le localStorage au chargement de la page
function loadCartFromLocalStorage() {
    const stored = localStorage.getItem('cart');
    if (stored) {
        cart = JSON.parse(stored);
    } else {
        cart = [];
    }
}
loadCartFromLocalStorage();

// Sauvegarder le panier dans le localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Ouvrir le panier
if (cartBtn && cartOverlay) {
    cartBtn.addEventListener('click', () => {
        cartOverlay.style.display = 'flex';
    });
}

// Fermer le panier
if (closeCartBtn && cartOverlay) {
    closeCartBtn.addEventListener('click', () => {
        cartOverlay.style.display = 'none';
    });
}

// Ajouter au panier
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
        const image = btn.getAttribute('data-image');

        // Vérifier si l'article est déjà dans le panier
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                image,
                quantity: 1
            });
        }
        updateCart();
        showAlert(`${name} a été ajouté au panier`);
    });
});

// Mettre à jour le panier
function updateCart() {
    cartContent.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price.toFixed(2)}€</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <div class="remove-item" data-id="${item.id}">Supprimer</div>
            </div>
        `;

        cartContent.appendChild(cartItem);
    });

    cartTotal.textContent = `${total.toFixed(2)}€`;
    cartCount.textContent = count;

    saveCartToLocalStorage();
    updateCartIcon();

    // Gérer les boutons + et -
    cartContent.querySelectorAll('.minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const item = cart.find(item => item.id === id);
            if (item.quantity > 1) {
                item.quantity -= 1;
                updateCart();
            }
        });
    });

    cartContent.querySelectorAll('.plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const item = cart.find(item => item.id === id);
            item.quantity += 1;
            updateCart();
        });
    });

    cartContent.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            cart = cart.filter(item => item.id !== id);
            updateCart();
        });
    });
}

// Afficher une alerte
function showAlert(message) {
    const alert = document.createElement('div');
    alert.classList.add('alert');
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.bottom = '20px';
    alert.style.right = '20px';
    alert.style.backgroundColor = '#4CAF50';
    alert.style.color = 'white';
    alert.style.padding = '15px';
    alert.style.borderRadius = '5px';
    alert.style.zIndex = '1000';
    alert.style.animation = 'slideIn 0.5s, fadeOut 0.5s 2.5s';

    document.body.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Style pour l'animation de l'alerte
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Met à jour le compteur du panier dans l'icône
function updateCartIcon() {
    let count = 0;
    cart.forEach(item => {
        count += item.quantity;
    });
    if (cartCount) cartCount.textContent = count;
}

// Initialisation
updateCart();