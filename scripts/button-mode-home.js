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