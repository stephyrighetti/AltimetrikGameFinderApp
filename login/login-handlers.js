let dot1 = document.querySelector('.carrousel-dot-1');
let dot2 = document.querySelector('.carrousel-dot-2');
let dot3 = document.querySelector('.carrousel-dot-3');
let dot4 = document.querySelector('.carrousel-dot-4');
let dot5 = document.querySelector('.carrousel-dot-5');
let dot6 = document.querySelector('.carrousel-dot-6');


const body = document.querySelector('.body')
const buttonSlideRight = document.querySelector('.slide2')
const buttonSlideLeft = document.querySelector('.slide1')

let currentSlide = 1;
let prevSlide = 0;

buttonSlideRight.addEventListener('click', function() {
    currentSlide++;
    prevSlide++;
    slideImage(prevSlide,currentSlide)
    
})    


buttonSlideLeft.addEventListener('click', function() {
    currentSlide--;
    prevSlide--;
    slideImage(prevSlide,currentSlide)
})    



function slideImage(prev,current) {
    if (current== 1 && prev == 0) {
    body.style =  "background-image: url(../assets/background-1.jpg);"
    } else if(current==2 && prev==1) {
    body.style =  "background-image: url(../assets/background-2.jpg);" 
    } else if (current==3 && prev==2) {
     body.style =  "background-image: url(../assets/background-3.jpg);" 
    } else if (current==4 && prev==3) {
     body.style =  "background-image: url(../assets/background-4.jpg);" 
    } else if (current==5 && prev==4) {
     body.style =  "background-image: url(../assets/background-5.jpg);" 
    } else if (current==6 && prev==5) {
     body.style =  "background-image: url(../assets/background-6.jpg);" 
    }  
}    


const inputEmail = document.querySelector('#username')
const inputPassword =  document.querySelector('#input-password')

const API_URL = 'http://localhost:3000'


window.addEventListener('load', function(){
    const form =  this.document.forms[0]
    form.addEventListener('submit', submitForm)
})

// prevent form submit
const form = document.querySelector("form");
form.addEventListener('submit', function (e) {
    e.preventDefault();
});

function submitForm(event) {

    const inputEmail = document.querySelector('#username')
    const inputPassword =  document.querySelector('#input-password')

    event.preventDefault()
    const dataUser = normalizeData(inputEmail.value, inputPassword.value)
    
    if (!isEmailValid(inputEmail.value) || !isPasswordValid(inputPassword.value)) {
        showError() 
    } 

    if(inputEmail.value === "" || inputPassword.value ==="") {
        showErrorEmpty()
    }

    fetchApi(`${API_URL}/login`, dataUser)

}



function isEmailValid (string) {
    return /\S+@\S+\.\S+/.test(string)
}

function isPasswordValid (string) {
    return string.length >=4 && string.length <=14
}


function showError() {
    document.querySelector('#error-container').classList.remove('hidden')
    document.querySelector('#error-container').innerHTML = '<small>Some of the data entered is not valid</small>'
}

function showErrorEmpty() {
    document.querySelector('#error-container').classList.remove('hidden')
    document.querySelector('#error-container').innerHTML = '<small>Credentials cannot be empty</small>'
}

function normalizeData (email,password) {
    const user = {
        email: email.toLowerCase().trim(),
        password: password.trim()
    }

    return user;
}



/*Eye functionality password*/
const togglePassword = document.querySelector(".toggle-password");
const password = document.querySelector("#input-password");

togglePassword.addEventListener("click", function () {
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    

    if (togglePassword.src.match("assets/icons-login/Eye-off.svg")) {
        togglePassword.src = "assets/icons-login/Eye.svg";
    } else {
        togglePassword.src = "assets/icons-login/Eye-off.svg";
    }
});