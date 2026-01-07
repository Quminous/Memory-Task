// ============================
// WORD LIST (EMBEDDED)
// ============================

const wordList = [
    "apple", "banana", "orange", "grape", "melon", "strawberry", "blueberry", "raspberry", "peach", "pear",
    "cherry", "plum", "kiwi", "mango", "pineapple", "coconut", "lemon", "lime", "grapefruit", "watermelon",
    "carrot", "broccoli", "spinach", "lettuce", "tomato", "potato", "onion", "garlic", "pepper", "cucumber",
    "zucchini", "eggplant", "mushroom", "corn", "pea", "bean", "celery", "asparagus", "artichoke", "pumpkin",
    "computer", "keyboard", "mouse", "monitor", "printer", "scanner", "router", "modem", "laptop", "tablet",
    "phone", "charger", "cable", "battery", "adapter", "speaker", "headphone", "microphone", "camera", "screen",
    "desk", "chair", "table", "shelf", "cabinet", "drawer", "lamp", "clock", "calendar", "notebook",
    "pen", "pencil", "marker", "eraser", "sharpener", "ruler", "compass", "protractor", "calculator", "folder",
    "book", "magazine", "newspaper", "journal", "dictionary", "encyclopedia", "novel", "poetry", "biography", "textbook",
    "window", "door", "wall", "floor", "ceiling", "roof", "stairs", "elevator", "escalator", "corridor",
    "kitchen", "bathroom", "bedroom", "living", "dining", "garage", "basement", "attic", "balcony", "patio",
    "garden", "lawn", "fence", "gate", "path", "pond", "fountain", "statue", "bench", "swing",
    "car", "truck", "bus", "train", "plane", "bicycle", "motorcycle", "scooter", "skateboard", "roller",
    "river", "mountain", "forest", "desert", "ocean", "island", "valley", "canyon", "waterfall", "volcano",
    "sun", "moon", "star", "planet", "comet", "galaxy", "universe", "space", "orbit", "satellite",
    "cloud", "rain", "snow", "wind", "storm", "lightning", "thunder", "fog", "mist", "hail",
    "spring", "summer", "autumn", "winter", "season", "weather", "climate", "temperature", "humidity", "pressure",
    "music", "dance", "theater", "cinema", "museum", "gallery", "concert", "opera", "ballet", "symphony",
    "sport", "game", "team", "player", "coach", "referee", "stadium", "arena", "track", "field",
    "school", "college", "university", "library", "laboratory", "classroom", "auditorium", "cafeteria", "gymnasium", "stadium",
    "doctor", "nurse", "patient", "hospital", "clinic", "pharmacy", "medicine", "surgery", "therapy", "vaccine",
    "police", "fire", "ambulance", "rescue", "emergency", "safety", "security", "protection", "warning", "danger",
    "friend", "family", "parent", "child", "sibling", "cousin", "grandparent", "neighbor", "colleague", "stranger",
    "happy", "sad", "angry", "calm", "excited", "bored", "tired", "energetic", "nervous", "confident",
    "love", "hate", "fear", "hope", "dream", "wish", "thought", "idea", "memory", "feeling",
    "color", "shape", "size", "weight", "texture", "sound", "smell", "taste", "light", "dark",
    "time", "space", "energy", "matter", "force", "power", "speed", "distance", "direction", "position",
    "animal", "plant", "mineral", "metal", "wood", "plastic", "glass", "ceramic", "fabric", "leather",
    "science", "math", "history", "geography", "language", "literature", "philosophy", "psychology", "sociology", "economics",
    "breakfast", "lunch", "dinner", "snack", "dessert", "beverage", "coffee", "tea", "juice", "water",
    "morning", "afternoon", "evening", "night", "midnight", "dawn", "dusk", "noon", "sunrise", "sunset",
    "north", "south", "east", "west", "up", "down", "left", "right", "forward", "backward"
];

// ============================
// MAIN EXPERIMENT CONTROLLER
// ============================

// Global variables
let displayedWords = [];
let timerInterval;
let gameTimerInterval;
let timeLeft = 60;
let gameTimeLeft = 120;
let rememberedWords = new Set();
let snakeGame;

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
    restartBtn: document.getElementById('restart-btn'),
    score: document.getElementById('score'),
    gameCanvas: document.getElementById('game-canvas')
};

// ============================
// SNAKE GAME CLASS (WITH AUTO-RESTART)
// ============================

class SnakeGame {
    constructor() {
        this.canvas = elements.gameCanvas;
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = elements.score;
        this.reset();
        this.setupControls();
        this.gameLoopInterval = null;
        this.isGameOver = false;
    }

    reset() {
        this.snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        this.food = this.generateFood();
        this.score = 0;
        this.gameRunning = false;
        this.isGameOver = false;
        this.updateScore();
    }

    init() {
        this.reset();
        this.gameRunning = true;
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        
        // Clear any existing interval
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
        }
        
        // Start game loop
        this.gameLoopInterval = setInterval(() => {
            if (this.gameRunning) {
                this.update();
                this.draw();
            }
        }, 100); // Update every 100ms (10 FPS)
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning || this.isGameOver) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (this.direction.y === 0) {
                        this.nextDirection = {x: 0, y: -1};
                    }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (this.direction.y === 0) {
                        this.nextDirection = {x: 0, y: 1};
                    }
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (this.direction.x === 0) {
                        this.nextDirection = {x: -1, y: 0};
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (this.direction.x === 0) {
                        this.nextDirection = {x: 1, y: 0};
                    }
                    break;
            }
        });
    }

    generateFood() {
        const x = Math.floor(Math.random() * (this.canvas.width / 20));
        const y = Math.floor(Math.random() * (this.canvas.height / 20));
        
        // Make sure food doesn't spawn on snake
        for (let segment of this.snake) {
            if (segment.x === x && segment.y === y) {
                return this.generateFood();
            }
        }
        
        return {x, y};
    }

    gameOver() {
        this.isGameOver = true;
        this.gameRunning = false;
        
        // Show "Game Over" message briefly
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 20);
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Restarting in 1 second...', this.canvas.width / 2, this.canvas.height / 2 + 20);
        
        // Restart the game after 1 second
        setTimeout(() => {
            if (gameTimerInterval) { // Check if 3-minute timer is still running
                this.reset();
                this.init();
            }
        }, 1000);
    }

    update() {
        // Update direction
        this.direction = {...this.nextDirection};

        // Move snake
        const head = {...this.snake[0]};
        head.x += this.direction.x;
        head.y += this.direction.y;

        // Check wall collision
        if (head.x < 0 || head.x >= this.canvas.width / 20 ||
            head.y < 0 || head.y >= this.canvas.height / 20) {
            this.gameOver();
            return;
        }

        // Check self collision
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver();
                return;
            }
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
            this.updateScore();
            // Snake grows - don't remove tail
        } else {
            this.snake.pop();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#f8f9fa';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#764ba2' : '#667eea';
            this.ctx.fillRect(segment.x * 20, segment.y * 20, 18, 18);
            this.ctx.strokeStyle = '#fff';
            this.ctx.strokeRect(segment.x * 20, segment.y * 20, 18, 18);
        });

        // Draw food
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.beginPath();
        this.ctx.arc(this.food.x * 20 + 10, this.food.y * 20 + 10, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw score on canvas
        this.ctx.fillStyle = '#333';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 10, 20);
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    stop() {
        this.gameRunning = false;
        this.isGameOver = false;
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
    }
}

// ============================
// EXPERIMENT FUNCTIONS
// ============================

// Initialize the experiment
function initExperiment() {
    try {
        // Check if we have enough words
        if (wordList.length < 50) {
            alert('Error: Need at least 50 words in the word list');
            return;
        }
        
        setupEventListeners();
        showScreen('intro');
    } catch (error) {
        console.error('Error initializing experiment:', error);
        alert('Error initializing experiment. Please check the console for details.');
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
    // Shuffle the array and take the first 'count' elements
    const shuffled = [...wordList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function updateTimerDisplay() {
    elements.timerDisplay.textContent = `Time remaining: ${timeLeft} seconds`;
}

function startSnakeGame() {
    gameTimeLeft = 120;
    updateGameTimerDisplay();
    showScreen('snakeGame');
    
    // Initialize snake game
    if (!snakeGame) {
        snakeGame = new SnakeGame();
    }
    snakeGame.init();
    
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
    if (snakeGame) {
        snakeGame.stop();
    }
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
    if (snakeGame) {
        snakeGame.stop();
        snakeGame.reset();
    }
    
    showScreen('intro');
}

// ============================
// CUSTOMIZE YOUR WORD LIST
// ============================

// To customize the word list, simply edit the 'wordList' array at the top of this file.
// Add or remove words as needed. Make sure you have at least 50 words.

// ============================
// INITIALIZATION
// ============================

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initExperiment);
