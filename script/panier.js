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
    const stored = localStorage.getItem('cart_items');
    if (stored) {
        cart = JSON.parse(stored);
    } else {
        cart = [];
    }
}
loadCartFromLocalStorage();

// Sauvegarder le panier dans le localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart_items', JSON.stringify(cart));
}

// Ouvrir le panier
cartBtn.addEventListener('click', () => {
    cartOverlay.style.display = 'flex';
});

// Fermer le panier
closeCartBtn.addEventListener('click', () => {
    cartOverlay.style.display = 'none';
});

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

        cartItem.innerHTML =
            `
                    <img src="../admin/${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${item.price.toFixed(2)}$</div>
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


    cartTotal.textContent = `${total.toFixed(2)}$`;
    cartCount.textContent = count;

    // Sauvegarder le panier à chaque modification
    saveCartToLocalStorage();
    updateCartIcon();

    // Gérer les boutons + et -
    const minusBtns = document.querySelectorAll('.minus');
    const plusBtns = document.querySelectorAll('.plus');
    const removeBtns = document.querySelectorAll('.remove-item');

    minusBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const item = cart.find(item => item.id === id);

            if (item.quantity > 1) {
                item.quantity -= 1;
                updateCart();
            }
        });
    });

    plusBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const item = cart.find(item => item.id === id);
            item.quantity += 1;
            updateCart();            function renderCart() {
                const cart = JSON.parse(localStorage.getItem('cart')) || {};
                const cartContent = document.querySelector('.cart-content');
                const cartTotal = document.querySelector('.cart-total-amount');
                cartContent.innerHTML = '';
                let total = 0;
            
                Object.keys(cart).forEach(id => {
                    const item = cart[id];
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    cartContent.innerHTML += `
                       <?php

// 
session_start();
// 
try {
    $db = new PDO("mysql:host=localhost;dbname=ecommerce_db;charset=utf8", 'root', '');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    die("Erreur de connexion à la base de données: " . $e->getMessage());
}

$ids = array_keys($_SESSION['cart'] ?? []);
$products = [];
$total = 0;

if (!empty($ids)) {
    $ids_list = implode(',', array_map('intval', $ids));
    $products = $db->query("SELECT * FROM products WHERE id IN ($ids_list)")->fetchAll(PDO::FETCH_ASSOC);
}

// Gestion des actions +, -, supprimer
if (isset($_GET['action'], $_GET['id'])) {
    $id = intval($_GET['id']);
    if ($id > 0 && isset($_SESSION['cart'][$id])) {
        switch ($_GET['action']) {
            case 'increment':
                $_SESSION['cart'][$id]++;
                break;
            case 'decrement':
                $_SESSION['cart'][$id]--;
                if ($_SESSION['cart'][$id] <= 0) {
                    unset($_SESSION['cart'][$id]);
                }
                break;
            case 'remove':
                unset($_SESSION['cart'][$id]);
                break;
        }
    }
    // Rafraîchir la page pour éviter la répétition de l'action au rechargement
    header('Location: cart.php');
    exit;
}
?>


<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/panier.css">
    <title>Panier</title>
</head>

<body class="cart">
    
    <header class="cart-header">
        <nav>
            <ul>
                <li><a href="../index.php">Accueil</a></li>
                <li><a href="../classes/product.php">Boutique</a></li>
                <li><a href="cart.php" class="active">Panier</a></li>
            </ul>
        </nav>
    </header>

    <section>
        <?php if (empty($products)): ?>
            <p>Votre panier est vide</p>
        <?php else: ?>

            <?php foreach ($products as $product):
                $quantity = $_SESSION['cart'][$product['id']];
                $subtotal = $product['price'] * $quantity;
                $total += $subtotal;
            ?>

                <div class="cart-img">
                    <img src="../admin/<?= htmlspecialchars($product['image']) ?>" alt="" width="60">
                </div>
                <div class="cart-item">
                    <h3 class="cart-title"><?= htmlspecialchars($product['name']) ?></h3>
                    <p><?= number_format($product['price'], 2) ?> $</p>
                    <div class="cart-qty">
                        <a href="cart.php?action=decrement&id=<?= $product['id'] ?>" class="qty-btn">−</a>
                        <span class="qty-value"><?= $quantity ?></span>
                        <a href="cart.php?action=increment&id=<?= $product['id'] ?>" class="qty-btn">+</a>
                    </div>
                    <a href="cart.php?action=remove&id=<?= $product['id'] ?>" class="btn-delete">Supprimer</a>
                </div>
            <?php endforeach; ?>

            <div class="total">
                <strong>Quantité totale :</strong> <?= array_sum($_SESSION['cart']) ?><br>
                <strong>Prix total :</strong> <?= number_format($total, 2) ?> €
            </div>
            <div class="cart-actions" style="margin-top:2rem; text-align:right;">
                <a href="order.php" class="btn-order" style="
                    display:inline-block;
                    background:#7d1a1a;
                    color:#fff;
                    padding:0.8rem 2rem;
                    border-radius:6px;
                    font-size:1.1rem;
                    text-decoration:none;
                    font-weight:500;
                    transition:background 0.2s;
                ">Passer la commande</a>
            </div>
        <?php endif; ?>
    </section>
</body>

</html>
                    `;
                });
            
                cartTotal.textContent = total.toFixed(2) + ' $';
            }
        });
    });

    removeBtns.forEach(btn => {
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
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) cartCount.textContent = count;
}

// Ajoute un produit au panier dans le localStorage
function addToCartLocal(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (cart[productId]) {
        cart[productId]++;
    } else {
        cart[productId] = 1;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
}

// Gestion du clic sur les boutons "Ajouter au panier"
document.querySelectorAll('.add-to-cart-js').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const productId = this.getAttribute('data-id');
        addToCartLocal(productId);

        // Envoi la requête au serveur pour garder la session à jour
        window.location.href = "../api/cart_add.php?id=" + encodeURIComponent(productId);
    });
});

// // Met à jour le compteur au chargement
 updateCart();