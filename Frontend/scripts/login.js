function handleLogin(event) {
    event.preventDefault();

    // Get form elements
    const loginForm = document.getElementById("registrationForm");
    const form = event.target;
    const formData = new FormData(form);

    // Validate form data
    const email = formData.get("email");
    const password = formData.get("password");
    const user = {
        email: email,
        password: password,
    };

    $.ajax({
// Login request
        url: "http://localhost:8080/auth/user",
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(user),
        success: function (data) {
            let timestamp = new Date().toISOString();
            sessionStorage.setItem("token", data);
            sessionStorage.setItem("loginTimestamp", timestamp);
            location.href = "index.html";
            console.log("Eingeloggt");
        },
        error: console.error
    });
}
/*TokenTimeStampCheck*/

function checkTokenValidity() {
    var loginTimestamp = sessionStorage.getItem("loginTimestamp");
    if (loginTimestamp) {
        var currentTime = new Date().getTime();
        var loginTime = new Date(loginTimestamp).getTime();
        var validityDuration = 3600 * 1000; // Gültigkeitsdauer des Tokens (1 Stunde)

        if (currentTime - loginTime >= validityDuration) {
            // Token ist abgelaufen
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("loginTimestamp");
            console.log("Token ist abgelaufen");

            // Benutzer abmelden und zur Indexseite zurückleiten
            location.href = "index.html";

            // Benachrichtigung anzeigen
            alert("Ihre Sitzung ist abgelaufen. Sie wurden abgemeldet.");

        }
    }
}

function checkAdminStatus() {
    // Token aus der Session holen
    const token = sessionStorage.getItem('token');

    // Überprüfen, ob ein Token vorhanden ist
    if (token) {
        // Token aufteilen und den Payload extrahieren
        const tokenParts = token.split('.');
        const payloadBase64 = tokenParts[1];
        const payload = JSON.parse(atob(payloadBase64));

        // Überprüfen, ob der Benutzer ein Administrator ist
        const isAdmin = payload.admin;

        return isAdmin;
    } else {
        return false; // Kein Token gefunden, Benutzer ist kein Administrator
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form[action='/userLogin']");

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);

        // Event listener to hide the help text when the user starts typing in the input fields
        loginForm.addEventListener("input", function (event) {
            const inputField = event.target;
            const helpTextId = inputField.getAttribute("id") + "HelpText";
            const helpText = document.getElementById(helpTextId);

            if (helpText) {
                if (inputField.value.trim() === "") {
                    helpText.classList.remove("hidden"); // Entfernen der hidden-Klasse
                } else {
                    helpText.classList.add("hidden"); // Hinzufügen der hidden-Klasse
                }
            }
        });
    }
});