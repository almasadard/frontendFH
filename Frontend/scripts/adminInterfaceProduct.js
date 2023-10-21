let allProducts = [];

$(document).ready(function () {
    loadProducts();
});

//Produkte laden
function loadProducts() {
    $.ajax({
        url: "http://localhost:8080/product",
        method: "GET",
        headers: { "Authorization": localStorage.getItem("accessToken")},
        success: function (products) {
            allProducts = products;
            createProductTable(products);
        },
        error: function (error) {
            console.error(error);
        }
    });
}
//Produktliste erstellen
function createProductTable(products) {
    const container = $("#productListContainer");
    container.find("h2").text("Produktliste");

    const table = $("<table class='table table-striped mt-3'></table>");
    const thead = $("<thead class='align-middle'><tr></tr></thead>");
    const thead1 = $("<th>ID</th><th>Name</th><th class='text-end pe-2'>Menge</th><th class='text-end pe-3'>Preis</th><th class='text-center'>Kategorie</th><th class='text-center'>Aktionen</th>");
    thead.append(thead1);

    const tbody = $("<tbody id='productTableBody'></tbody>");

    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let row = $("<tr class='text-'></tr>");
        row.append($("<td class='align-middle'>" + product.id + "</td>"));
        row.append($("<td class='align-middle ps-0'>" + product.productname + "</td>"));
        row.append($("<td class='align-middle text-end pe-3'>" + product.quantity + "</td>"));
        row.append($("<td class='align-middle text-end pe-3'>" + product.price.toFixed(2) + " €</td>"));
        row.append($("<td class='align-middle text-center'>" + product.category + "</td>"));

        let editButton = $("<button class='btn btn-primary' id='editButton1'> Bearbeiten</button>");
        editButton.click(createEditProductHandler(product));

        let deleteButton = $("<button class='btn btn-danger mx-1'> Löschen</button>");
        deleteButton.click(function () {
            deleteProduct(product.id);
        });

        let buttonCell = $("<td class='text-end'></td>").append(editButton, deleteButton);
        row.append(buttonCell);

        tbody.append(row);
    }

    table.append(thead, tbody);
    container.empty().append("<h2 class='text-center mb-0'>Produktliste</h2>", table);
}
//Produkte bearbeiten
function createEditProductHandler(product) {
    return function () {
        let productTableBody = $("#productTableBody");
        productTableBody.empty();

        const container = $("#productListContainer");
        container.find("h2").text(`Produkt ID: ${product.id}`);
        container.find("table").remove();

        const divPages = $("#pagesButton");
        divPages.hide();

        let row1 = $("<div class='row'></div>");

        let titleCol = $("<div class='col-9 mb-3 ps-0'></div>");
        let titleLabel = $("<label for='editProductName' class='form-label p-0'>Produktname</label>");
        let titleInput = $("<input type='text' class='form-control' id='editProductName' name='editProductName' value='" + product.productname + "'>");
        titleCol.append(titleLabel, titleInput);

        // Füge das Kategorie-Feld hinzu
        let categoryCol = $("<div class='col-3 mb-3 ps-0'></div>");
        let categoryLabel = $("<label for='editProductCategory' class='form-label p-0'>Kategorie</label>");
        let categoryInput = $("<input type='text' class='form-control' id='editProductCategory' name='editProductCategory' value='" + product.category + "'>");
        categoryCol.append(categoryLabel, categoryInput);

        row1.append(titleCol, categoryCol);

        let row2 = $("<div class='row mb-3'></div>");

        let col1 = $("<div class='col-6 col-sm-3 mb-2 p-0'></div>");
        let priceLabel = $("<label for='editProductPrice' class='form-label p-0'>Produktpreis</label>");
        let priceInput = $("<div class='input-group'><input type='text' class='form-control' id='editProductPrice' name='editProductPrice' aria-label='Euro amount' value='" + product.price.toFixed(2) + "'><span class='input-group-text'>€</span></div>");
        col1.append(priceLabel, priceInput);

        let col2 = $("<div class='col-6 col-sm-3'></div>");
        let quantityLabel = $("<label for='editProductQuantity' class='form-label p-0'>Produktmenge</label>");
        let quantityInput = $("<input type='number' class='form-control' id='editProductQuantity' name='editProductQuantity' value='" + product.quantity + "'>");
        col2.append(quantityLabel, quantityInput);

        let col3 = $("<div class='col-6 col-sm-6'></div>");  // Ändern Sie die Breite auf 6
        let imgLabel = $("<label for='editProductImg' class='form-label p-0'>Produktbild</label>");
        let imgInput = $("<input type='file' class='form-control' id='editProductImg' name='editProductImg' value='" + product.imageUrl + "'>");
        col3.append(imgLabel, imgInput);

        row2.append(col1, col2, col3);


        let row3 = $("<div class='row mb-3'></div>");

        let descriptionLabel = $("<label for='editProductDescription' class='form-label p-0'>Produktbeschreibung</label>");
        let descriptionInput = $("<textarea type='text' class='form-control' id='editProductDescription' name='editProductDescription' rows='3'>" + product.description + "</textarea>");
        row3.append(descriptionLabel, descriptionInput);


        let row4 = $("<div class='row mt-4'></div>");
        let saveCol = $("<div class='col text-end'></div>");
        let saveButton = $("<button class='btn btn-success mx-1'>&#x1F4BE; Speichern</button>");
        saveCol.append(saveButton);
        saveButton.click(function () {
            saveProduct(product);
        });

        let cancelCol = $("<div class='col text-start'></div>");
        let cancelButton = $("<button class='btn btn-secondary'>&#x2716;&#xFE0F; Abbrechen</button>");
        cancelCol.append(cancelButton);
        cancelButton.click(function () {
            loadProducts();
        });
        row4.append(saveCol, cancelCol);

        productTableBody.append(row1, row2, row3, row4);

        container.append(productTableBody);
    };
}

//Produkte löschen
function deleteProduct(productId) {

    $.ajax({
        url: "http://localhost:8080/product/" + productId,
        type: 'DELETE',
        headers: { "Authorization": localStorage.getItem("accessToken")},
        success: function (productResponse) {
            alert('Produkt erfolgreich gelöscht!');
            //deleteProductFile(productId); // Dateilöschung
        },
        error: function (xhr, status, error) {
            console.error('Fehler beim Löschen des Produkts:', error);
            alert('Fehler beim Löschen des Produkts.');
        }
    });
}
//File löschen
/*function deleteProductFile(reference) {
    $.ajax({
        url: "http://localhost:8080/files/" + reference,
        type: 'DELETE',
        headers: { "Authorization": localStorage.getItem("accessToken")},
        success: function (fileResponse) {
            console.log('File erfolgreich gelöscht:', fileResponse);
            loadProducts();
        },
        error: function (xhr, status, error) {
            console.error('Fehler beim Löschen der Datei:', error);
            alert('Fehler beim Löschen der Datei.');
        }
    });
}*/

// Produkte speichern

function saveProduct(product) {
    // Datei-Upload, falls eine Datei ausgewählt wurde
    const fileInput = document.getElementById("editProductImg");
    const file = fileInput.files[0];


    if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileId", product.id);

        $.ajax({
            url: 'http://localhost:8080/files/update',
            method: 'PUT',
            contentType: false,
            processData: false,
            headers: { "Authorization": localStorage.getItem("accessToken")},
            data: formData,
            success: function (response) {
                console.log('File erfolgreich geändert:', response);
                alert('File erfolgreich geändert!');
            }
        });
    }

    // Produkt-Upload

    // Aktualisierte Produktinformationen
    const updatedProduct = {
        id: product.id,
        productname: $("#editProductName").val().trim() || product.productname,
        price: parseFloat($("#editProductPrice").val()) || product.price,
        quantity: parseInt($("#editProductQuantity").val()) || product.quantity,
        imageUrl: product.imageUrl,
        description: $("#editProductDescription").val().trim() || product.description,
        category: $("#editProductCategory").val().trim() || product.category
    };

    // Produkt aktualisieren
    $.ajax({
        url: "http://localhost:8080/product/update",
        method: "PUT",
        headers: { "Authorization": localStorage.getItem("accessToken")},
        data: JSON.stringify(updatedProduct),
        contentType: "application/json",
        success: function (response) {
            console.log("Updated product: ", response);
            loadProducts();
        },
        error: function (error) {
            console.error(error);
        }
    });
}

$(document).on('click', '#saveEditProduct', function () {
    let productListContainer = document.getElementById("productListContainer");
    let productEditContainer = document.getElementById("productEditContainer");

    productListContainer.style.display = "block";
    productEditContainer.style.display = "none";
});
