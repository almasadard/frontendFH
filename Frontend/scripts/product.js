$(document).ready(function () {
    // Warenkorb-Array, um Produkte zu speichern
    const cart = [];

    class Product {
        constructor(id, productname, description, price, quantity, categoryName, image) {
            this.id = id;
            this.productname = productname;
            this.categoryName = categoryName;
            this.price = price;
            this.quantity = quantity;
            this.description = description;
            //this image = image;
        }
    }

    // Funktion zum Erstellen eines Kategorien-Elements
    function createCategoryElement(category) {
        const categoryDiv = $('<div>', { class: 'sortiment-box col-lg-4' });
        const categoryTitle = $('<h3>', { text: category.name });
        const categoryDescription = $('<p>', { text: `Eine Auswahl von ${category.name}` });
        // Hier kannst du auch ein Bild für die Kategorie hinzufügen

        categoryDiv.append(categoryTitle, categoryDescription);

        return categoryDiv;
    }

    // Funktion zum Laden und Anzeigen der Kategorien
    function loadCategories() {
        $.ajax({
            url: 'http://localhost:8080/categories', // Annahme: Diese URL gibt die Kategorien zurück
            method: 'GET',
            success: function (categories) {
                const sortimentSection = $('#sortiment');
                categories.forEach(category => {
                    const categoryElement = createCategoryElement(category);
                    sortimentSection.append(categoryElement);
                });

                // Event-Handler für die Kategorieauswahl
                $('.sortiment-box').on('click', function () {
                    const selectedCategoryName = $(this).find('h3').text();
                    console.log('Kategorie ausgewählt:', selectedCategoryName);
                    // Implementiere die Logik, um die Produkte der ausgewählten Kategorie anzuzeigen
                    // Du musst die Produkte filtern und anzeigen, die zur ausgewählten Kategorie gehören
                });
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    // Funktion zum Erstellen eines Produkt-Elements
    function createCardElement(product) {
        const card = $('<div>', { class: 'col-lg-3 product-card' });
        //const img = $('<img>', { src: `${product.image}`, class: 'card-img-top', alt: `${product.productname}` });
        const link = $('<a>', { class: 'categorylink', href: `productdetail.html?id=${product.id}` });
        const title = $('<h3>', { text: product.productname });

        link.append(title);
        const price = $('<p>', { text: `Preis: ${product.price} €` });
        const description = $('<p>', { text: `- ${product.description}` });
        const counter = $('<div>', { class: 'counter mb-2 mt-2' });
        const minusButton = $('<button>', { class: 'btn btn-sm btn-outline-dark minus', text: '-' });
        const count = $('<span>', { class: 'count', text: '0' });
        const plusButton = $('<button>', { class: 'btn btn-sm btn-outline-dark plus', text: '+' });
        counter.append(minusButton, count, plusButton);

        // Event-Handler für den Plus-Button
        plusButton.on('click', function () {
            const currentValue = parseInt(count.text());
            count.text(currentValue + 1);
        });

        // Event-Handler für den Minus-Button
        minusButton.on('click', function () {
            const currentValue = parseInt(count.text());
            if (currentValue > 0) {
                count.text(currentValue - 1);
            }
        });

        const btnDiv = $('<div>', { class: 'pt-1 mb-4' });
        const addToCartButton = $('<button>', { class: 'btn btn-dark btn-lg btn-block', type: 'submit', text: 'Zum Warenkorb hinzufügen' });
        btnDiv.append(addToCartButton);

        // Event-Handler für den "Zum Warenkorb hinzufügen"-Button
        addToCartButton.on('click', function () {
            const productCount = parseInt(count.text());
            if (productCount > 0) {
                const productName = product.productname;

                // Produkt zum Warenkorb hinzufügen
                cart.push({ name: productName, quantity: productCount });

                alert(`${productCount}x ${productName} wurde dem Warenkorb hinzugefügt.`);
                // Zurücksetzen des Zählers
                count.text('0');
            }
        });

        card.append(link, price, description, counter, btnDiv);

        return card;
    }

    function addProductToList(product) {
        const cardElement = createCardElement(product);
        const productCategory = product.categoryName;
        const categoryList = document.getElementById(`section-${product.categoryName}`);

        if (productCategory) {
            $(categoryList).append(cardElement);
        } else {
            console.error("Produkt konnte nicht gefunden werden");
        }
    }

    // Funktion zum Laden der Produktliste aus der Datenbank
    $.ajax({
        url: 'http://localhost:8080/product',
        method: 'GET',
        success: function (products) {
            products.forEach(product => {
                addProductToList(product);
            });
        },
        error: function (error) {
            console.log(error);
        }
    });

    // Lade und zeige die Kategorien
    loadCategories();
});
