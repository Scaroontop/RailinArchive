const welcomeMessages = [
    "Welcome to Railin Games!",
    "Ready to Play?",
    "Game Time!",
    "Let's Have Some Fun!",
    "Best Games Collection",
    "Your Gaming Hub",
    "Time to Play!",
    "Game On!",
    "Choose Your Game",
    "Ready Player One",
    "Level Up!",
    "Play Now",
    "Gaming Time",
    "New Games Added!",
    "Explore & Play"
];

function pageLoad() {
    const randomElement = document.getElementById('randomting');
    if (randomElement) {
        randomElement.innerHTML = getRandomMessage();
    }
    checkAdBlocker();
}

function getRandomMessage() {
    return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
}

function checkAdBlocker() {
    if (window.location.href.includes("railin")) {
        const adBlockInfo = document.createElement('div');
        adBlockInfo.className = 'ad-block-info';
        adBlockInfo.innerHTML = `
            <p>Please consider disabling your ad blocker to support us! 💖</p>
            <button onclick="this.parentElement.style.display='none'">OK</button>
        `;
        document.body.appendChild(adBlockInfo);
    }
}

// Export functions for use in other files
window.pageLoad = pageLoad;
window.getRandomMessage = getRandomMessage;
