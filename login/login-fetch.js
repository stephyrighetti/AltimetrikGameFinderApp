
 
function fetchApi (apiUrl, payload) {

    const settings = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)

    }

    fetch (apiUrl, settings)
    .then (respuesta => respuesta.json())
    .then (data => {
        console.log(data);
        console.log(data.accessToken);
        if (data.accessToken) {
            localStorage.setItem('jwt', data.accessToken);
            location.href = 'http://localhost:5500/home.html';
        }

    })
    .catch (error => {
        console.log(error);
    })
}
