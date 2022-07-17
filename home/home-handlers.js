//Global variables
let pageNumber = 1
let currentSearch = ""
let lastSearches = []
let searchTimeout
let store
let parentPlatformId
let platforms

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

//Search functionality and handlers
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
        container.innerHTML += `<span class="searches-not-found">No matches found for your search</span>`
    } else {
        recordSearch(store[0])
        recordSearch(store[1])
        renderCards(store)
        renderSingleCard(store)
    }
  }
}

const dotLoad = document.querySelector('.dot-pulse')

function inputBarKeyHandler(event) {

    dotLoad.style.display = "block";
    
    const currentWord = event.target.value
    
    function handlerSearch() {
        
        pageNumber = 1

        const [ text, parentPlatform ] = parseSearchQuery(currentWord)

        fetchGames(text, pageNumber, parentPlatform)
            .then(games => {
                store = games
                currentSearch = text
                parentPlatformId = parseSearchQuery(currentWord)[1]
                if(store.some(game => game.name.toLowerCase().includes(currentSearch))) {
                    dotLoad.style.display = "none";
                    renderList(store)
                } else {
                    olList.innerHTML = ""
                   olList.innerHTML += `<span>No matches found for your search</span>`
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


//Handle search query for console 
function parseSearchQuery(currentWord) {
   
    let text = currentWord
    let parentPlatform = '' 

    for (let i = 0; i < platforms.length; i++) {
        if(currentWord.toLowerCase() === platforms[i].name.toLowerCase()) {
            text = ""
            parentPlatform = platforms[i].id
           }
        
        }
    
    return [ text, parentPlatform ]
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
        return `<img src="./assets/${folder}/Playstation.svg" class="${className}" alt="${className}">`
    } 
    
    return ""
}

function getIconsXbox(list, folder, className) {
    
    const platforms = list.map(g=> g.platform.name)
    
    if (platforms.includes('Xbox') || platforms.includes('Xbox 360') || platforms.includes('Xbox One')) {
        return `<img src="./assets/${folder}/Xbox.svg" class="${className}" alt="${className}">`
    }

    return ""
}

function getIconsPc(list, folder, className) {
    
    const platforms = list.map(g=> g.platform.name)
    
    if (platforms.includes('PC') || platforms.includes('macOS') || platforms.includes('Linux')) {
        return `<img src="./assets/${folder}/Windows.svg" class="${className}" alt="${className}">`
    }
    
    return ""
}

function getIconsSwitch(list, folder, className = '') {
    
    const platforms = list.map(g=> g.platform.name)
    
    if (platforms.includes('Nintendo Switch') || platforms.includes('Nintendo')) {
        return `<img src="./assets/${folder}/Switch.svg" class="${className}" alt="${className}">`
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
    return fetchGames(currentSearch, pageNumber, parentPlatformId)
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
window.onload = () => {

    fetchPlatforms()
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
    last.classList.remove("selected")
    
    currentSearch = ""
    pageNumber = 1
    parentPlatformId = ""
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

    last.classList.add("selected")

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


//Tablet and mobile hamburger handlers
const hamburger = document.querySelector('.h')
const containerHam = document.querySelector('.container-hamburger')
const menuHam = document.querySelector('.menu-hamburger')
const crossHam = document.querySelector('.cross-hamburger')
const home = document.querySelector('.navigation-home')
const logoutHam = document.querySelector('.log-out-ham')
const footer = document.querySelector('footer')
const body = document.querySelector('body')


hamburger.addEventListener('click', function(event) {
    event.stopPropagation()
    inputSearchBar.classList.add('block-search')
    hamburger.style.display = "none"
    containerHam.style.display= "block"
    menuHam.style.display = "flex"
    footer.style.display = "none"
    body.style = "overflow-y: hidden;"
})


function closeHamburger() {
    inputSearchBar.classList.remove('block-search')
     hamburger.style.display = "block;"
     containerHam.style.display= "none;"
     menuHam.style.display = "none;"
     body.style = "overflow-y: visible;"
     footer.style.display = "block;"
 }

crossHam.addEventListener('click', function(event) {
    event.stopPropagation()
    closeHamburger()
})

home.addEventListener('click', closeHamburger)
logoutHam.addEventListener('click', logOut)

//Mobile search handlers
let smallSearch = document.querySelector('.search-mobile')

smallSearch.addEventListener('click', function(event) { 
    event.stopPropagation()   
    inputSearchBar.classList.toggle('block-search')
})


//Dark mode functionality
const darkOffMobile = document.querySelector('.button-dark-off')
const containerMain = document.querySelector('.container-main')
const darkOff = document.querySelector('.dark-off')

function swapMode() {
    
    const mode = getCurrentMode()
    
    if (mode == 'light') {
        darkOff.src = "assets/icons-mode/Dark-mode-on.svg"
        darkOffMobile.src = "assets/icons-mode/Dark-mode-on.svg"
    } else {
        darkOff.src = "assets/icons-mode/Dark-mode-off.svg"
        darkOffMobile.src = "assets/icons-mode/Dark-mode-off.svg"
    }

    body.classList.toggle('dark-mode-change')
    singleCard.classList.toggle('dark-mode-filter')
    multipleCards.classList.toggle('dark-mode-filter')

    
}

function getCurrentMode() {
    return darkOff.src.match("assets/icons-mode/Dark-mode-off.svg") ? 'light' : 'dark'
}

darkOff.addEventListener('click', swapMode)
darkOffMobile.addEventListener('click', swapMode)


