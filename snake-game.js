class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.reset();
        this.setupControls();
    }

    reset() {
        this.snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        this.direction = {x: 1, y: 0};
        this.food = this.generateFood();
        this.score = 0;
        this.gameRunning = false;
        this.updateScore();
    }

    init() {
        this.reset();
        this.gameRunning = true;
        this.gameLoop();
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (this.direction.y === 0) {
                        this.direction = {x: 0, y: -1};
                    }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (this.direction.y === 0) {
                        this.direction = {x: 0, y: 1};
                    }
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (this.direction.x === 0) {
                        this.direction = {x: -1, y: 0};
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (this.direction.x === 0) {
                        this.direction = {x: 1, y: 0};
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

    update() {
        // Move snake
        const head = {...this.snake[0]};
        head.x += this.direction.x;
        head.y += this.direction.y;

        // Check wall collision
        if (head.x < 0 || head.x >= this.canvas.width / 20 ||
            head.y < 0 || head.y >= this.canvas.height / 20) {
            this.reset();
            return;
        }

        // Check self collision
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.reset();
                return;
            }
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
            this.updateScore();
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
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    gameLoop() {
        if (!this.gameRunning) return;
        
        this.update();
        this.draw();
        setTimeout(() => requestAnimationFrame(() => this.gameLoop()), 100);
    }

    stop() {
        this.gameRunning = false;
    }
}

// Initialize snake game
let snakeGame;

function initSnakeGame() {
    if (!snakeGame) {
        snakeGame = new SnakeGame();
        window.snakeGame = snakeGame;
    }
    snakeGame.init();
}

function stopSnakeGame() {
    if (snakeGame) {
        snakeGame.stop();
    }
}
