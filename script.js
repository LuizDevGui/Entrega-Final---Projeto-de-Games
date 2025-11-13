const motoboy = document.querySelector(".motoboy");
const game = document.querySelector(".game");
const score = document.querySelector(".score");

let gameOver = false;
let count = 0;
let obstacles = [];
let jumpInProgress = false;
let bgIndex = 0;

// Fundos de pista realistas
const backgrounds = [
  "https://i.imgur.com/n1S9YRC.png",
  "https://i.imgur.com/Fg4DH6h.png",
  "https://i.imgur.com/YKsoMDA.png",
  "https://i.imgur.com/6nqS0lS.png"
];

// Obstáculos variados
const obstacleImages = [
  "https://i.imgur.com/jNQzvYH.png", // cone
  "https://i.imgur.com/Nm8v3tY.png", // carro
  "https://i.imgur.com/k0rYtFr.png"  // buraco
];

document.addEventListener("keydown", (e) => {
  if ((e.code === "Space" || e.code === "ArrowUp") && !jumpInProgress && !gameOver) {
    jump();
  }
  if (gameOver && (e.code === "Enter" || e.code === "Space")) restartGame();
});

function jump() {
  jumpInProgress = true;
  motoboy.classList.add("jump");
  setTimeout(() => {
    motoboy.classList.remove("jump");
    jumpInProgress = false;
  }, 800);
}

function createObstacle() {
  if (gameOver) return;

  const obst = document.createElement("div");
  obst.classList.add("obstaculo");
  obst.style.left = "1000px";
  obst.style.backgroundImage = `url('${obstacleImages[Math.floor(Math.random() * obstacleImages.length)]}')`;

  game.appendChild(obst);
  obstacles.push(obst);
  moveObstacle(obst);

  const next = Math.random() * 2000 + 2000; // tempo variável entre obstáculos
  setTimeout(createObstacle, next);
}

function moveObstacle(obst) {
  let pos = 1000;
  const speed = 7;

  const move = setInterval(() => {
    if (gameOver) {
      clearInterval(move);
      return;
    }

    pos -= speed;
    obst.style.left = pos + "px";

    if (pos < -100) {
      obst.remove();
      obstacles = obstacles.filter(o => o !== obst);
      clearInterval(move);
      return;
    }

    checkCollision(obst);
  }, 20);
}

function checkCollision(obst) {
  const motoboyRect = motoboy.getBoundingClientRect();
  const obstRect = obst.getBoundingClientRect();

  if (
    motoboyRect.left < obstRect.right &&
    motoboyRect.right > obstRect.left &&
    motoboyRect.bottom > obstRect.top - 50
  ) {
    triggerGameOver();
  }
}

function updateScore() {
  if (gameOver) return;

  count++;
  score.textContent = `SCORE: ${count}`;

  // Troca o fundo a cada 300 pontos
  if (count % 300 === 0) {
    bgIndex = (bgIndex + 1) % backgrounds.length;
    game.style.backgroundImage = `url('${backgrounds[bgIndex]}')`;
  }

  requestAnimationFrame(updateScore);
}

function triggerGameOver() {
  gameOver = true;
  alert(`☠️ Game Over! Seu score foi: ${count}`);
}

function restartGame() {
  obstacles.forEach(o => o.remove());
  obstacles = [];
  count = 0;
  gameOver = false;
  bgIndex = 0;
  game.style.backgroundImage = `url('${backgrounds[0]}')`;
  updateScore();
  createObstacle();
}

// Seleciona o áudio
const bgMusic = document.getElementById("bg-music");

// Define o volume
bgMusic.volume = 0.4;

// Tocar música quando o jogo começar
function startGame() {
  bgMusic.play().catch(err => {
    console.log("Autoplay bloqueado, o som será iniciado após interação do jogador.");
  });


}

// Parar música (por exemplo, em game over)
function stopMusic() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

// Início
updateScore();
createObstacle();
