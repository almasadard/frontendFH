$("#navbarContainer").load("./navbar/navbar.html", function() {

    // Überprüfen, ob der Benutzer ein Admin ist
    $.ajax({
        url: 'http://localhost:8080/isAdmin',
        method: 'GET',
        headers: {
            "Authorization": localStorage.getItem("accessToken")
        },
        data: {},
        contentType: 'application/json',
        dataType: 'json',
        success: (response) => {
            // Admin Menü anzeigen, falls Admin Token
            $(".dropdown").show();
        },
        error: error => {
            console.log(error);
            // Wenn der Benutzer kein Admin ist oder ein Fehler auftritt, Admin Menü nicht anzeigen
            $(".dropdown").hide();
        }
    });

    // Funktion, um den Anmeldestatus anzuzeigen
    function setLoginStatus() {
        if (localStorage.getItem("accessToken")) {
            // Ändert den Text von "Login" in "Eingeloggt"
            $("#login-link").text('Eingeloggt');

            //Shop und Warenkorb Seite nur bei Login anzeigen
            $("#product-link, #warenkorb-link").show();
        }
    }

// Ruft die Funktion zur Festlegung des Anmeldestatus auf der Seite zuerst auf
    setLoginStatus();

// Wenn der Benutzer eingeloggt ist
    if (localStorage.getItem("accessToken")) {
        // Versteckt "Login" und zeigt "Logout"
        $(".nav-link:contains('Login')").hide();
        $("#logout-link").show();
    }

    $("#logout-link").click(function() {
        // Entfernt den Zugriffstoken aus dem Local Storage
        localStorage.removeItem("accessToken");

        // Leitet den Benutzer zur Login-Seite weiter
        window.location.href = "http://localhost:63343/frontendFH/Frontend/login.html";
    });

})