$("#navbarContainer").load("./navbar/navbar.html");


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
