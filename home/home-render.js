
//Render profile picture of user
function renderProfile(info) {
    const profile = document.querySelector('.avatar-user')
    profile.innerHTML = `<img src="${info}" alt="Avatar user">`
}

//Render information of user for hamburger container
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
                            <p class="single-game-info-title">Release date:</p>
                            <p class="single-game-info-plus">${formatDate(card.released)}</p>
                        </div>
                        <div class="single-game-info-genres">
                            <p class="single-game-info-title">Genres:</p>
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
        key.addEventListener('click', function () {
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
                            <p class="single-game-info-title-sc">Release date:</p>
                            <p class="single-game-info-plus-sc">${formatDate(card.released)}</p>
                        </div>
                        <div class="single-game-info-genres-sc">
                            <p class="single-game-info-title-sc">Genres:</p>
                            <p class="single-game-info-plus-sc">${getGenre(card.genres)}</p>
                        </div>
                        <div class="game-devices-icon-sc">
                        ${getIconsPlay(card?.platforms || "", "icons-cards", "playstation-icon-sc")}
                        ${getIconsXbox(card?.platforms || "", "icons-cards", "xbox-icon-sc")}
                        ${getIconsPc(card?.platforms || "", "icons-cards", "windows-icon-sc")}
                        ${getIconsSwitch(card?.platforms || "", "icons-cards", "switch-icon-sc")}
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
        key.addEventListener ('click', function () {
            renderModal(card)
        })
    })
}

//Render modal
function renderModal(game) {

    const footer = document.querySelector(".footer")
    const modalContainer = document.querySelector('.container-modal')

    fetchTrailer(game.id)  
        .then(trailer => {
            const video = document.querySelector('.video-preview')
            const screenshot = getImages(game.short_screenshots)[5]
            const style = "width: 392px; height: 217px;"
            if (trailer) {
                video.innerHTML = `
                <video style="${style}" poster="${screenshot}" controls="">
                    <source src="${trailer}" type="video/mp4">
                </video>`
            } else {
                video.innerHTML = `<img src="${screenshot}" style="${style}" />`
            }
        })

    const modal = `
        <div class="modal" style="background-image:  linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #F0F0F0 63.23%, #F0F0F0 75.85%), url('${game.background_image}');">
            <div class="cross-icon" onclick="closeModal()">
                <img src="./assets/modal/Cross.svg">
            </div>
            <div class="modal-text">
                <div class="icons-modal">
                ${getIconsPlay(game?.platforms || "", "modal")}
                ${getIconsXbox(game?.platforms || "", "modal")}
                ${getIconsPc(game?.platforms || "","modal")}
                </div>
                <div class="title-modal">
                    <h2>${game.name}</h2>
                </div>
                <div class="extra-info-modal">
                    <p>${formatDate(game.released)}</p>
                    <p><span class="first-letter">#${game.rating_top}</span>TOP 2022</p>
                    <p><span class="first-letter">#9</span> RPG</p>
                </div>
                <div class="game-info-modal">
                    <p>${game.description}</p>
                </div>
                <div class="links-modal">
                    <div class="links-modal-wishlist">
                        <a href="">Add to wishlist</a>
                        <div class="heart-icon-modal">
                            <img src="./assets/modal/Heart.svg">
                        </div>
                    </div>
                    <div class="links-modal-purchase">
                        <a href="">Purchase</a>
                    </div>
                </div>
                <div class="details-modal">
                    <div class="left-column">
                        <div class="platforms-modal">
                            <p class="platforms-modal-title">Platforms</p>
                            <p class="platforms-modal-sp line">${getPlatforms(game.platforms)}</p>
                        </div>
                        <div class="release-modal">
                            <p class="platforms-modal-title">Release date</p>
                            <p class="platforms-modal-sp">${formatDate(game.released)}</p>
                        </div>
                        <div class="publisher-modal">
                            <p class="platforms-modal-title">Publisher</p>
                            <p class="platforms-modal-sp line">${getName(game.publishers)}</p>
                        </div>
                        <div class="website-modal">
                            <p class="platforms-modal-title">Website</p>
                            <a href="#" class="platforms-modal-sp">${game?.website|| "Not available"}</a>
                        </div>
                    </div>
                    <div class="right-column">
                        <div class="genre-modal">
                            <p class="platforms-modal-title">Genre</p>
                            <p class="platforms-modal-sp line">${getGenre(game.genres)}</p>
                        </div>
                        <div class="developer-modal">
                            <p class="platforms-modal-title">Developer</p>
                            <p class="platforms-modal-sp line">${getName(game?.developers || "Not defined")}</p>
                        </div>
                        <div class="age-modal">
                            <p class="platforms-modal-title">Age rating</p>
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
        filteredList.addEventListener('click', function () {
            overlay.style.display = "none"
            clearCards()
            recordSearch([ element ])
            renderSingleCard([ element ])
            renderCards([ element ])
            renderModal([ element ])
        })
    })
}
