// DOM Elements
const Frame = document.querySelector(".Projects-Frame");
const HAF = document.querySelectorAll(".hideAfterFullscreen");
const IFrame = document.querySelector(".Projects-IFrame");
const ProjectsContainer = document.querySelector(".Projects-Container");
const SearchBar = document.getElementById("GameSearchBar");

// Game Loading Functions
async function loadGamesFromCDN() {
    try {
        const cdn = await (await fetch("./Hosting/CDN.json")).json();
        const games = await (await fetch(cdn + "list.json")).json();
        games.sort((a, b) => a.game.localeCompare(b.game));
        
        games.forEach(game => {
            addGameToContainer({
                game: game.game,
                gameroot: `${cdn}${game.gameroot}`,
                iconPath: `${cdn}/Icons/${game.game.replace(/[.\s]/g, "")}.webp`
            });
        });
    } catch (error) {
        console.error("Error loading games from CDN:", error);
    }
}

async function loadGamesFromLocal() {
    try {
        const games = await (await fetch('/json/g.json')).json();
        games.forEach(game => {
            addGameToContainer({
                game: game.game,
                gameroot: game.gameroot,
                iconPath: `${game.gameroot}/${game.gameicon}`
            });
        });
    } catch (error) {
        console.error("Error loading local games:", error);
        alert('Error Classes Not Loaded');
        alert(error);
    }
}

// Helper Functions
function addGameToContainer(gameData) {
    const projectDiv = document.createElement("div");
    projectDiv.className = "Projects-Project";
    projectDiv.innerHTML = `
        <img src="${gameData.iconPath}" 
             loading="lazy" 
             onerror="this.src='./Assests/Imgs/NoIcon.png'"/>
        <h1>${gameData.game}</h1>
    `;

    ProjectsContainer.appendChild(projectDiv);

    projectDiv.addEventListener("click", () => {
        HAF.forEach(element => element.classList.add("hidden"));
        Frame.classList.remove("hidden");
        IFrame.src = gameData.gameroot;
    });
}

function handleFrameBarClick(event) {
    switch(event.target.id) {
        case "close":
            HAF.forEach(element => element.classList.remove("hidden"));
            Frame.classList.add("hidden");
            IFrame.src = "";
            break;
            
        case "fullscreen":
            const requestFullscreen = 
                IFrame.requestFullscreen ||
                IFrame.webkitRequestFullscreen ||
                IFrame.msRequestFullscreen;
            requestFullscreen.call(IFrame);
            break;
            
        case "link":
            window.open(IFrame.src);
            break;
    }
}

function handleSearch(event) {
    const searchTerm = SearchBar.value.trim().toLowerCase();
    const gameElements = ProjectsContainer.querySelectorAll(".Projects-Project");

    gameElements.forEach(game => {
        const gameName = game.querySelector("h1").innerText.trim().toLowerCase();
        game.classList.toggle("hidden", !gameName.includes(searchTerm));
    });
}

// Event Listeners
Frame.querySelector(".Projects-FrameBar").addEventListener("click", handleFrameBarClick);
SearchBar.addEventListener("input", handleSearch);

// Initialize
async function init() {
    await loadGamesFromCDN();
    await loadGamesFromLocal();
}

init();
