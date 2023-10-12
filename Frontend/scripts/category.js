

// Funktion zum Erstellen eines Kategorien-Elements
function createCategoryElement(category) {
    const categoryDiv = $('<div>', { class: 'sortiment-box col-lg-4' });
    const categoryTitle = $('<h3>', { text: category.name });
    const categoryDescription = $('<p>', { text: `Eine Auswahl von ${category.name}` });
    // Hier kannst du auch ein Bild für die Kategorie hinzufügen

    categoryDiv.append(categoryTitle, categoryDescription);

    return categoryDiv;
}

// Funktion zum Laden und Anzeigen der Kategorien
function loadCategories() {
    $.ajax({
        url: 'http://localhost:8080/categories', // Annahme: Diese URL gibt die Kategorien zurück
        method: 'GET',
        success: function (categories) {
            const sortimentSection = $('#sortiment');
            categories.forEach(category => {
                const categoryElement = createCategoryElement(category);
                sortimentSection.append(categoryElement);
            });

            // Event-Handler für die Kategorieauswahl
            $('.sortiment-box').on('click', function () {
                const selectedCategoryName = $(this).find('h3').text();
                console.log('Kategorie ausgewählt:', selectedCategoryName);
                // Implementiere die Logik, um die Produkte der ausgewählten Kategorie anzuzeigen
                // Du musst die Produkte filtern und anzeigen, die zur ausgewählten Kategorie gehören
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
}

// Lade und zeige die Kategorien
loadCategories();