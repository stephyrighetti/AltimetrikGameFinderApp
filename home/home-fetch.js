

function fetchGames(search = '', page = 1) {
    const URL = `https://api.rawg.io/api/games?key=2b2a787b5904427a991cdc2a59670674&page=${page}&search=${search}`
    return fetch(URL)
        .then(response => response.json())
        .then(data => {
            const gamesPromises = data.results.map(game => fetchGame(game)) //List of promises of each game
            return Promise.all(gamesPromises) // New single promise that resolves to a list of games
        })
}

function fetchGame(generalGame) {
    const URL = `https://api.rawg.io/api/games/${generalGame.id}?key=2b2a787b5904427a991cdc2a59670674`

    const gamePromise = fetch(URL)
        .then(response => response.json())
        .then(game => Object.assign(generalGame, game)) // This method copies all enumerable own properties from one or more source objects to a target object. It returns the modified target object.

    return gamePromise
}
