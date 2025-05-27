import { Sprite } from "./sprite";

export class Obstacle extends Sprite {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }

  update(deltaTime: number): void {
    this.x -= 100 * deltaTime; // Move obstacle to the left
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
