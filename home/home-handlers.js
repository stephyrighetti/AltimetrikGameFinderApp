//limpiar variable current search
let pageNumber = 1;
let currentSearch="";

//Search bar handlers
let inputBar = document.querySelector(".search-games");
let liGame = document.querySelector(".games-list-game");
let olList = document.querySelector(".list");
let inputSearchBar = document.querySelector(".search-bar");
let closeIcon = document.querySelector(".close-icon");
let containerSearch = document.querySelector(".container-games-list");
let gameList = document.querySelector('.games-list');
let completeList = document.querySelector('.list');
let lastSearches = [];
let searchTimeout;
let store;

inputSearchBar.addEventListener ("click", function() {
    closeIcon.style.display = "flex";
    gameList.style.display="flex";
    completeList.style.display="block";
    return
})


closeIcon.addEventListener("click", function (e) {
    e.stopPropagation() //to stop propagation of the other events.
    gameList.style.display = "none";
    closeIcon.style.display = "none";
    currentSearch="";
    return;
})




inputBar.addEventListener('keydown', inputBarHandler)
inputBar.addEventListener('input', inputBarKeyHandler)

function inputBarHandler(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    clearCards()
    renderCards(store)
    renderSingleCard(store)
  }
}


function inputBarKeyHandler(event) {
  const currentWord = event.target.value;

  function handlerSearch() {
    pageNumber = 1
    fetchGames(currentWord, pageNumber)
      .then(games => {
        store = games;
        currentSearch = currentWord;
        renderList(games)
      })
    //   .catch(() => {
    //     renderError()
    //   })
  }

  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(handlerSearch, 500)
}

function recordSearch(game) {
    lastSearches.push(game)
    lastSearches = lastSearches.slice(-2)
}

//Display of cards handlers

const multipleCards = document.querySelector(".column-active");
const singleCard = document.querySelector(".one-card-inactive");
const container =  document.querySelector(".container-cards");
const oneCard = document.querySelector(".container-single");


function clearContainer () {
    container.style.display = "none";
    oneCard.style.display = "flex";
    
}

function showContainer() {
    oneCard.style.display = "none";
    container.style.display = "flex";
}


singleCard.addEventListener("click", function () {

    if (singleCard.src.match("assets/icons-mode/Single-Active.svg")) {
        return
    }

    clearContainer();

    singleCard.src = "assets/icons-mode/Single-Active.svg"
    multipleCards.src = "assets/icons-mode/Multiple-Inactive.svg"
})


multipleCards.addEventListener ("click", function () {
    if (multipleCards.src.match("assets/icons-mode/Multiple-Active.svg")) {
        return
    }

    showContainer();

    multipleCards.src = "assets/icons-mode/Multiple-Active.svg"
    singleCard.src = "assets/icons-mode/Single-Inactive.svg"
})

function clearCards() {
    document.querySelector('.container-cards').innerHTML = ""
    document.querySelector('.container-single').innerHTML = ""
}

//Card information handlers

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
    const platforms =  list.map(g=> g.platform.name);

    if(platforms.includes('PlayStation')|| platforms.includes('PlayStation 2')||platforms.includes('PlayStation 3')|| platforms.includes('PlayStation 4')|| platforms.includes("Playstation 5")) {
        return `<img src="./assets/${folder}/Playstation.svg" class="${className}" alt="">`
    } else {
        return ""
    }
}

function getIconsXbox(list, folder, className) {
    const platforms =  list.map(g=> g.platform.name);

    if(platforms.includes('Xbox')||platforms.includes('Xbox 360')|| platforms.includes('Xbox One')) {
        return `<img src="./assets/${folder}/Xbox.svg" class="${className}" alt="">`
    } else {
        return ""
    }

}

function getIconsPc(list, folder, className) {
    const platforms =  list.map(g=> g.platform.name);

    if(platforms.includes('PC') || platforms.includes('macOS') || platforms.includes('Linux')) {
        return `<img src="./assets/${folder}/Windows.svg" class="${className}" alt="">`
    } else {
        return ""
    }
}

function getIconsSwitch(list, folder, className = '') {
    const platforms =  list.map(g=> g.platform.name);
    if(platforms.includes('Nintendo Switch') || platforms.includes('Nintendo')) {
        return `<img src="./assets/${folder}/Switch.svg" class="${className}" alt="">`
    } else {
        return ""
    }
}

//Format date handler 

function formatDate(string) {
    const d = new Date(string);
    return d.toLocaleDateString('en-us', { month: 'short', day: 'numeric', year: 'numeric' })
}

//Scroll handler
let isScrolled=false;

function infiniteScroll() {
    if (window.scrollY > (document.body.offsetHeight - 100) && !isScrolled) {
        isScrolled = true;

        pageNumber++ 
        getCards().then(() => {
            isScrolled = false;
        });
    }
}


window.onscroll = function() {
    infiniteScroll();
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


function getCards() {
    const prom = fetchGames(currentSearch,pageNumber)
    return prom.then(games => {
        console.log(games);
        renderCards(games)
        renderSingleCard(games)
    }) //TO DO: agregar catch
    //TO DO: fallback de las promises
}

getCards()

//Last Searches 
let last = document.querySelector('.last-search')

last.addEventListener('click', function() {
    console.log(lastSearches);
    clearCards();
    renderCards(lastSearches[0])
    renderCards(lastSearches[1])
    renderSingleCard(lastSearches[0])
    renderSingleCard(lastSearches[1])
   
})

//Logout
function logOut() {
    localStorage.removeItem('jwt')
    location.href = 'http://localhost:5500/index.html';
}

window.addEventListener('load', function () {
    document.querySelector('.log-out').addEventListener('click', function() {
            if (confirm('Do you want to log out?')) {
                logOut();
            }
        })

    })



let tokenSession = localStorage.getItem('jwt')
    if (!tokenSession) {
    location.href = ('/index.html');
}