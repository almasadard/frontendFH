$(document).ready(function () {
    loadUsers();
});

//User laden
function loadUsers() {
    $.ajax({
        url: "http://localhost:8080/user",
        method: "GET",
        headers: { "Authorization": localStorage.getItem("accessToken") },
        success: function (users) {
            allUsers = users;
            createUserTable(users);
        },
        error: function (error) {
            console.error(error);
        }
    });
}

// Tabelle, um Benutzerdaten anzuzeigen
function createUserTable(users) {
    const container = $("#userListContainer");
    container.find("h2").text("Benutzerliste");

    const table = $("<table class='table table-striped mt-3'></table>");
    const thead = $("<thead class='align-middle'><tr></tr></thead>");
    const thead1 = $("<th>ID</th><th>E-Mail</th><th>Passwort</th><th>Status</th><th>Aktionen</th>");
    thead.append(thead1);

    const tbody = $("<tbody id='userTableBody'></tbody>");

    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        let row = $("<tr>");
        row.append($("<td>" + user.id + "</td>"));
        row.append($("<td>" + user.email + "</td>"));
        row.append($("<td>" + user.password + "</td>"));
        row.append($("<td class='align-middle text-center'>" + (user.active ? "&#10004;&#65039;" : "&#10060;") + "</td>"));


        let editButton = $("<button class='btn btn-primary editUserButton' data-id='" + user.id + "'>Bearbeiten</button>");
        editButton.click(function () {
            editUser(user.id);
        });

        let deleteButton = $("<button class='btn btn-danger deleteUserButton' data-id='" + user.id + "'>Löschen</button>");
        deleteButton.click(function () {
            deleteUser(user.id);
        });

        let buttonCell = $("<td></td>").append(editButton, deleteButton);
        row.append(buttonCell);

        tbody.append(row);
    }

    table.append(thead, tbody);
    container.empty().append("<h2 class='text-center mb-0'>Benutzerliste</h2>", table);
}
//User bearbeiten
function editUser(userId) {
    const user = allUsers.find(u => u.id === userId);

    const container = $("#userListContainer");
    container.find("h2").text("Benutzer bearbeiten");
    container.find("table").remove();

    let row1 = $("<div class='row mt-4'></div>");

    // E-Mail-Feld
    let emailCol = $("<div class='col-6'></div>");
    let emailLabel = $("<label for='editEmail' class='form-label'>E-Mail</label>");
    let emailInput = $("<input type='email' class='form-control' id='editEmail' value='" + user.email + "'>");
    emailCol.append(emailLabel, emailInput);

    // Aktivitäts-Dropdown
    let activeCol = $("<div class='col-6'></div>");
    let activeLabel = $("<label for='editUserActive' class='form-label p-0'>Status</label>");
    let activeDropdown = $("<select class='form-control' id='editUserActive'></select>");
    activeDropdown.append($("<option value='true'>&#10004;&#65039;</option>"));
    activeDropdown.append($("<option value='false'>&#10060;</option>"));
    activeCol.append(activeLabel, activeDropdown);

    row1.append(emailCol, activeCol);

    let row2 = $("<div class='row mt-4'></div>");

    // Aktuelles Passwort-Feld
    let currentPasswordCol = $("<div class='col-6'></div>");
    let currentPasswordLabel = $("<label for='editCurrentPassword' class='form-label'>Aktuelles Passwort</label>");
    let currentPasswordInput = $("<input type='password' class='form-control' id='editCurrentPassword' value='********'>"); // Zeigt '********' als Platzhalter an
    currentPasswordCol.append(currentPasswordLabel, currentPasswordInput);

    // Neues Passwort-Feld
    let newPasswordCol = $("<div class='col-6'></div>");
    let newPasswordLabel = $("<label for='editNewPassword' class='form-label'>Neues Passwort</label>");
    let newPasswordInput = $("<input type='password' class='form-control' id='editNewPassword'>");
    newPasswordCol.append(newPasswordLabel, newPasswordInput);

    row2.append(currentPasswordCol, newPasswordCol);

    let row3 = $("<div class='row mt-4 justify-content-center'></div>"); // Zentriert die Elemente horizontal
    let buttonCol = $("<div class='col-6 text-center'></div>"); // Zentriert den Button in der Mitte des Grids

    let saveButton = $("<button class='btn btn-success' id='saveUserButton'>Speichern</button>");
    buttonCol.append(saveButton);

    row3.append(buttonCol);

    let cancelCol = $("<div class='col-6 text-center'></div>");
    let cancelButton = $("<button class='btn btn-secondary'>Abbrechen</button>");
    cancelCol.append(cancelButton);

    container.append(row1, row2, row3);

    saveButton.click(function () {
        const newEmail = $("#editEmail").val();
        const newActive = $("#editUserActive").val();

        // Erfassen des neuen Passworts
        const newPassword = $("#editNewPassword").val();

        // Aktualisieren des Benutzerobjekts
        user.email = newEmail;
        user.active = newActive;

        // Überprüfen, ob ein neues Passwort eingegeben wurde
        if (newPassword) {
            user.password = newPassword;
        }

        // Aktualisieren der Benutzerdaten auf dem Server
        saveUser(userId, user);
    });
}

function saveUser(userId, updatedUser) {
    const token = localStorage.getItem("accessToken");

    $.ajax({
        url: "http://localhost:8080/user/update",
        method: "PUT",
        data: JSON.stringify(updatedUser),
        contentType: "application/json",
        headers: { "Authorization": token },
        success: function (response) {
            console.log("Updated user: ", response);
            loadUsers();
        },
        error: function (error) {
            console.error(error);
        }
    });
}


//User löschen
function deleteUser(userId) {
    if (confirm("Sind Sie sicher, dass Sie diesen User löschen möchten?")) {
        $.ajax({
            url: "http://localhost:8080/user/" + userId,
            method: "DELETE",
            headers: { "Authorization": localStorage.getItem("accessToken") },
            success: function (response) {
                console.log("User gelöscht");
                loadUsers();
            },
            error: function (error) {
                console.error(error);
            }
        });
    }
}
