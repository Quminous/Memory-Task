// Global variables
let wordsList = [];
let displayedWords = [];
let timerInterval;
let gameTimerInterval;
let timeLeft = 60;
let gameTimeLeft = 180;
let rememberedWords = new Set();

// DOM Elements
const screens = {
    intro: document.getElementById('intro-screen'),
    wordDisplay: document.getElementById('word-display-screen'),
    snakeGame: document.getElementById('snake-game-screen'),
    wordRecall: document.getElementById('word-recall-screen'),
    results: document.getElementById('results-screen')
};

const elements = {
    startBtn: document.getElementById('start-btn'),
    wordGrid: document.getElementById('word-grid'),
    timerDisplay: document.getElementById('timer-display'),
    gameTimerDisplay: document.getElementById('game-timer-display'),
    wordInput: document.getElementById('word-input'),
    recallFeedback: document.getElementById('recall-feedback'),
    checkWordsBtn: document.getElementById('check-words-btn'),
    doneBtn: document.getElementById('done-btn'),
    totalRemembered: document.getElementById('total-remembered'),
    correctWordsList: document.getElementById('correct-words-list'),
    restartBtn: document.getElementById('restart-btn')
};

// Initialize the experiment
async function initExperiment() {
    try {
        // Load words from file
        const response = await fetch('words.txt');
        const text = await response.text();
        wordsList = text.split('\n')
            .map(word => word.trim().toLowerCase())
            .filter(word => word.length > 0);
        
        if (wordsList.length < 50) {
            alert('Error: words.txt must contain at least 50 words');
            return;
        }
        
        setupEventListeners();
        showScreen('intro');
    } catch (error) {
        console.error('Error loading words:', error);
        alert('Error loading words.txt file. Please make sure it exists in the same directory.');
    }
}

function setupEventListeners() {
    elements.startBtn.addEventListener('click', startWordDisplay);
    elements.checkWordsBtn.addEventListener('click', checkWords);
    elements.doneBtn.addEventListener('click', showResults);
    elements.restartBtn.addEventListener('click', restartExperiment);
}

function showScreen(screenName) {
    // Hide all screens
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    
    // Show the requested screen
    screens[screenName].classList.remove('hidden');
}

function startWordDisplay() {
    // Select 50 random words
    displayedWords = getRandomWords(50);
    
    // Display words in grid
    elements.wordGrid.innerHTML = '';
    displayedWords.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.className = 'word-item';
        wordElement.textContent = word;
        elements.wordGrid.appendChild(wordElement);
    });
    
    // Start timer
    timeLeft = 60;
    updateTimerDisplay();
    showScreen('wordDisplay');
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            startSnakeGame();
        }
    }, 1000);
}

function getRandomWords(count) {
    const shuffled = [...wordsList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function updateTimerDisplay() {
    elements.timerDisplay.textContent = `Time remaining: ${timeLeft} seconds`;
}

function startSnakeGame() {
    gameTimeLeft = 180;
    updateGameTimerDisplay();
    showScreen('snakeGame');
    
    // Initialize snake game
    initSnakeGame();
    
    gameTimerInterval = setInterval(() => {
        gameTimeLeft--;
        updateGameTimerDisplay();
        
        if (gameTimeLeft <= 0) {
            clearInterval(gameTimerInterval);
            endSnakeGame();
        }
    }, 1000);
}

function updateGameTimerDisplay() {
    const minutes = Math.floor(gameTimeLeft / 60);
    const seconds = gameTimeLeft % 60;
    elements.gameTimerDisplay.textContent = `Game time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function endSnakeGame() {
    stopSnakeGame();
    showScreen('wordRecall');
    elements.wordInput.focus();
}

function checkWords() {
    const input = elements.wordInput.value.trim().toLowerCase();
    if (!input) return;
    
    const enteredWords = input.split('\n')
        .map(word => word.trim())
        .filter(word => word.length > 0);
    
    // Clear previous feedback
    elements.recallFeedback.innerHTML = '';
    rememberedWords.clear();
    
    // Check each word
    enteredWords.forEach(word => {
        const isInList = displayedWords.includes(word);
        const wordElement = document.createElement('span');
        wordElement.className = `word-feedback ${isInList ? 'word-correct' : 'word-incorrect'}`;
        wordElement.textContent = word;
        elements.recallFeedback.appendChild(wordElement);
        
        if (isInList) {
            rememberedWords.add(word);
        }
    });
    
    // Show done button if we have correct words
    if (rememberedWords.size > 0) {
        elements.doneBtn.classList.remove('hidden');
    }
}

function showResults() {
    const totalRemembered = rememberedWords.size;
    elements.totalRemembered.textContent = totalRemembered;
    
    // Display correct words
    elements.correctWordsList.innerHTML = '';
    Array.from(rememberedWords).forEach(word => {
        const wordElement = document.createElement('span');
        wordElement.textContent = word;
        elements.correctWordsList.appendChild(wordElement);
    });
    
    showScreen('results');
}

function restartExperiment() {
    // Reset all state
    displayedWords = [];
    rememberedWords.clear();
    elements.wordInput.value = '';
    elements.recallFeedback.innerHTML = '';
    elements.doneBtn.classList.add('hidden');
    
    // Clear any running intervals
    if (timerInterval) clearInterval(timerInterval);
    if (gameTimerInterval) clearInterval(gameTimerInterval);
    
    // Reset snake game if needed
    if (window.snakeGame) {
        window.snakeGame.reset();
    }
    
    showScreen('intro');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initExperiment);
