
let pageNumber = 1
let currentSearch = ""
let lastSearches = []
let searchTimeout
let store

//Search bar handlers
const inputBar = document.querySelector(".search-games")
const list = document.querySelector('.list')
const liGame = document.querySelector(".games-list-game")
const olList = document.querySelector(".list")
const inputSearchBar = document.querySelector(".search-bar")
const closeIcon = document.querySelector(".close-icon")
const overlay = document.querySelector('.search-overlay')
const containerSearch = document.querySelector(".container-games-list")
const gameList = document.querySelector('.games-list')
const completeList = document.querySelector('.list')
const containerModal = document.querySelector('.container-modal')
const main = document.querySelector('main')

containerModal.addEventListener('click', function () {
    containerModal.style.display = "none"
})

//Redirect user to login if there's not a jwt
const tokenSession = localStorage.getItem('jwt')
if (!tokenSession) {
    location.href = ('/index.html')
}


inputSearchBar.addEventListener("click", function() {
    closeIcon.style.display = "flex"
    gameList.style.display = "flex"
    completeList.style.display = "block"
})


closeIcon.addEventListener("click", function (e) {
    e.stopPropagation()
    gameList.style.display = "none"
    overlay.style.display = "none"
    closeIcon.style.display = "none"
    currentSearch = ""
})


inputBar.addEventListener('click', function() {
    overlay.style.display = "block"
})

inputBar.addEventListener('keydown', inputBarHandler)
inputBar.addEventListener('input', inputBarKeyHandler)

function inputBarHandler(event) {
  if (event.keyCode === 13) {
    event.preventDefault()
    overlay.style.display = "none"
    list.style.display = "none"
    clearCards()
    if (store.length === 0) {
        container.innerHTML += `<p class="searches-not-found">No matches found for your search</p>`
    } else {
        recordSearch(store[0])
        recordSearch(store[1])
        renderCards(store)
        renderSingleCard(store)
    }
  }
}

function inputBarKeyHandler(event) {
    
    const currentWord = event.target.value
    
    function handlerSearch() {
        
        pageNumber = 1

        fetchGames(currentWord, pageNumber)
            .then(games => {
                store = games
                currentSearch = currentWord
                if(store.some(game => game.name.toLowerCase().includes(currentSearch))) {
                    renderList(store)
                } else {
                    olList.innerHTML = ""
                   olList.innerHTML += `<p>No matches found for your search</p>`
                }
            })
            .catch(() => {
                renderError()
            })
    }
        
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(handlerSearch, 500)
}


function recordSearch(game) {
    lastSearches.push(game)
    lastSearches = lastSearches.slice(-2)
}

//Display of cards handlers
const multipleCards = document.querySelector(".column-active")
const singleCard = document.querySelector(".one-card-inactive")
const container =  document.querySelector(".container-cards")
const oneCard = document.querySelector(".container-single")


function clearContainer () {
    container.style.display = "none"
    oneCard.style.display = "flex"   
}

function showContainer() {
    oneCard.style.display = "none"
    container.style.display = "flex"
}


singleCard.addEventListener("click", function () {
    
    if (singleCard.src.match("assets/icons-mode/Single-Active.svg")) {
        return
    }
    
    clearContainer()
    
    singleCard.src = "assets/icons-mode/Single-Active.svg"
    multipleCards.src = "assets/icons-mode/Multiple-Inactive.svg"
})


multipleCards.addEventListener ("click", function () {
    
    if (multipleCards.src.match("assets/icons-mode/Multiple-Active.svg")) {
        return
    }
    
    showContainer()
    
    multipleCards.src = "assets/icons-mode/Multiple-Active.svg"
    singleCard.src = "assets/icons-mode/Single-Inactive.svg"
})

function clearCards() {
    document.querySelector('.container-cards').innerHTML = ""
    document.querySelector('.container-single').innerHTML = ""
}

//Card information handlers
function getData(list) {
    return list.map(g => g.data)
}

function getGenre(list) {
    return list.map(g => g.name).join(", ")
}

function getName(list) {
    return list.map(g => g.name)
}

function getPlatforms(list) {
    return list.map(g => g.platform.name)
}

function getImages(list) {
    return list.map(g => g.image)
}

function getIconsPlay(list, folder, className) {
    
    const platforms =  list.map(g=> g.platform.name)
    
    if (
        platforms.includes('PlayStation') ||
        platforms.includes('PlayStation 2') ||
        platforms.includes('PlayStation 3') ||
        platforms.includes('PlayStation 4') ||
        platforms.includes("Playstation 5")
    ) {
        return `<img src="./assets/${folder}/Playstation.svg" class="${className}" alt="">`
    } 
    
    return ""
}

function getIconsXbox(list, folder, className) {
    
    const platforms = list.map(g=> g.platform.name)
    
    if (platforms.includes('Xbox') || platforms.includes('Xbox 360') || platforms.includes('Xbox One')) {
        return `<img src="./assets/${folder}/Xbox.svg" class="${className}" alt="">`
    }

    return ""
}

function getIconsPc(list, folder, className) {
    
    const platforms = list.map(g=> g.platform.name)
    
    if (platforms.includes('PC') || platforms.includes('macOS') || platforms.includes('Linux')) {
        return `<img src="./assets/${folder}/Windows.svg" class="${className}" alt="">`
    }
    
    return ""
}

function getIconsSwitch(list, folder, className = '') {
    
    const platforms = list.map(g=> g.platform.name)
    
    if (platforms.includes('Nintendo Switch') || platforms.includes('Nintendo')) {
        return `<img src="./assets/${folder}/Switch.svg" class="${className}" alt="">`
    }
   
    return ""
}

//Format date
function formatDate(string) {
    const d = new Date(string);
    return d.toLocaleDateString('en-us', { month: 'short', day: 'numeric', year: 'numeric' })
}

//Scroll handler
let isScrolled=false

function infiniteScroll() {
    if (window.scrollY > (document.body.offsetHeight - 100) && !isScrolled) {
        isScrolled = true
        pageNumber++ 
        getCards().then(() => {
            isScrolled = false
        })
    }
}

window.onscroll = () => {
    infiniteScroll()
}


//Modal handler
function closeModal() {
    const footer = document.querySelector(".footer")
    const modal = document.querySelector('.container-modal')
    modal.innerHTML = ''
    modal.style.display = 'none'
    footer.style.display = 'block'
}

//Get cards handler
let skeleton = document.querySelector('.skeleton')

function getCards() {
    return fetchGames(currentSearch, pageNumber)
        .then(games => {
            renderCards(games)
            renderSingleCard(games)
            console.log(games);
        }) 
        .catch(() => {
            renderError()
        })
}

//Window on load display
window.onload = () =>{

    const userId = JSON.parse(window.localStorage.getItem('id'))
    fetchUser(userId).then(user => {
        renderProfile(user.profile)
        renderHamburgerInfo(user)
    })


    skeleton.style.display = "flex"
    getCards().then(() => {
        skeleton.style.display = "none"
        showContainer()
    })
}

const homeLink = document.querySelector('.links-home') 
homeLink.addEventListener('click', function() {
    last.style = "color: var(--grey); font-weight: 400;"
    currentSearch = ""
    pageNumber = 1
    clearCards()
    
    skeleton.style.display = "flex"
    getCards().then(() => {
        skeleton.style.display = "none"
        showContainer()
    })

})

//Last Searches redirection
const last = document.querySelector('.last-search')

last.addEventListener('click', function() {
    last.style = "color: var(--green2); font-weight: 700;"
    if (lastSearches.length === 0) {
     return document.querySelector('.container-cards').innerHTML = `<p class="searches-not-found">No last searches were found</p>` 
    }
    
    clearCards()
    renderCards(lastSearches)
    renderSingleCard(lastSearches)
})

//Logout
function logOut() {
    localStorage.removeItem('jwt')
    localStorage.removeItem('id')
    location.href = '/index.html';
}

window.addEventListener('load', function () {
    document.querySelector('.log-out').addEventListener('click', function() {
        Swal.fire({
            title: 'Log out',
            text: 'Are you sure you want to log out?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#36B972',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log out!'
        }).then((result) => {
            if (result.isConfirmed) {
                logOut()
            }
        })       
    })
})

//Render error
function renderError() {
    clearCards()
    Swal.fire({
        title: 'Error!',
        text: 'Sorry, something went wrong, try again!',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#36B972'
    })
}


//Tablet hamburger
let hamburger = document.querySelector('.h')
let containerHam = document.querySelector('.container-hamburger')
let menuHam = document.querySelector('.menu-hamburger')
let crossHam = document.querySelector('.cross-hamburger')
let home = document.querySelector('.navigation-home')
let logoutHam = document.querySelector('.log-out-ham')
let footer = document.querySelector('footer')
let body = document.querySelector('body')


hamburger.addEventListener('click', function(event) {
    event.stopPropagation()
   inputSearchBar.style.display = "none"
    hamburger.style.display = "none"
    containerHam.style.display= "block"
    menuHam.style.display = "flex"
    footer.style.display = "none"
    body.style = "overflow-y: hidden;"
})


function closeHamburger() {
    inputSearchBar.style.display = "block"
     hamburger.style.display = "block"
     containerHam.style.display= "none"
     menuHam.style.display = "none"
     body.style = "overflow-y: visible;"
 }

crossHam.addEventListener('click', closeHamburger)
home.addEventListener('click', closeHamburger)
logoutHam.addEventListener('click', logOut)

//Mobile search 
let smallSearch = document.querySelector('.search-mobile')

smallSearch.addEventListener('click', function() {
    
    inputSearchBar.style.display="block"
})


//Dark mode functionality
const darkOffMobile = document.querySelector('.button-dark-off')
const containerMain = document.querySelector('.container-main')
const darkOff = document.querySelector('.dark-off')


function changeColor(console) {
    let device = document.querySelectorAll('.' + console + '-icon')
    device.forEach(element => element.classList.toggle('dark-mode-white'))
}

darkOffMobile.addEventListener('click', function () {
    body.classList.toggle('dark-mode-change')
    darkOffMobile.src = "assets/icons-mode/Dark-mode-on.svg"
    // menuHam.classList.toggle('dark-mode-mobile-toggle')
})

darkOff.addEventListener('click', function(){

    changeColor("xbox");
    changeColor("playstation")
    changeColor("switch")
    changeColor("windows")

    changeColor("xbox-sc");
    changeColor("playstation-sc")
    changeColor("switch-sc")
    changeColor("windows-sc")

    singleCard.classList.toggle('dark-mode-filter')
    multipleCards.classList.toggle('dark-mode-filter')
    
    menuHam.classList.toggle('dark-mode-mobile-toggle')
    darkOff.src = "assets/icons-mode/Dark-mode-on.svg"
    body.classList.toggle('dark-mode-change')
    
})