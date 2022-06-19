
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

//Redirect user to login if there's not a jwt
const tokenSession = localStorage.getItem('jwt')
if (!tokenSession) {
    location.href = ('/index.html')
}

inputSearchBar.addEventListener ("click", function() {
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
    renderCards(store)
    renderSingleCard(store)
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
                renderList(games)
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
let spinner = document.querySelector('.loading')

function getCards() {
    return fetchGames(currentSearch, pageNumber)
        .then(games => {
            renderCards(games)
            renderSingleCard(games)
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
    })

    spinner.style.display = "flex"
    getCards().then(() => {
        spinner.style.display = "none"
        showContainer()
    })
}

//Last Searches redirection
const last = document.querySelector('.last-search')

last.addEventListener('click', function() {
    
    if (lastSearches.length == 0) {
        return
    }
    
    clearCards()
    renderCards(lastSearches[0])
    renderCards(lastSearches[1])
    renderSingleCard(lastSearches[0])
    renderSingleCard(lastSearches[1])
})

//Logout
function logOut() {
    localStorage.removeItem('jwt')
    localStorage.removeItem('id')
    location.href = 'http://localhost:5500/index.html';
}

window.addEventListener('load', function () {
    document.querySelector('.log-out').addEventListener('click', function() {
        Swal.fire({
            title: 'Log out',
            text: 'Are you sure you want to log out?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
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
    })
}
