document.addEventListener('DOMContentLoaded', function () {
    const formCreateProduct = document.getElementById('formCreateProduct');

    formCreateProduct.addEventListener('submit', function (event) {
        event.preventDefault();

        const productName = document.getElementById('inputProductName').value;
        const productPrice = document.getElementById('inputProductPrice').value;
        const productQuantity = document.getElementById('inputProductQuantity').value;
        const productDescription = document.getElementById('inputProductDescription').value;
        const fileInput = document.getElementById("inputProductImg");
        const selectedFile = fileInput.files[0];

        const formData = new FormData();
        formData.append("file", selectedFile);

        console.log(formData);

        $.ajax({
            url: 'http://localhost:8080/files',
            type: 'POST',
            contentType: false,
            processData: false,
            headers: { "Authorization": localStorage.getItem("accessToken")},
            data: formData,
            success: function (response) {
                console.log('File erfolgreich gesendet!', response);
                loadProducts();
                const product = {
                    productname: productName,
                    price: productPrice,
                    quantity: productQuantity,
                    description: productDescription,
                    imageUrl: response,
                    categoryId: 1,
                };

                console.log(product);
                $.ajax({
                    url: 'http://localhost:8080/product',
                    type: 'POST',
                    contentType: 'application/json',
                    headers: { "Authorization": localStorage.getItem("accessToken")},
                    data: JSON.stringify(product),
                    success: function (response) {
                        console.log('Daten erfolgreich gesendet:', response);
                        alert('Product erfolgreich erstellt!')
                    },
                    error: function (xhr, status, error) {
                        console.log('Fehler beim erstellen des Produkts!')
                    }
                })

            },
            error: function (xhr, status, error) {
                console.error('Fehler beim senden des Bildes!', error);
            }

        })

        // Überprüfen, ob der Benutzer eine Admin-Rolle hat
        /*if (userHasAdminRole()) {
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("productname", productName);
                formData.append("description", productDescription);
                formData.append("quantity", productQuantity);
                formData.append("price", productPrice);

                $.ajax({
                    url: 'http://localhost:8080/product',
                    method: 'POST',
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("accessToken")
                    },
                    data: formData,
                    contentType: 'application/json',
                    processData: false,
                    success: function (response) {
                        console.log('Data sent successfully:', response);
                        alert('Data sent successfully!');
                    },
                    error: function (xhr, status, error) {
                        console.error('Error sending data:', error);
                    }
                });
            }
        } else {
            alert("Nur Administratoren dürfen Produkte erstellen.");
        }
         */

    });
});

function userHasAdminRole() {
    // Überprüfung, ob Benutzer die ADMIN-Rolle hat
    const token = localStorage.getItem("accessToken");
    const payload = parseJwt(token);

    return payload && payload.roles && payload.roles.includes("ADMIN");
}

function parseJwt(token) {
    if (!token) {
        return null; // Wenn das Token nicht vorhanden ist, gebe null zurück.
    }

    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        return JSON.parse(atob(base64));
    } catch (error) {
        console.error('Error parsing JWT token:', error);
        return null; // Wenn ein Fehler beim Parsen auftritt, gebe ebenfalls null zurück.
    }
}
