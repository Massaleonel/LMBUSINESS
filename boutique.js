   const products = JSON.parse(localStorage.getItem('products')) || []; // Charger les produits depuis localStorage
            const productList = document.getElementById('product-list');

            productList.innerHTML = ''; // Effacer le contenu existant

            if (products.length === 0) {
                productList.innerHTML = '<p>Aucun produit disponible pour le moment.</p>'; // Message si aucun produit
            } else {
                products.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.className = 'product';
                    productDiv.innerHTML = `
                        <img src="${product.image}" alt="${product.name}" />
                        <h3>${product.name}</h3>
                        <p>Prix: ${product.price}€</p>
                        <p>${product.description}</p>
                        <button onclick="addToCart(${product.id})">Ajouter au panier</button>
                    `;
                    productList.appendChild(productDiv);
                });
            }

            function addToCart(productId) {
                const product = products.find(p => p.id === productId);
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingProduct = cart.find(item => item.id === productId);

                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    cart.push({ ...product, quantity: 1 });
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                alert(`${product.name} a été ajouté au panier.`);
            }