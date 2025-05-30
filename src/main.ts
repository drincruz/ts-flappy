import { Sprite } from "./Sprite.js";
import { Obstacle } from "./obstacle.js";

// Canvas setup
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Failed to get 2D context");
}

canvas.width = 320; // Typical Flappy Bird width
canvas.height = 480; // Typical Flappy Bird height

// Obstacle constants
const PIPE_WIDTH = 55;
const PIPE_GAP_HEIGHT = 130; // The vertical space for the bird to pass through
const PIPE_SPEED = 2;
const MIN_PIPE_HEIGHT = 30; // Minimum height for a pipe segment
const PIPE_SPAWN_FRAME_INTERVAL = 100; // Spawn a new pipe pair roughly every 1.6 seconds at 60FPS

let obstacles: Obstacle[] = [];
let frameCount = 0;
let isGameOver = false;

// Game variables
const bird = {
  x: 50,
  y: canvas.height / 2,
  width: 20,
  height: 20,
  velocityY: 0,
  gravity: 0.4,
  jumpStrength: -8,
  sprite: new Sprite("../assets/bluebird-midflap.png", "#f0db4f"), // Ensure this path is correct relative to public/index.html
};

function spawnPipePair() {
  // Calculate the Y position for the center of the gap
  // Ensures the gap is not too close to the top or bottom, and pipes have a minimum height
  const gapCenterY =
    Math.random() * (canvas.height - 2 * MIN_PIPE_HEIGHT - PIPE_GAP_HEIGHT) +
    MIN_PIPE_HEIGHT +
    PIPE_GAP_HEIGHT / 2;

  const topPipeHeight = gapCenterY - PIPE_GAP_HEIGHT / 2;
  const bottomPipeY = gapCenterY + PIPE_GAP_HEIGHT / 2;
  const bottomPipeHeight = canvas.height - bottomPipeY;

  // For actual pipe sprites, you'd use paths like "./assets/pipe-top.png"
  // Using "dummy-pipe.png" will trigger the Sprite's placeholderColor.
  const topPipe = new Obstacle(
    canvas.width,
    0,
    PIPE_WIDTH,
    topPipeHeight,
    "dummy-pipe-top.png",
    "green"
  );
  const bottomPipe = new Obstacle(
    canvas.width,
    bottomPipeY,
    PIPE_WIDTH,
    bottomPipeHeight,
    "dummy-pipe-bottom.png",
    "green"
  );

  obstacles.push(topPipe);
  obstacles.push(bottomPipe);
}

// Game loop
function gameLoop() {
  update();
  draw();
  if (!isGameOver) {
    frameCount++;
  }
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  bird.y = canvas.height / 2;
  bird.velocityY = 0;
  obstacles = [];
  frameCount = 0;
  isGameOver = false;
  // spawnPipePair(); // Optionally spawn one pair immediately to start
}

function update() {
  // Apply gravity
  bird.velocityY += bird.gravity;
  bird.y += bird.velocityY;

  // Check for ground collision (Game Over)
  if (bird.y + bird.height > canvas.height) {
    bird.y = canvas.height - bird.height;
    bird.velocityY = 0;
    isGameOver = true;
  }

  // Check for ceiling collision (Game Over)
  if (bird.y < 0) {
    bird.y = 0;
    bird.velocityY = 0;
    isGameOver = true;
  }

  // If game is over from boundary collision, stop further updates for this frame
  if (isGameOver) {
    return;
  }

  // Update obstacles
  obstacles.forEach((obstacle) => {
    obstacle.update(PIPE_SPEED);

    // Check for collision with this obstacle
    if (
      bird.x < obstacle.x + obstacle.width &&
      bird.x + bird.width > obstacle.x &&
      bird.y < obstacle.y + obstacle.height &&
      bird.y + bird.height > obstacle.y
    ) {
      isGameOver = true;
      // No need to check other obstacles once a collision is found
      // The function will return shortly due to isGameOver check or naturally end.
    }
  });

  // If game is over from pipe collision, stop further updates for this frame
  if (isGameOver) {
    return;
  }

  // Remove off-screen obstacles
  obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);

  // Spawn new obstacles
  if (frameCount % PIPE_SPAWN_FRAME_INTERVAL === 0) {
    spawnPipePair();
  }
}

function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Clear canvas (background is set by CSS, but good practice for dynamic backgrounds)
  ctx.fillStyle = "#70c5ce"; // Light blue background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw bird
  bird.sprite.draw(ctx, bird.x, bird.y, bird.width, bird.height);

  // Draw obstacles
  obstacles.forEach((obstacle) => {
    obstacle.draw(ctx!); // ctx is guaranteed to be non-null here due to the check above
  });

  // Draw Game Over screen if applicable
  if (isGameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "40px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText(
      "Press R to Restart",
      canvas.width / 2,
      canvas.height / 2 + 20
    );
  }
}

// Handle input (jump on Spacebar press)
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !isGameOver) {
    bird.velocityY = bird.jumpStrength;
  } else if (e.code === "KeyR" && isGameOver) {
    resetGame();
  }
});

// Initial pipe spawn
// spawnPipePair(); // Optionally spawn one pair immediately

// Start game
gameLoop();
