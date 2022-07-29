import {fetchApi} from './login-fetch.js';

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

    fetchApi(`${API_URL}/login`, dataUser)
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

const errorModal = document.querySelector('.container-modal-error')
const confirmButton = document.querySelector('.confirm-error')

export function renderModalError() {
  errorModal.style.display = "flex"
}

confirmButton.addEventListener('click', function() {
    errorModal.style.display = "none"
})


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

clickSlide(1)
clickSlide(2)
clickSlide(3)
clickSlide(4)
clickSlide(5)
clickSlide(6)



function slide(num) {
    document.querySelector('body').style = `background-image: url(../assets/background-images/background-${num}.jpg)`
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
