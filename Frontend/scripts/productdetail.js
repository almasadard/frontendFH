function createProductRow(product) {
    // HTML-Struktur mit Produktinformationen
    const row = $('<div class="row mx-auto" style="max-width: 800px;"></div>');
    const infoCol = $('<div class="col-md-6"></div>');
    const title = $(`<h1>${product.productname}</h1>`);
    const description = $(`<p>${product.description}</p>`);
    const price = $(`<h2>${product.price}€</h2>`);

    infoCol.append(title);
    infoCol.append(description);
    infoCol.append(price);
    row.append(infoCol);

    return row;
}

// Funktion zum Anzeigen der Produktdetails in Container
function displayProductDetails(product) {
    const productsContainer = $('#productDetailsContainer');
    productsContainer.empty(); // Leert den Container, um sicherzustellen, dass keine alten Produkte angezeigt werden

    // Produktinformationen für HTML Struktur
    const productRow = createProductRow(product);
    productsContainer.append(productRow);
}

// Funktion zum Auslesen der Produkt-ID aus der URL
function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    console.log("Produkt-ID:", productId); // Produkt-ID in der Konsole anzeigen
    return productId;
}

// Funktion zum Laden und Anzeigen der Produktdaten
function loadProductDetails(productId) {
    $.ajax({
        url: "http://localhost:8080/product/" + productId,
        type: "GET",
        success: function (product) {
            // Produktdaten anzeigen
            displayProductDetails(product);
        },
        error: function (error) {
            console.error("Fehler beim Laden der Produktdaten:", error);
        }
    });
}

// Funktion zum Laden der Produktdaten, wenn die Seite geladen ist
$(document).ready(function () {
    const productId = getProductIdFromURL();
    if (productId) {
        loadProductDetails(productId);
    } else {
        console.error("Produkt-ID nicht gefunden.");
    }
});
