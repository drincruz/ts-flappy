export class Sprite {
  image: HTMLImageElement;
  isLoaded: boolean = false;
  placeholderColor: string;

  constructor(src: string, placeholderColor: string = "grey") {
    this.image = new Image();
    this.placeholderColor = placeholderColor;
    this.image.onload = () => {
      this.isLoaded = true;
    };
    this.image.onerror = () => {
      console.error(`Failed to load image: ${src}. Drawing placeholder.`);
      // isLoaded remains false, so placeholder will be drawn
    };
    this.image.src = src;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    if (this.isLoaded) {
      ctx.drawImage(this.image, x, y, width, height);
    } else {
      ctx.fillStyle = this.placeholderColor;
      ctx.fillRect(x, y, width, height);
    }
  }
}
