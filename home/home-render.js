
//Render profile picture of user
function renderProfile(info) {
    const profile = document.querySelector('.avatar-user')
    profile.innerHTML = `<img src="${info}" alt="Avatar user">`
}


//Render generic modals for errors or logout
function renderModalGeneric(name) {
    document.querySelector('.container-modal-' + name).style.display = "flex"
    inputSearchBar.style = "z-index:1;"
    footer.style.display = "none";
}


//Render information of user for the hamburger container
function renderHamburgerInfo(info) {
    const profile = document.querySelector('.container-user')
    profile.innerHTML =
    `<span class="avatar">
        <img src="${info.profile}" alt="Avatar user">
    </span>
    <div class="user-info">
        <p class="user-name">${info.name}</p>
        <p class="at-user">${info.username}</p>
    </div>
    <div class="cross-hamburger"><img src= "assets/cross.svg"></div>
    `
    document.querySelector('.cross-hamburger').addEventListener('click', closeHamburger)
}

//Render three column cards
function renderCards(list) {

    const container = document.querySelector('.container-cards')

    list.forEach((card, i) => {

        const article = `<article key="${card.id}" class="cards-t">
            <div class="heart-icon">
                <img src="./assets/icons-cards/Heart.svg" alt="Heart icon">
            </div>
            <div class="game-ph">
                <img src="${card.background_image}" alt="Game image">
            </div>
            <div class="game-information">
                <div class="game-title">
                    <h2>${card.name}</h2>
                    <h3>#${(20 * (pageNumber - 1) + i + 1)}</h3>
                </div>
                <div class="container-game-info">
                    <div class="single-game-info">
                        <div class="single-game-info-release">
                            <span class="single-game-info-title">Release date:</span>
                            <p class="single-game-info-plus">${formatDate(card.released)}</p>
                        </div>
                        <div class="single-game-info-genres">
                            <span class="single-game-info-title">Genres:</span>
                            <p class="single-game-info-plus">${getGenre(card.genres.slice(-3))}</p>
                        </div>
                    </div>
                    <div class="game-devices-icon">
                        ${getIconsPlay(card.platforms, "icons-cards", "playstation-icon")}
                        ${getIconsXbox(card.platforms, "icons-cards", "xbox-icon")}
                        ${getIconsPc(card.platforms, "icons-cards",  "windows-icon")}
                        ${getIconsSwitch(card.platforms, "icons-cards", "switch-icon")}
                    </div>
                </div>
            </div>
        </article>`

        container.insertAdjacentHTML('beforeend', article)
    })

    list.forEach(card => {
        const key = document.querySelector(`.container-cards article[key="${card.id}"]`)
        key.addEventListener('click', function (event) {
            event.stopPropagation()
            renderModal(card)
        })
    })
}

//Render one column cards
function renderSingleCard(list) {

    const container = document.querySelector('.container-single')

    list.forEach((card, i) => {

        const article = `<article class="single-card" key="${card.id}">
            <div class="heart-icon-sc">
                <img src="./assets/icons-cards/Heart.svg" alt="Heart icon">
            </div>
            <div class="game-ph-sc">
                <img src="${card.background_image}" alt="Game image">
            </div>
            <div class="game-information-sc">
                <div class="game-title-sc">
                    <h2>${card.name}</h2>
                    <h3>#${(20 * (pageNumber - 1) + i + 1)}</h3>
                </div>
                <div class="container-game-info-sc">
                    <div class="single-game-info-sc">
                        <div class="single-game-info-release-sc">
                            <span class="single-game-info-title-sc">Release date:</span>
                            <p class="single-game-info-plus-sc">${formatDate(card.released)}</p>
                        </div>
                        <div class="single-game-info-genres-sc">
                            <span class="single-game-info-title-sc">Genres:</span>
                            <p class="single-game-info-plus-sc">${getGenre(card.genres)}</p>
                        </div>
                        <div class="game-devices-icon-sc">
                        ${getIconsPlay(card?.platforms || "", "icons-cards", "playstation-sc-icon")}
                        ${getIconsXbox(card?.platforms || "", "icons-cards", "xbox-sc-icon")}
                        ${getIconsPc(card?.platforms || "", "icons-cards", "windows-sc-icon")}
                        ${getIconsSwitch(card?.platforms || "", "icons-cards", "switch-sc-icon")}
                        </div>
                    </div>
                    <div class="game-description-sc">
                        ${card.description}
                    </div>
                </div>
            </div>
        </article>`

        container.insertAdjacentHTML('beforeend', article)
    })

    list.forEach(card => {
        const key = document.querySelector(`.container-single article[key="${card.id}"]`)
        key.addEventListener('click', function (event) {
            event.stopPropagation()
            renderModal(card)
        })
    })
}


//Render modal
function renderModal(game) {

    const footer = document.querySelector("footer")
    const modalContainer = document.querySelector('.container-modal')

    // Gradient
    const mode = getCurrentMode()
    const lightGradient = "background-image:  linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, var(--very-light-grey) 63.23%, var(--very-light-grey) 75.85%)"
    const darkModeGradient = "background-image: linear-gradient(180deg, rgba(48, 48, 48, 0.0001) 0%, var(--dark-grey) 84.4%)"
    const gradient = mode == 'light' ? lightGradient : darkModeGradient

    // Change icon on mobile
    hamburger.classList.add('modal-open')
    body.style = "overflow-y:hidden;"




    fetchTrailer(game.id)
        .then(trailer => {
            const video = document.querySelector('.video-preview')
            const screenshot = getImages(game.short_screenshots)[5]
            const loading = document.querySelector('.loading-video')

            if (trailer) {
                loading.style.display = "none"
                video.innerHTML = `
                <video poster="${screenshot}" controls="" class="video">
                    <source src="${trailer}" type="video/mp4">
                </video>`
            } else {
                loading.style.display = "none"
                video.innerHTML = `<img src="${screenshot}" class="video"/>`
            }
        })

    const modal = `
        <div class="modal" style="${gradient}, url('${game.background_image}');">
            <div class="cross-icon" onclick="closeModal()">
                <img src="./assets/modal/Cross.svg">
            </div>
            <div class="modal-text">
                <div class="icons-modal">
                ${getIconsPlay(game?.platforms || "", "modal", "playstation-icon-modal")}
                ${getIconsXbox(game?.platforms || "", "modal", "")}
                ${getIconsPc(game?.platforms || "","modal", "")}
                ${getIconsSwitch(game?.platforms || "","icons-cards", "icon-modal-switch")}
                </div>
                <div class="title-modal">
                    <h2>${game.name}</h2>
                </div>
                <div class="extra-info-modal">
                    <p>${formatDate(game.released)}</p>
                    <div><span class="first-letter">#${game.rating_top}</span>TOP 2022</div>
                    <div><span class="first-letter">#9</span> RPG</div>
                </div>
                <div class="game-info-modal">
                    <p>${game.description}</p>
                </div>
                <div class="links-modal">
                    <div class="links-modal-wishlist">
                        <a href="#">Add to wishlist</a>
                        <div class="heart-icon-modal">
                            <img src="./assets/modal/Heart.svg">
                        </div>
                    </div>
                    <div class="links-modal-purchase">
                        <a href="#">Purchase</a>
                    </div>
                </div>
                <div class="details-modal">
                    <div class="left-column">
                        <div class="platforms-modal">
                            <span class="platforms-modal-title">Platforms</span>
                            <p class="platforms-modal-sp line">${getPlatforms(game.parent_platforms)}</p>
                        </div>
                        <div class="release-modal">
                            <span class="platforms-modal-title">Release date</span>
                            <p class="platforms-modal-sp">${formatDate(game.released)}</p>
                        </div>
                        <div class="publisher-modal">
                            <span class="platforms-modal-title">Publisher</span>
                            <p class="platforms-modal-sp line">${getName(game?.publishers.slice(0,4) || "Not defined")}</p>
                        </div>
                        <div class="website-modal">
                            <span class="platforms-modal-title">Website</span>
                            <a href="${game?.website || "#"}" class="platforms-modal-sp">${game?.website || "Not available"}</a>
                        </div>
                    </div>
                    <div class="right-column">
                        <div class="genre-modal">
                            <span class="platforms-modal-title">Genre</span>
                            <p class="platforms-modal-sp line">${getGenre(game?.genres || "Not defined")}</p>
                        </div>
                        <div class="developer-modal">
                            <span class="platforms-modal-title">Developer</span>
                            <p class="platforms-modal-sp line">${getName(game?.developers || "Not defined")}</p>
                        </div>
                        <div class="age-modal">
                            <span class="platforms-modal-title">Age rating</span>
                            <p class="platforms-modal-sp">${game.esrb_rating?.name || "Not defined"}</p>
                        </div>
                        <div class="details-icons-modal">
                            <img src="./assets/modal/ChatBubbles.svg" alt="chat bubbles icon">
                            <img src="./assets/modal/Thumbs-Up.svg" alt="thumbs up icon">
                            <img src="./assets/modal/Upload.svg" alt="upload icon">
                        </div>
                    </div>
                </div>
            </div>
            <div class="images-modal">
                <div class="loading-video"></div>
                <div class="video-preview"></div>
                <div class="images-modal-one">
                    <img src="${getImages(game.short_screenshots)[1]}" style="max-width: 184px;">
                    <img src="${getImages(game.short_screenshots)[2]}" style="max-width: 184px;">
                </div>
                <div class= "images-modal-two">
                    <img src="${getImages(game.short_screenshots)[3]}" style="max-width: 184px;">
                    <img src="${getImages(game.short_screenshots)[4]}" style="max-width: 184px;">
                </div>
            </div>
        </div>
            `
    modalContainer.style.display = 'flex'
    modalContainer.innerHTML = modal
    footer.style.display = "none"
    inputSearchBar.style= "z-index:1";
    document.querySelector(".modal").addEventListener('click', e => e.stopPropagation())

}

//Render list of games - searchbar
function renderList(list) {

    const olList = document.querySelector(".list")
    olList.innerHTML = ""

    list.forEach(element => {
        olList.innerHTML += `
            <li class="games-list-game" data-id="${element.id}">${element.name}</li>
            <hr>
        `
    })

    list.forEach(element => {
        const filteredList = document.querySelector(`.games-list-game[data-id="${element.id}"]`)
        filteredList.addEventListener('click', function (event) {
            event.stopPropagation()
            overlay.style.display = "none"
            clearCards()
            recordSearch(element)
            renderSingleCard([ element ])
            renderCards([ element ])
            renderModal([ element ])
        })
    })
}
