import { Sprite } from "./Sprite.js"; // Assuming your import convention might include .js

export class Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  sprite: Sprite; // Each obstacle will have its own sprite instance
  passed: boolean; // To track if the bird has passed this obstacle for scoring

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    spriteSrc: string,
    placeholderColor: string = "green"
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    // The Sprite class will handle drawing the placeholderColor if spriteSrc is invalid or not yet loaded.
    this.sprite = new Sprite(spriteSrc, placeholderColor);
    this.passed = false; // Initialize passed status
  }

  update(speed: number): void {
    this.x -= speed;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.sprite.draw(ctx, this.x, this.y, this.width, this.height);
  }
}
