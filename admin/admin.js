document.getElementById('addProductForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productDescription = document.getElementById('productDescription').value;
    const productImage = document.getElementById('productImage').files[0];

    const products = JSON.parse(localStorage.getItem('products')) || [];
    const newProduct = {
        id: products.length + 1,
        name: productName,
        price: parseFloat(productPrice),
        description: productDescription,
        image: productImage ? URL.createObjectURL(productImage) : ''
    };

    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products)); // Mettre à jour localStorage

    renderProducts(); // Recharger la liste des produits
    alert(`Produit ajouté : ${productName}, Prix : ${productPrice}€`);
    this.reset();
});

// Charger les produits disponibles
const products = JSON.parse(localStorage.getItem('products')) || [];
const productList = document.getElementById('productList');

function renderProducts() {
    productList.innerHTML = ''; // Réinitialiser la liste des produits
    products.forEach((product, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${product.name} - ${product.price}€</span>
            <button onclick="editProduct(${index})">Modifier</button>
            <button onclick="deleteProduct(${index})">Supprimer</button>
        `;
        productList.appendChild(li);
    });
}

function editProduct(index) {
    const product = products[index];
    const newName = prompt('Modifier le nom du produit:', product.name);
    const newPrice = prompt('Modifier le prix du produit:', product.price);
    const newDescription = prompt('Modifier la description du produit:', product.description);
    if (newName && newPrice && newDescription) {
        products[index] = { ...product, name: newName, price: parseFloat(newPrice), description: newDescription };
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
        alert('Produit modifié avec succès.');
    }
}

function deleteProduct(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        products.splice(index, 1); // Supprimer le produit de la liste
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
        alert('Produit supprimé avec succès.');
    }
}

renderProducts(); // Afficher les produits au chargement

const orders = [
    { id: 1, customer: 'John Doe', total: 150 },
    { id: 2, customer: 'Jane Smith', total: 200 },
];
const orderList = document.getElementById('orderList');
orders.forEach(order => {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>Commande #${order.id} - Client : ${order.customer} - Total : ${order.total}€</span>
        <button onclick="confirmOrder(${order.id})">Confirmer</button>
    `;
    orderList.appendChild(li);
});

function confirmOrder(orderId) {
    fetch(`/api/orders/${orderId}/confirm`, { method: 'PUT' })
        .then(response => response.json())
        .then(data => {
            alert(`Commande #${orderId} confirmée !`);
            location.reload();
        })
        .catch(error => console.error('Erreur lors de la confirmation de la commande:', error));
}

function expireOrder(orderId) {
    fetch(`/api/orders/${orderId}/expire`, { method: 'PUT' })
        .then(response => response.json())
        .then(data => {
            alert(`Commande #${orderId} expirée.`);
            location.reload();
        })
        .catch(error => console.error('Erreur lors de l\'expiration de la commande:', error));
}


// Fonction pour générer les rapports de ventes
function generateSalesReport() {
    fetch('/api/sales-report')
        .then(response => response.json())
        .then(data => {
            console.log('Rapport des ventes:', data);
            // Afficher les statistiques dans l'interface administrateur
            const reportSection = document.getElementById('sales-report');
            reportSection.innerHTML = `
                <h3>Rapport des ventes</h3>
                <p>Total des ventes : ${data.totalSales}</p>
                <p>Produits vendus : ${data.totalProducts}</p>
                <p>Revenus : ${data.totalRevenue} €</p>
            `;
        })
        .catch(error => console.error('Erreur lors de la génération du rapport:', error));
}

// Appel de la fonction au chargement de la page admin
document.addEventListener('DOMContentLoaded', () => {
    generateSalesReport();
});
function logout() {
    alert('Déconnexion réussie.');
    window.location.href = 'login.html';
}
