function chargerBoutique() {
    const articles = [
        { id:1, nom:"4 poches complet", prix:50, img:"../images/4 poches.jpg" },
        { id:2, nom:"chemise homme", prix:30, img:"../images/4 poches 5.jpg" },
    ];

    const gallerie = document.querySelector('.gallerie');
    if (gallerie) {
        gallerie.innerHTML = articles.map(article =>
            `
            <div class="produit">
                <img src="${article.img}" alt="${article.nom}">
                <p>${article.nom} ${article.prix}€</p>
                <button class="add-to-cart"
                    data-id="${article.id}"
                    data-name="${article.nom}"
                    data-price="${article.prix}"
                    data-image="${article.img}">
                    Ajouter au panier
                </button>
            </div>
            `
        ).join('');
    }
}
window.onload = chargerBoutique;