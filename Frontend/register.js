// Function to validate password
function validatePassword(password) {
    if (!password) {
        return "Bitte gib dein Passwort ein";
    } else if (password.length < 6) {
        return "Das Passwort muss mindestens 6 Zeichen enthalten";
    } else if (!/\d/.test(password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
        return "Das Passwort muss mindestens eine Zahl und ein Sonderzeichen enthalten";
    }
    return null; // Passwort ist gültig
}

// Function to validate benutzername
function validateBenutzername(benutzername) {
    if (!benutzername) {
        return "Bitte gib deinen Benutzernamen ein";
    } else if (benutzername.length < 3) {
        return "Der Benutzername muss mindestens 3 Zeichen enthalten";
    }
    return null; // Benutzername ist gültig
}

// Function to validate email
function validateEmail(email) {
    if (!email) {
        return "Bitte gib deine Email-Adresse ein";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        return "Bitte gib eine gültige Email-Adresse ein";
    }
    return null; // E-Mail ist gültig
}

// Function to handle form submission
function handleRegistration(event) {
    event.preventDefault();

    // Get form elements
    const registrationForm = document.getElementById("registrationForm");
    const form = event.target;
    const formData = new FormData(form);

    // Validate form data
    const email = formData.get("email");
    const password = formData.get("password");
    const benutzername =formData.get("benutzername");
    const firstname = formData.get("vorname");
    const lastname = formData.get("nachname");
    const streetname = formData.get("strasse");
    const postcode = formData.get("plz");
    const city = formData.get("ort");

    // Validierung der Felder: Überprüfen, ob die Eingaben leer sind
    let formIsValid = true;

    // Password Validierung
    const passwordErrorMessage = validatePassword(password);
    if (passwordErrorMessage) {
        setFieldError("passwordInput", "passwordHelpText", passwordErrorMessage);
        formIsValid = false;
    } else {
        hideFieldError("passwordInput", "passwordHelpText");
    }

    // Benutzername Validierung
    const benutzernameErrorMessage = validateBenutzername(benutzername);
    if (benutzernameErrorMessage) {
        setFieldError("benutzernameInput", "benutzernameHelpText", benutzernameErrorMessage);
        formIsValid = false;
    } else {
        hideFieldError("benutzernameInput", "benutzernameHelpText");
    }

    // E-Mail Validierung
    const emailErrorMessage = validateEmail(email);
    if (emailErrorMessage) {
        setFieldError("emailInput", "emailHelpText", emailErrorMessage);
        formIsValid = false;
    } else {
        hideFieldError("emailInput", "emailHelpText");
    }

    // Validierung für Vorname
    if (!firstname) {
        setFieldError("vornameInput", "vornameHelpText", "Bitte gib deinen Vornamen ein");
        formIsValid = false;
    } else {
        hideFieldError("vornameInput", "vornameHelpText");
    }

    // Validierung für Nachname
    if (!lastname) {
        setFieldError("nachnameInput", "nachnameHelpText", "Bitte gib deinen Nachnamen ein");
        formIsValid = false;
    } else {
        hideFieldError("nachnameInput", "nachnameHelpText");
    }

    // Validierung für Straße
    if (!streetname) {
        setFieldError("strasseInput", "strasseHelpText", "Bitte gib deine Straße und Hausnummer ein");
        formIsValid = false;
    } else {
        hideFieldError("strasseInput", "strasseHelpText");
    }

    // Validierung für Postleitzahl
    if (!postcode) {
        setFieldError("plzInput", "plzHelpText", "Bitte gib deine Postleitzahl ein");
        formIsValid = false;
    } else {
        hideFieldError("plzInput", "plzHelpText");
    }

    // Validierung für Ort
    if (!city) {
        setFieldError("ortInput", "ortHelpText", "Bitte gib deinen Ort ein");
        formIsValid = false;
    } else {
        hideFieldError("ortInput", "ortHelpText");
    }

    if (!formIsValid) {
        return; // Formular wird nicht abgesendet
    }

    // Create user object from form data
    const user = {
        email: email,
        password: password,
        benutzername: benutzername,
        firstname: firstname,
        lastname: lastname,
        streetname: streetname,
        postcode: postcode,
        city: city
    };

    // Send user creation request
    $.ajax({
        url: 'http://localhost:8080/user',
        type: 'POST',
        contentType: 'application/json',
        headers: { "Authorization": sessionStorage.getItem("token") },
        data: JSON.stringify(user),
        success: function(response) {
            console.log('Daten erfolgreich gesendet:', response);
            alert("Sie haben sich erfolgreich registriert!");
        },
        error: function(xhr, status, error) {
            console.error('Fehler beim Senden der Daten:', error);
            // Handle error appropriately
        }
    });

    // Clear form after successful registration
    form.reset();
}

// Function to set field error and display help text
function setFieldError(inputId, helpTextId, helpTextMessage) {
    const inputField = document.getElementById(inputId);
    const helpText = document.getElementById(helpTextId);

    inputField.classList.add("is-invalid");
    helpText.style.display = "block";
    helpText.textContent = helpTextMessage;
}

// Function to hide field error and help text
function hideFieldError(inputId, helpTextId) {
    const inputField = document.getElementById(inputId);
    const helpText = document.getElementById(helpTextId);

    inputField.classList.remove("is-invalid");
    helpText.style.display = "none";
}

// Attach the form submission event listener
document.addEventListener("DOMContentLoaded", function () {
    const registrationForm = document.querySelector("form[action='/user']");

    if (registrationForm) {
        registrationForm.addEventListener("submit", handleRegistration);

        // Event listener to hide the help text when the user starts typing in the input fields
        registrationForm.addEventListener("input", function (event) {
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
