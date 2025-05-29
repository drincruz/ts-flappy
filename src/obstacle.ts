import { Sprite } from "./Sprite";

export class Obstacle extends Sprite {
  constructor(src: string, placeholderColor: string) {
    super(src, placeholderColor);
  }

  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, width, height);
  }
}
