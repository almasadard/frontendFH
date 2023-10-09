$(document).ready(function () {
    class UserLogin {
        constructor(email, password) {
            this.email = email;
            this.password = password;
        }
    }

    function setLoginData() {
        let userData = {
            "email": $('#emailInput').val(),
            "password": $('#passwordInput').val()
        };

        return new UserLogin(userData.email, userData.password);
    }

    $('#loginForm').submit(function (e) {
        e.preventDefault(); // Verhindert Standardverhalten des Formularabsendens
        let user = setLoginData();


        $.ajax({
            url: 'http://localhost:8080/login',
            method: 'POST',
            headers:
                {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            data: JSON.stringify(user),
            contentType: 'application/json',
            dataType: 'json',
            success: (response) => {
                console.log(response);
                //localStorage.setItem('accesToken', response.token);

                // Token dekodieren und prüfen, ob der User Admin ist
                var decodedToken = jwt_decode(response.token);
                console.log("Is Admin: ", decodedToken.admin);
                console.log("Is Admin: ", response.isAdmin);

                if (response.isAdmin) {
                    location.href = "adminInterfaceProduct.html";
                } else {
                    location.href = "index.html";
                }
            },
            error: (err) => {
                console.error("Login fehlgeschlagen!", err);
                console.error("Serverantwort: ", err.responseText);
            }
        });
    })
});