/*Login*/
const API_URL = 'http://localhost:3000'

const user = {
    "email": "stephy@mail.com",
    "password": "123456"
}

const payload = JSON.stringify(user);


const settings = {
    method: 'POST',
    headers: {
        'Content-type': 'application/json'
    },
    body: payload
}


window.addEventListener('load', function(){
    const form =  this.document.forms[0]
    form.addEventListener('submit', submitForm)
})

function submitForm(event) {

    event.preventDefault()

    const inputEmail = document.querySelector('#username')
    const inputPassword =  document.querySelector('#input-password')
    const dataUser = normalizeData(inputEmail.value, inputPassword.value)

    consultApi(`${API_URL}/login`, dataUser)
    
}


function normalizeData (email,password) {
    const user = {
        email: email.toLowerCase().trim(),
        password: password.trim()
    }

    return user;
}



function consultApi (apiUrl, payload) {

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
}

/*Eye functionality password*/
const togglePassword = document.querySelector(".toggle-password");
const password = document.querySelector("#input-password");

togglePassword.addEventListener("click", function () {
    // toggle the type attribute
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    
    // toggle the icon
    if (togglePassword.src.match("assets/icons-login/Eye-off.svg")) {
        togglePassword.src = "assets/icons-login/Eye.svg";
    } else {
        togglePassword.src = "assets/icons-login/Eye-off.svg";
    }
});

// prevent form submit
const form = document.querySelector("form");
form.addEventListener('submit', function (e) {
    e.preventDefault();
});