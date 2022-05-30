/*Create User*/
const apiUrl = 'http://localhost:3000'

const newUser = {
    "email": "stephy@mail.com",
    "password": "123456"
}

const payload = JSON.stringify(newUser);


const settings = {
    method: 'POST',
    headers: {
        'Content-type': 'application/json'
    },
    body: payload
}


fetch(`${apiUrl}/users`, settings)
    .then((response) => response.json())
    .then((json) => {
        console.log("REGISTRO CREADO:");
        console.log(json)
    });