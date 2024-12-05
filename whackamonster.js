let countdown;
let score = 0;
let activeMonster = null;
let monsterCycleActive = false; // Tracks whether the monster cycle should run
let eventListenersInitialized = false; // Track if listeners are added

function welcomeMessage() {
    const playerNameInput = document.getElementById('playerName');
    const playerName = playerNameInput.value.trim();

    document.getElementById('playerName').classList.add('hidden');
    document.getElementById('play').classList.add('hidden');

    if (playerName) {
        alert(`Welcome, ${playerName}! Get ready to play!`);
        const playersNameDiv = document.getElementById('playersName');
        playersNameDiv.innerText = `Player: ${playerName}`;
        playersNameDiv.classList.remove('hidden');
        document.getElementById('welcomeMessage').classList.add('hidden');
        document.getElementById('score').classList.remove('hidden');
        document.getElementById('timer').classList.remove('hidden');
        startGame();
    } else {
        alert('Please, enter your name to start the game.');
    }
}

function startGame() {
    let timeLeft = 30;
    score = 0;
    activeMonster = null;
    monsterCycleActive = true;

    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    timerElement.innerText = `Time left: ${timeLeft}s`;
    scoreElement.innerText = `Score: ${score}`;
    document.getElementById('playerName').classList.add('hidden');
    const holes = document.querySelectorAll('.hole');
    holes.forEach(hole => hole.classList.remove('hidden'));

    countdown = setInterval(() => {
        timeLeft--;
        timerElement.innerText = `Time Left: ${timeLeft}s`;
        timerElement.style.color = getRandomColor();

        if (timeLeft <= 0) {
            clearInterval(countdown);
            endGame();
        }
    }, 1000);

    startMonsterCycle();
}

function startMonsterCycle() {
    const holes = document.querySelectorAll('.hole');

    function showMonster() {
        if (!monsterCycleActive) return; // Stop the monster cycle if inactive

        if (activeMonster) {
            activeMonster.classList.remove('active');
        }

        const randomIndex = Math.floor(Math.random() * holes.length);
        activeMonster = holes[randomIndex];

        if (!activeMonster.querySelector('.monster')) {
            const monster = document.createElement('div');
            monster.classList.add('monster');
            activeMonster.appendChild(monster);
        }

        activeMonster.classList.add('active');

        setTimeout(() => {
            if (monsterCycleActive && activeMonster) {
                activeMonster.classList.remove('active');
                activeMonster = null;
            }
            if (monsterCycleActive) showMonster(); // Continue the cycle only if active
        }, 1000);
    }

    if (!eventListenersInitialized) {
        // Add click listeners to each hole only once
        holes.forEach(hole => {
            hole.addEventListener('click', () => {
                if (hole === activeMonster && monsterCycleActive) {
                    increaseScore(hole);
                }
            });
        });
        eventListenersInitialized = true; // Mark listeners as initialized
    }

    showMonster();
}

function increaseScore(hole) {
    score++;
    const scoreElement = document.getElementById('score');
    scoreElement.innerText = `Score: ${score}`;
    hole.classList.add('hit');
    setTimeout(() => hole.classList.remove('hit'), 300);
}

function endGame() {
    monsterCycleActive = false; // Stop the monster cycle
    clearInterval(countdown);

    // Clear all active monsters
    const holes = document.querySelectorAll('.hole');
    holes.forEach(hole => {
        hole.classList.remove('active');
        const monster = hole.querySelector('.monster');
        if (monster) {
            hole.removeChild(monster); // Remove lingering monster
        }
    });

    alert(`Time's up! Game over! Your final score is ${score}.`);
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const nameboxElement = document.getElementById('playerName');
    timerElement.classList.add('hidden');
    scoreElement.classList.add('hidden');
    nameboxElement.classList.add('hidden');
    const replayButton = document.getElementById('replay');
    replayButton.classList.remove('hidden');
}

function replayGame() {
    document.getElementById('replay').classList.add('hidden');
    document.getElementById('score').classList.remove('hidden');
    document.getElementById('timer').classList.remove('hidden');
    document.getElementById('playerName').classList.remove('hidden');
    startGame();
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}