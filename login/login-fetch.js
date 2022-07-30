
export function fetchLogin(apiUrl, payload) {

    const settings = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload),
    }

    return fetch(apiUrl, settings)
}
