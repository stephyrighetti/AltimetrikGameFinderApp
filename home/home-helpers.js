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


function formatDate(string) {
    const d = new Date(string);
    return d.toLocaleDateString('en-us', { month: 'short', day: 'numeric', year: 'numeric' })
}