
const BASE_URL = 'https://api.rawg.io/api' 
const API_KEY = '7492bcaa11c443159d6a1a26c6c27b14'

// Fetch of games per search queary and page.
function fetchGames(search = '', page = 1) {
    
    const URL = `${BASE_URL}/games?key=${API_KEY}&page=${page}&search=${search}`
    
    return fetch(URL)
        .then(response => response.json())
        .then(data => {
            const gamesPromises = data.results.map(game => fetchGame(game)) // List of promises of each game
            return Promise.all(gamesPromises) // New single promise that resolves to a list of games
        })
        .catch(() => {
            renderError()
        })
}

// Fetch of particular game at endpoint /games/:id merged with general game 
function fetchGame(generalGame) {
    
    const URL = `${BASE_URL}/games/${generalGame.id}?key=${API_KEY}`
    
    return fetch(URL)
        .then(response => response.json())
        .then(game => Object.assign(generalGame, game))
        .catch(() => {
            renderError()
        })
}

// Fetch trailer for the modal 
function fetchTrailer(gameId) {
    
    const URL = `${BASE_URL}/games/${gameId}/movies?key=${API_KEY}`
    
    return fetch(URL)
        .then(response => response.json())
        .then(data => {
            return data.results[0]?.data.max
        })
}

// Fetch user info
function fetchUser(userId) {
    return fetch(`http://localhost:3000/users/${userId}`).then(response => response.json())
}
