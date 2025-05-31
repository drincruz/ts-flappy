## Prerequisites

- [Node.js](https://nodejs.org/) (which includes npm)
- A modern web browser

## Setup and Running the Game

1.  **Clone the repository (if applicable):**

    ```bash
    git clone git@github.com:drincruz/ts-flappy.git
    cd ts-flappy
    ```

2.  **Install dependencies:**
    Install TypeScript and dependencies.

    ```bash
    npm install
    ```

3.  **Compile TypeScript:**

    ```bash
    npm run build
    ```

    This will compile the `.ts` files from your `src` directory into `.js` files in your `dist` directory (or as configured in `tsconfig.json`).

4.  **Serve the game:**

    - **Serve the compiled JavaScript files:**

      ```bash
      npm run serve
      ```

    - **Combining build and serve (equivalent to `npm run build` followed by `npm run serve`):**

      ```bash
      npm run start
      ```

5.  **Open in Browser:**
    Navigate to the local server address in your web browser (e.g., `http://localhost:8080`).

## How to Play

- **Objective:** Guide the bird through the gaps between the pipes without hitting them or the ground/ceiling.
- **Controls:**
  - **Spacebar:** Press the Spacebar to make the bird "flap" and jump upwards.
- **Scoring:** You score one point for each pair of pipes you successfully pass through.
- **Game Over:** The game ends if the bird collides with a pipe, the ground, or the top of the screen.
- **Restart:**
  - When the "Game Over" screen appears, press the **R** key to restart the game.
- **Change Mode:**
  - On the "Game Over" screen, press the **M** key to toggle between "Normal" and "Easy" difficulty modes for the next game. The current mode is displayed.
- **High Score:** Your highest score achieved during the current browser session will be displayed on the "Game Over" screen.

## Development

- **Source Code:** The main game logic is in `/src/main.ts`.
- **Sprites:** The `Sprite` class (`/src/Sprite.ts`) handles image loading and rendering, with fallbacks to placeholder colors.
- **Obstacles:** The `Obstacle` class (`/src/obstacle.ts`) defines the pipe behavior.
- **Compilation:** Use `tsc` or your configured build script (e.g., `npm run build`) to recompile TypeScript files after making changes.

---

Happy Flapping!

![ts-flappy](./ts-flappy.png "ts-flappy")
