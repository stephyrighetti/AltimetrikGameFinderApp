
// Slider logic
const API_URL = 'http://localhost:3000'
let currentSlide = 1

window.addEventListener('load', function(){
    const form = this.document.forms[0]
    form.addEventListener('submit', submitForm)
})

// Function for the form submit logic
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

    if (togglePassword.src.match("assets/icons-login/Eye-off.svg")) {
        togglePassword.src = "assets/icons-login/Eye.svg"
    } else {
        togglePassword.src = "assets/icons-login/Eye-off.svg"
    }
})

// Renders error
function showError(error) {
    document.querySelector('#error-container').classList.remove('hidden')
    document.querySelector('#error-container').innerHTML = `<small>${error}</small>`
}

// Render error
function renderError() {
    Swal.fire({
        title: 'Error!',
        text: 'Sorry, something went wrong, try again!',
        icon: 'error',
        confirmButtonText: 'Ok',
    })
}

const buttonSlideRight = document.querySelector('.slide2')
buttonSlideRight.addEventListener('click', function() {
    currentSlide++
    if (currentSlide == 7) currentSlide = 1
    slide(currentSlide)
    dotColor(currentSlide)
})    

const buttonSlideLeft = document.querySelector('.slide1')
buttonSlideLeft.addEventListener('click', function() {
    currentSlide--
    if (currentSlide == 0) currentSlide = 6
    slide(currentSlide)
    dotColor(currentSlide)
})    

// Function for changing the background image
function slide(num) {
    document.querySelector('body').style = `background-image: url(../assets/background-${num}.jpg)`
}

// Function for the opacity of the dot
function dotColor(num) {
    document.querySelectorAll('.carrousel > div').forEach(element => element.style = "opacity:25%;")
    document.querySelector('.carrousel-dot-' + num).style = "opacity: 100%;"
}

// Simple regex for email validation
function isEmailValid(string) {
    return /\S+@\S+\.\S+/.test(string)
}

// Password validation
function isPasswordValid(string) {
    return string.length >=6 && string.length <=14
}

// Sends formated data to the database
function normalizeData(email, password) {
    
    const user = {
        email: email.toLowerCase().trim(),
        password: password.trim(),
    }

    return user
}
