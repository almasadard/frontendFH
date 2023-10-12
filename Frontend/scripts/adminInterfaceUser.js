let currentPage = 1;
let allUsers = [];

$(document).ready(function () {
    loadUsers();
});

function loadUsers() {
    $.ajax({
        url: "http://localhost:8080/user",
        method: "GET",
        headers: { "Authorization": sessionStorage.getItem("token") },
        success: function (users) {
            allUsers = users;
            createUserTable(users, currentPage);
        },
        error: function (error) {
            console.error(error);
        }
    });
}

function createUserTable(users, currentPage) {
    // Tabelle, um Benutzerdaten anzuzeigen
    const container = $("#userListContainer");
    container.find("h2").text("Benutzer Liste");

    const table = $("<table class='table table-striped mt-3'></table>");
    const thead = $("<thead class='align-middle'><tr></tr></thead>");
    const thead1 = $("<th>ID</th><th>Benutzername</th><th>E-Mail</th><th>Rolle</th><th>Aktionen</th>");
    thead.append(thead1);

    const tbody = $("<tbody id='userTableBody'></tbody>");

    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        let row = $("<tr>");
        row.append($("<td>" + user.id + "</td>"));
        row.append($("<td>" + user.username + "</td>"));
        row.append($("<td>" + user.email + "</td>"));
        row.append($("<td>" + user.role + "</td>"));

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

function editUser(userId) {
    const user = allUsers.find(u => u.id === userId);

    const container = $("#userListContainer");
    container.find("h2").text("Benutzer bearbeiten");
    container.find("table").remove();

    let row1 = $("<div class='row mb-3'></div>");
    let usernameCol = $("<div class='col-6'></div>");
    let usernameLabel = $("<label for='editUsername' class='form-label'>Benutzername</label>");
    let usernameInput = $("<input type='text' class='form-control' id='editUsername' value='" + user.username + "'>");
    usernameCol.append(usernameLabel, usernameInput);

    let emailCol = $("<div class='col-6'></div>");
    let emailLabel = $("<label for='editEmail' class='form-label'>E-Mail</label>");
    let emailInput = $("<input type='email' class='form-control' id='editEmail' value='" + user.email + "'>");
    emailCol.append(emailLabel, emailInput);

    row1.append(usernameCol, emailCol);


    let row2 = $("<div class='row mt-4'></div>");
    let saveCol = $("<div class='col text-end'></div>");
    let saveButton = $("<button class='btn btn-success' id='saveUserButton'>Speichern</button>");
    saveCol.append(saveButton);
    saveButton.click(function () {
        saveUser(userId);
    });

    let cancelCol = $("<div class='col text-start'></div>");
    let cancelButton = $("<button class='btn btn-secondary'>Abbrechen</button>");
    cancelButton.click(function () {
        loadUsers();
    });
    row2.append(saveCol, cancelCol);

    container.append(row1, row2);
}

function saveUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    const newUsername = $("#editUsername").val();
    const newEmail = $("#editEmail").val();


    // aktualisierten Benutzerdaten an den Server
    const updatedUser = {
        id: userId,
        username: newUsername,
        email: newEmail,

    };

    $.ajax({
        url: "http://localhost:8080/user/" + userId,
        method: "PUT",
        data: updatedUser,
        headers: { "Authorization": sessionStorage.getItem("token") },
        success: function (response) {
            console.log("Benutzer aktualisiert:", response);
            loadUsers();
        },
        error: function (error) {
            console.error(error);
        }
    });
}

function deleteUser(userId) {
    if (confirm("Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?")) {
        $.ajax({
            url: "http://localhost:8080/user/" + userId,
            method: "DELETE",
            headers: { "Authorization": sessionStorage.getItem("token") },
            success: function (response) {
                console.log("Benutzer gelöscht:", response);
                loadUsers();
            },
            error: function (error) {
                console.error(error);
            }
        });
    }
}
