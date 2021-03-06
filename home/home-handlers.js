
let pageNumber = 1
let currentSearch = ""
let lastSearches = []
let searchTimeout
let store
let parentPlatformId
let platforms
let isFetching = false

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

containerModal.addEventListener('click', closeModal)


const tokenSession = localStorage.getItem('jwt')
if (!tokenSession) {
    location.href = ('/index.html')
}

inputSearchBar.addEventListener("click", showOverlayList)

function showOverlayList() {
  overlay.style.display = "block"
  closeIcon.style.display = "flex"
  gameList.style.display = "flex"
  completeList.style.display = "block"
}

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

const dotLoad = document.querySelector('.dot-pulse')

function inputBarHandler(event) {

    if (event.keyCode !== 13) {
        return
  }

  event.preventDefault()

  if (dotLoad.style.display === 'block') {
    return
  }

  overlay.style.display = "none"
  list.style.display = "none"
  clearCards()

  if (store.length === 0) {
      container.innerHTML += `<span class="searches-not-found">No matches found for your search</span>`
  } else {
      recordSearch(store[0])
      renderCards(store)
      renderSingleCard(store)
}
}

function inputBarKeyHandler(event) {

    dotLoad.style.display = "block";
    showOverlayList()

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
                  renderList(store)
                } else {
                  olList.innerHTML = ""
                  olList.innerHTML += `<span>No matches found for your search</span>`
                }
            })
            .catch(() => {
                renderModalGeneric("error")
            })
            .finally(() => {
              dotLoad.style.display = "none";
            })
    }

    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(handlerSearch, 500)
}


function recordSearch(game) {
    lastSearches.push(game)
    lastSearches = lastSearches.slice(-2)
}



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

    if (singleCard.src.match("assets/icons-mode/single-active.svg")) {
        return
    }

    clearContainer()

    singleCard.src = "assets/icons-mode/single-active.svg"
    multipleCards.src = "assets/icons-mode/multiple-inactive.svg"
})


multipleCards.addEventListener ("click", function () {

    if (multipleCards.src.match("assets/icons-mode/multiple-active.svg")) {
        return
    }

    showContainer()

    multipleCards.src = "assets/icons-mode/multiple-active.svg"
    singleCard.src = "assets/icons-mode/single-inactive.svg"
})

function clearCards() {
    document.querySelector('.container-cards').innerHTML = ""
    document.querySelector('.container-single').innerHTML = ""
}


function infiniteScroll() {
    const shouldFetch = window.scrollY + document.body.offsetHeight > document.body.scrollHeight - 700
    if (shouldFetch && !isFetching) {
        pageNumber++
        getCards()
    }
}

window.onscroll = () => {
    infiniteScroll()
}


function closeModal() {
    const footer = document.querySelector("footer")
    const modal = document.querySelector('.container-modal')
    modal.innerHTML = ''
    modal.style.display = 'none'
    footer.style.display = 'block'
    hamburger.classList.remove('modal-open')
    body.style = "overflow-y: visible;"
}



let skeleton = document.querySelector('.skeleton')

function getCards() {

    if (isFetching) {
      return
    }

    isFetching = true

    return fetchGames(currentSearch, pageNumber, parentPlatformId)
        .then(games => {
            renderCards(games)
            renderSingleCard(games)
        })
        .catch(() => {
            renderModalGeneric("error")
        })
        .finally(() => {
            isFetching = false
        })
}


window.onload = () => {

   fetchPlatforms().then(data => platforms = data)
    const userId = JSON.parse(window.localStorage.getItem('id'))
    fetchUser(userId).then( user => {
        renderProfile(user.profile)
        renderHamburgerInfo(user)
    })

    skeleton.style.display = "flex"
    getCards().then(() => {
        skeleton.style.display = "none"
        showContainer()
    })

    document.querySelector('.log-out').addEventListener('click', function() {
        renderModalGeneric("logout")
            })

}

const homeLink = document.querySelector('.links-home')
homeLink.addEventListener('click', function() {

    document.querySelector('.container-single').style = "margin-left:250px;"

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


const last = document.querySelector('.last-search')

last.addEventListener('click', function() {

    last.classList.add("selected")

    if (lastSearches.length === 0) {
        document.querySelector('.container-single').style = "margin-left:0;"

        let notFoundAll = document.querySelector('.container-cards').innerHTML = `<p class="searches-not-found">No last searches were found</p>`
        let notFoundSingle = document.querySelector('.container-single').innerHTML = `<p class="searches-not-found">No last searches were found</p>`

        return [notFoundAll, notFoundSingle]
    }

    clearCards()
    renderCards(lastSearches)
    renderSingleCard(lastSearches)
})


function logOut() {
    localStorage.removeItem('jwt')
    localStorage.removeItem('id')
    localStorage.removeItem('name')
    localStorage.removeItem('username')
    localStorage.removeItem('profilePic')
    location.href = '/index.html';
}

const error = document.querySelector('.container-modal-error')
const logoutModal = document.querySelector('.container-modal-logout')

error.addEventListener('click', function() {
    error.style.display="none"
    footer.style.display = "block";
})

const confirm = document.querySelector('.confirm-logout')
const cancel = document.querySelector('.cancel-logout')

confirm.addEventListener('click', function() {
    logOut()
})

cancel.addEventListener('click', function() {
    logoutModal.style.display = "none"
    footer.style.display = "block"
})



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
    inputSearchBar.classList.add('hide-search')
    containerHam.classList.add('show-container')
    hamburger.style.display = "none"
    menuHam.style.display = "flex"
    footer.style.display = "none"
    body.style = "overflow-y: hidden;"
})


function closeHamburger(event) {
    event.stopPropagation()
    inputSearchBar.classList.remove('hide-search')
    containerHam.classList.remove('show-container')
    hamburger.style.display = "block"
    menuHam.style.display = "none"
    body.style = "overflow-y: visible;"
    footer.style.display = "block"
 }

crossHam.addEventListener('click', function(event) {
    event.stopPropagation()
    closeHamburger()
})

home.addEventListener('click', closeHamburger)

logoutHam.addEventListener('click', function() {
    renderModalGeneric('logout')
})


let smallSearch = document.querySelector('.search-mobile')

smallSearch.addEventListener('click', function(event) {
    event.stopPropagation()
    inputSearchBar.classList.toggle('show-search')
})


const darkOffMobile = document.querySelector('.button-dark-off')
const containerMain = document.querySelector('.container-main')
const darkOff = document.querySelector('.dark-off')

function swapMode() {

    const mode = getCurrentMode()

    if (mode === 'light') {
        darkOff.src = "assets/icons-mode/dark-mode-on.svg"
        darkOffMobile.src = "assets/icons-mode/dark-mode-on.svg"
    } else {
        darkOff.src = "assets/icons-mode/dark-mode-off.svg"
        darkOffMobile.src = "assets/icons-mode/dark-mode-off.svg"
    }

    body.classList.toggle('dark-mode-change')
    singleCard.classList.toggle('dark-mode-filter')
    multipleCards.classList.toggle('dark-mode-filter')


}

function getCurrentMode() {
    return darkOff.src.match("assets/icons-mode/dark-mode-off.svg") ? 'light' : 'dark'
}

darkOff.addEventListener('click', swapMode)
darkOffMobile.addEventListener('click', swapMode)


    if (localStorage.getItem('theme') === "dark") {
        darkOff.src = "assets/icons-mode/dark-mode-on.svg"
        darkOffMobile.src = "assets/icons-mode/dark-mode-on.svg"
        body.classList.toggle('dark-mode-change')
        singleCard.classList.toggle('dark-mode-filter')
        multipleCards.classList.toggle('dark-mode-filter')
    }
