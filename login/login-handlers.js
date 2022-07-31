import {fetchLogin} from './login-fetch.js';

const API_URL = 'http://localhost:3000'
let currentSlide = 1


const token = localStorage.getItem("jwt");
    if (token) {
        location.href = ('/home.html')
    }


window.addEventListener('load', function(){
    const form = this.document.forms[0]
    form.addEventListener('submit', submitForm)
})


function submitForm(event) {

    event.preventDefault()

    const inputEmail = document.querySelector('#username')
    const inputPassword =  document.querySelector('#input-password')
    const dataUser = normalizeData(inputEmail.value, inputPassword.value)

    if (!isEmailValid(inputEmail.value) || !isPasswordValid(inputPassword.value)) {
        showError("Some of the data entered is not valid")
    }

    if(inputEmail.value === "" || inputPassword.value ==="") {
        showError("Credentials cannot be empty")
    }


    fetchLogin(`${API_URL}/login`, dataUser)
      .then(response => {

        if (response.status !== 200) {
            throw Error(response.statusText)
        }

        return response.json()
      })
      .then(data => {
          localStorage.setItem('jwt', data.accessToken)
          localStorage.setItem('id', data.user.id)
          location.href = '/home.html'
      })
      .catch(() => {
          showError("Some of the data entered is not valid")
      })
}

// Password visibility
const togglePassword = document.querySelector(".toggle-password")
togglePassword.addEventListener("click", function () {

    const password = document.querySelector("#input-password")
    const type = password.getAttribute("type") === "password" ? "text" : "password"

    password.setAttribute("type", type)

    if (togglePassword.src.match("assets/icons-login/eye-off.svg")) {
        togglePassword.src = "assets/icons-login/eye.svg"
    } else {
        togglePassword.src = "assets/icons-login/eye-off.svg"
    }
})


function showError(error) {
    document.querySelector('#error-container').classList.remove('hidden')
    document.querySelector('#error-container').innerHTML = `<small>${error}</small>`
}


dotColor(1)
const buttonSlideRight = document.querySelector('.slide2')
buttonSlideRight.addEventListener('click', function() {
 currentSlide++
 if (currentSlide === 7) currentSlide = 1
    slide(currentSlide)
    dotColor(currentSlide)
})

const buttonSlideLeft = document.querySelector('.slide1')
buttonSlideLeft.addEventListener('click', function() {
    currentSlide--
    if (currentSlide === 0) currentSlide = 6
    slide(currentSlide)
    dotColor(currentSlide)
})


function clickSlide(num) {
    document.querySelector('.carrousel-dot-' + num).addEventListener('click', function () {
        slide(num)
        dotColor(num)
    })
}

for (let i = 1; i <= 6; i++) {
  clickSlide(i)
}

function slide(num) {
    const mode = getCurrentMode()
    if (mode === "light") {
        document.querySelector('body').style = `background-image: url(../assets/background-images/background-${num}.jpg)`
    } else {
        document.querySelector('body').style = `background-image: url(../assets/background-images/background-${num}-dark.jpg)`
    }
}


function dotColor(num) {
    document.querySelectorAll('.carrousel > div').forEach(element => element.style = "opacity:25%;")
    document.querySelector('.carrousel-dot-' + num).style = "opacity: 100%;"
}


function isEmailValid(string) {
    return /\S+@\S+\.\S+/.test(string)
}


function isPasswordValid(string) {
    return string.length >=6 && string.length <=14
}


function normalizeData(email, password) {

    const user = {
        email: email.toLowerCase().trim(),
        password: password.trim(),
    }

    return user
}


const darkOff = document.querySelector('.icon-mode')
const body = document.querySelector('body')
const slider1 = document.querySelector('.slider1')
const slider2 = document.querySelector('.slider2')

function swapMode() {

    const mode = getCurrentMode()

    if (mode === 'light') {
        darkOff.src = "assets/icons-mode/dark-mode-on.svg"
        slider1.src = "assets/icons-mode/chevron-left-dark.svg"
        slider2.src = "assets/icons-mode/chevron-right-dark.svg"
        body.style = "background-image: url(/assets/background-images/background-1-dark.jpg);"
        localStorage.setItem('theme', 'dark')
    } else {
        darkOff.src = "assets/icons-mode/dark-mode-off.svg"
        slider1.src = "assets/icons-login/chevron-left-light.svg"
        slider2.src = "assets/icons-login/chevron-right-light.svg"
        body.style = "background-image: url(/assets/background-images/background-1.jpg);"
        localStorage.setItem('theme', 'light')
    }

    body.classList.toggle('dark-mode-on')


}

function getCurrentMode() {
    return darkOff.src.match("assets/icons-mode/dark-mode-off.svg") ? 'light' : 'dark'
}

darkOff.addEventListener('click', swapMode)