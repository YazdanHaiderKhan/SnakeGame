let board = document.querySelector(".board");
let blockHeight = 60;
let blockWidth = 60;
let highestScore = 0;
let score = 0;
let startTime = Date.now();
const startButton = document.querySelector(".btn-start");
let modal = document.querySelector(".modal");
let startGameModal = document.querySelector(".start-game");
let gameOverModal = document.querySelector(".game-over");
const scoreDisplay = document.querySelector("#Score");
const lastScore = document.querySelector("#last-score");
const highestScoreDisplay = document.querySelector("#High-score");
const restartButton = document.querySelector(".restart");
const timeDisplay = document.querySelector("#Time");
let cols = Math.floor(board.clientWidth / blockWidth);
let rows = Math.floor(board.clientHeight / blockHeight);
let blocks = [];
let direction = "right";
let intervalId = null;
highestScoreDisplay.innerText = JSON.parse(localStorage.getItem("highestScore")) || 0;
let snake = [
  {
    x: 1,
    y: 3,
  },
];
let food = null;
food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    let block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    // block.innerText = `${row},${col}`;
    blocks[`${row},${col}`] = block;
  }
}
function render() {
  let head = null;
  // movement of snake
  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }
  // if snake touches itself or touches the boundary
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols || blocks[`${head.x},${head.y}`].classList.contains("fill")) {
    clearInterval(intervalId);
    startGameModal.style.display = "none";
    modal.style.display = "flex";
    gameOverModal.style.display = "flex";
    lastScore.innerText = score;
    return;
  }
  // if snake consumes the food
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x},${food.y}`].classList.remove("food");
    snake.unshift(head);
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x},${food.y}`].classList.add("food");
    score +=1;
    scoreDisplay.innerText = score;
    if(score>highestScore){
        highestScore = score;
        localStorage.setItem("highestScore", JSON.stringify(highestScore));
        highestScoreDisplay.innerText = highestScore;
    }
  }
  let currentTime = Date.now();
  let elapsedTime = Math.floor((currentTime - startTime)/1000);
  let minutes = Math.floor(elapsedTime/60);
  let seconds = elapsedTime%60;
  let minutesStr = minutes.toString();
  let secondsStr = seconds.toString();
  timeDisplay.innerHTML = `${minutesStr.padStart(2, "0")}:${secondsStr.padStart(2, "0")}`;
  blocks[`${food.x},${food.y}`].classList.add("food");
  snake.forEach((block) => {
    blocks[`${block.x},${block.y}`].classList.remove("fill");
  });
  snake.unshift(head);
  snake.pop();
  snake.forEach((block) => {
    blocks[`${block.x},${block.y}`].classList.add("fill");
  });
}
render();
function startGame() {
  intervalId = setInterval(() => {
    render();
  }, 200);
}
startButton.addEventListener("click", () => {
  startGameModal.style.display  = "none";
  modal.style.display = "none";
  clearInterval(intervalId);
  startGame();
});
restartButton.addEventListener("click", () => {
    blocks[`${food.x},${food.y}`].classList.remove("food");
    snake.forEach(block =>{
        blocks[`${block.x},${block.y}`].classList.remove("fill");
    })

  clearInterval(intervalId);
  snake = [
    {
      x: 1,
      y: 3,
    },
  ];
  direction = "right";
  score = 0;
  startTime = Date.now();
  scoreDisplay.innerText = score;
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  modal.style.display = "none";
//   gameOverModal.style.display = "none";
  intervalId = setInterval(() => {
    render();
  }, 200);
});
addEventListener("keydown", (e) => {
  if (e.key == "ArrowLeft" && direction !== "right") {
    direction = "left";
    // move();
  } else if (e.key == "ArrowRight" && direction !== "left") {
    direction = "right";
    // move();
  } else if (e.key == "ArrowUp" && direction !== "down") {
    direction = "up";
    // move();
  } else if (e.key == "ArrowDown" && direction !== "up") {
    direction = "down";
    // move();
  }
});

let touchStartX = 0;
let touchStartY = 0;

board.addEventListener("touchstart", function (e) {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, { passive: true });

board.addEventListener("touchend", function (e) {
  const touch = e.changedTouches[0];
  let touchEndX = touch.clientX;
  let touchEndY = touch.clientY;

  let dx = touchEndX - touchStartX;
  let dy = touchEndY - touchStartY;

  // Detect swipe direction
  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal swipe
    if (dx > 30 && direction !== "left") {
      direction = "right";
    } else if (dx < -30 && direction !== "right") {
      direction = "left";
    }
  } else {
    // Vertical swipe
    if (dy > 30 && direction !== "up") {
      direction = "down";
    } else if (dy < -30 && direction !== "down") {
      direction = "up";
    }
  }
});