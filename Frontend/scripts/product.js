$(document).ready(function () {

    class Product {
        constructor(id, productname, description, price, quantity, categoryName) {
            this.id = id;
            this.productname = productname;
            this.categoryName = categoryName;
            this.price = price;
            this.quantity = quantity;
            this.description = description
        }
    }

    function createCardElement(product) {
        const card = $('<div>', { class: 'col-lg-3 col-md-4 col-sm-6' });

        const link = $('<a>', { class: 'categorylink', href: `${product.productname}.html` });
        const title = $('<h3>', { text: product.productname });
        link.append(title);

        const description = $('<p>', { text: `- ${product.description}` });

        const counter = $('<div>', { class: 'counter mb-2 mt-2' });
        const minusButton = $('<button>', { class: 'btn btn-sm btn-outline-dark minus', text: '-' });
        const count = $('<span>', { class: 'count', text: '0' });
        const plusButton = $('<button>', { class: 'btn btn-sm btn-outline-dark plus', text: '+' });
        counter.append(minusButton, count, plusButton);

        const btnDiv = $('<div>', { class: 'pt-1 mb-4' });
        const addToCartButton = $('<button>', { class: 'btn btn-dark btn-lg btn-block', type: 'submit', text: 'Zum Warenkorb hinzufügen' });
        btnDiv.append(addToCartButton);

        card.append(link, description, counter, btnDiv);

        return card;
    }

    function addProductToList(product) {
        const cardElement = createCardElement(product);
        const productCategory = product.categoryName;
        const categoryList = document.getElementById(`section-${product.categoryName}`);

        if (productCategory) {
            $(categoryList).append(cardElement);
        } else {
            console.error("Produkt konnte nicht gefunden werden")
        }
    }

    //function to load product list from db
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
})