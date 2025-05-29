import { Sprite } from "./Sprite.js";

// Canvas setup
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Failed to get 2D context");
}

canvas.width = 320; // Typical Flappy Bird width
canvas.height = 480; // Typical Flappy Bird height

// Game variables
const bird = {
  x: 50,
  y: canvas.height / 2,
  width: 20,
  height: 20,
  velocityY: 0,
  gravity: 0.4,
  jumpStrength: -8,
  sprite: new Sprite("../assets/bluebird-midflap.png", "#f0db4f"),
};

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  // Apply gravity
  bird.velocityY += bird.gravity;
  bird.y += bird.velocityY;

  // Prevent bird from falling off screen (simple floor collision)
  if (bird.y + bird.height > canvas.height) {
    bird.y = canvas.height - bird.height;
    bird.velocityY = 0;
  }

  // Prevent bird from going above screen
  if (bird.y < 0) {
    bird.y = 0;
    bird.velocityY = 0;
  }
}

function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Clear canvas (background is set by CSS, but good practice for dynamic backgrounds)
  ctx.fillStyle = "#70c5ce"; // Light blue background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw bird
  //   ctx.fillStyle = bird.color;
  //   ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
  bird.sprite.draw(ctx, bird.x, bird.y, bird.width, bird.height);
}

// Handle input (jump on Spacebar press)
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    bird.velocityY = bird.jumpStrength;
  }
});

// Start game
gameLoop();
