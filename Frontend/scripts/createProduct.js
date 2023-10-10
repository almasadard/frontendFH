document.addEventListener('DOMContentLoaded', function () {
    const formCreateProduct = document.getElementById('formCreateProduct');
    const descriptionInput = document.getElementById('description');

    formCreateProduct.addEventListener('submit', function (event) {
        event.preventDefault();

        //Checkboxen überprüfen

        const productname = document.getElementById('inputProductName').value;
        const productPrice = document.getElementById('inputProductPrice').value;
        const productQuantity = document.getElementById('inputProductQuantity').value;
        const productDescription = document.getElementById('inputProductDescription').value;


                // Hier werden die restlichen Produktinformationen an den Server gesendet
                const product = {
                    productname: productname,
                    description: productDescription,
                    price: productPrice,
                    quantity: productQuantity,
                    active: false,
                };

                $.ajax({
                    url: 'http://localhost:8080/product',
                    type: 'POST',
                    contentType: 'application/json',
                    headers: { "Authorization": sessionStorage.getItem("token") },
                    data: JSON.stringify(product),
                    success: function (response) {
                        console.log('Daten erfolgreich gesendet:', response);
                        alert('Daten erfolgreich gesendet!');
                        loadProducts();
                    },
                    error: function (xhr, status, error) {
                        console.error('Fehler beim Senden der Daten:', error);
                    }
                });
        })});
