import { Sprite } from "./Sprite.js";
import { Obstacle } from "./obstacle.js";

// Canvas setup
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Failed to get 2D context");
}

canvas.width = 480; // Typical Flappy Bird width
canvas.height = 640; // Typical Flappy Bird height

// Game Mode
type GameMode = "normal" | "easy";
let currentGameMode: GameMode = "normal"; // Default mode

// Obstacle constants based on mode
const PIPE_WIDTH = 55;
const NORMAL_PIPE_GAP_HEIGHT = 130; // Standard gap height
const EASY_PIPE_GAP_HEIGHT = 200; // Wider gap for easy mode
const PIPE_SPEED = 2;
const MIN_PIPE_HEIGHT = 30; // Minimum height for a pipe segment
const PIPE_SPAWN_FRAME_INTERVAL = 100; // Spawn a new pipe pair roughly every 1.6 seconds at 60FPS

let obstacles: Obstacle[] = [];
let frameCount = 0;
let isGameOver = false;
let score = 0; // Variable to track the player's score
let highScore = 0; // Variable to track the high score for the session

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

function getCurrentPipeGapHeight(): number {
  return currentGameMode === "easy"
    ? EASY_PIPE_GAP_HEIGHT
    : NORMAL_PIPE_GAP_HEIGHT;
}

function spawnPipePair() {
  const currentPipeGapHeight = getCurrentPipeGapHeight();
  // Calculate the Y position for the center of the gap
  // Ensures the gap is not too close to the top or bottom, and pipes have a minimum height
  const gapCenterY =
    Math.random() *
      (canvas.height - 2 * MIN_PIPE_HEIGHT - currentPipeGapHeight) +
    MIN_PIPE_HEIGHT +
    currentPipeGapHeight / 2;

  const topPipeHeight = gapCenterY - currentPipeGapHeight / 2;
  const bottomPipeY = gapCenterY + currentPipeGapHeight / 2;
  const bottomPipeHeight = canvas.height - bottomPipeY;

  // For actual pipe sprites, you'd use paths like "./assets/pipe-top.png"
  // Using "dummy-pipe.png" will trigger the Sprite's placeholderColor.
  const topPipe = new Obstacle(
    canvas.width,
    0,
    PIPE_WIDTH,
    topPipeHeight,
    "../assets/dummy-pipe-top.png",
    "green"
  );
  const bottomPipe = new Obstacle(
    canvas.width,
    bottomPipeY,
    PIPE_WIDTH,
    bottomPipeHeight,
    "../assets/dummy-pipe-bottom.png",
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
  score = 0; // Reset the score
  // Note: highScore is NOT reset here, as it persists across games in a session.
  // spawnPipePair(); // Optionally spawn one pair immediately to start
}

function endGame() {
  isGameOver = true;
  if (score > highScore) {
    highScore = score;
  }
}

function update() {
  // Apply gravity
  bird.velocityY += bird.gravity;
  bird.y += bird.velocityY;

  // Check for ground collision (Game Over)
  if (bird.y + bird.height > canvas.height) {
    bird.y = canvas.height - bird.height;
    bird.velocityY = 0;
    endGame();
  }

  // Check for ceiling collision (Game Over)
  if (bird.y < 0) {
    bird.y = 0;
    bird.velocityY = 0;
    endGame();
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
      endGame();
      // No need to check other obstacles once a collision is found
      // The function will return shortly due to isGameOver check or naturally end.
    }

    // Score increment logic:
    // If the game is not over, this obstacle is a top pipe (y === 0),
    // it hasn't been scored yet, and the bird has passed its right edge.
    if (
      !isGameOver &&
      !obstacle.passed &&
      obstacle.y === 0 &&
      bird.x > obstacle.x + obstacle.width
    ) {
      score++;
      obstacle.passed = true; // Mark this pipe as passed for scoring
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

  // Draw Score
  ctx.fillStyle = "white"; // Color for the score text
  ctx.font = "24px Arial"; // Font size and family for the score
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 10, 30); // Position the score at top-left

  // Draw Game Over screen if applicable
  if (isGameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "40px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 80);

    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 - 50);
    ctx.fillText(
      `High Score: ${highScore}`,
      canvas.width / 2,
      canvas.height / 2 - 30
    );

    ctx.font = "20px Arial";
    ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2);
    ctx.fillText(
      `Press M to change Mode (Current: ${
        currentGameMode.charAt(0).toUpperCase() + currentGameMode.slice(1)
      })`,
      canvas.width / 2,
      canvas.height / 2 + 30
    );
  }
}

// Handle input (jump on Spacebar press)
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !isGameOver) {
    bird.velocityY = bird.jumpStrength;
  } else if (e.code === "KeyR" && isGameOver) {
    resetGame();
  } else if (e.code === "KeyM" && isGameOver) {
    currentGameMode = currentGameMode === "normal" ? "easy" : "normal";
    // No need to call draw() here, the gameLoop will handle it
    // and update the displayed mode on the game over screen.
  }
});

// Initial pipe spawn
// spawnPipePair(); // Optionally spawn one pair immediately

// Start game
gameLoop();
