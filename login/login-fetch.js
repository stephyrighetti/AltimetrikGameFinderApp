
// Fetch for login
function fetchApi(apiUrl, payload) {

    const settings = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload),
    }

    fetch(apiUrl, settings)
        .then(response => response.json())
        .then(data => {
            if (data.accessToken) {
                console.log(data.accessToken);
                localStorage.setItem('jwt', data.accessToken)
                localStorage.setItem('id', data.user.id)
                location.href = '/home.html'
            }
        })
        .catch (() => {
            renderModalError()
        })
}
