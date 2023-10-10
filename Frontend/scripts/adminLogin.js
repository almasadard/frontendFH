/*
Nur ein Admin kann adminInterface.html aufrufen
 */


$.ajax({
    url: 'http://localhost:8080/isAdmin',
    method: 'GET',
    headers:
        {
            "Authorization": localStorage.getItem("accessToken")
        },
    data: {},
    contentType: 'application/json',
    dataType: 'json',
    success: (response) => {},
    error: error => {
        console.log(error);
        location.replace("./index.html")
    }
})