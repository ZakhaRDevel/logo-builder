import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LogoBuilderControlsComponent } from './logo-builder-controls/logo-builder-controls.component';
import jsPDF from 'jspdf';
import {CoreService} from "../../services/core.service";

@Component({
  selector: 'app-logo-builder',
  standalone: true,
  imports: [FormsModule, LogoBuilderControlsComponent],
  templateUrl: './logo-builder.component.html',
  styleUrls: ['./logo-builder.component.scss'],
})
export class LogoBuilderComponent implements AfterViewInit {
  @ViewChild('logoCanvas', { static: true }) logoCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('backgroundCanvas', { static: true }) backgroundCanvas!: ElementRef<HTMLCanvasElement>;
  @Output() logoUpdated = new EventEmitter<string>();
  logoBackgroundColor: string = '#ffffff';
  textColor: string = '#000000';
  logoBackgroundImage: HTMLImageElement | null = null;
  logoSize = { width: 768, height: 420 };
  defaultIconSrc = 'assets/img/icons/logo-builder-icon.svg';
  secondIconSrc = 'assets/img/icons/exportbrand/icon-2.svg';
  userText: string = 'Some test text';
  backgroundImagePosition = { x: 0, y: 0 };
  iconColor: string = '#0070CE';
  iconBackgroundImage: HTMLImageElement | null = null;
  dragging = false;
  dragStart = { x: 0, y: 0 };
  selectedFormat: string = 'PNG';
  private defaultIconImage: HTMLImageElement = new Image();
  private secondIconImage: HTMLImageElement = new Image();
  private coreService = inject(CoreService);

  constructor() {
    this.defaultIconImage.src = this.defaultIconSrc;
    this.secondIconImage.src = this.secondIconSrc;
  }

  async ngAfterViewInit() {
    if (this.coreService.isBrowser()) {
      try {
        await this.loadImages();
        this.drawBackground();
        this.drawLogo();

        await document.fonts.ready;
        this.drawText();
        this.emitLogo();
      } catch (error) {
        console.error("Error during logo initialization:", error);
      }
    }
  }

  async loadImages(): Promise<void> {
    try {
      await Promise.all([
        this.loadImage(this.defaultIconImage),
        this.loadImage(this.secondIconImage),
      ]);
    } catch (error) {
      console.error("Error loading images:", error);
    }
  }

  loadImage(img: HTMLImageElement): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${img.src}`));
    });
  }

  onHeightChange(height: number): void {
    this.logoSize.height = height;
  }

  onWidthChange(width: number): void {
    this.logoSize.width = width;
  }

  onFormatChange(format: string): void {
    this.selectedFormat = format;
  }

  onIconChange(iconPath: string): void {
    this.secondIconSrc = iconPath;
    this.secondIconImage.src = iconPath;
    this.loadImage(this.secondIconImage).then(() => this.drawLogo());
  }

  onTextChange(newText: string): void {
    this.userText = newText;
    this.drawText();
  }

  onTextColorChange(newTextColor: string): void {
    this.textColor = newTextColor;
    this.drawText();
  }

  onBackgroundColorChange(color: string): void {
    this.logoBackgroundColor = color;
    this.logoBackgroundImage = null;
    this.drawBackground();
  }

  onBackgroundImageChange(file: File): void {
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target) {
        const img = new Image();
        img.onload = () => {
          this.logoBackgroundImage = img;
          this.drawBackground();
        };
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  onIconBackgroundImageChange(file: File): void {
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target) {
        const img = new Image();
        img.onload = () => {
          this.iconBackgroundImage = img;
          this.drawLogo();
        };
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  onIconColorChange(newColor: string): void {
    this.iconColor = newColor;
    this.iconBackgroundImage = null;
    this.drawLogo();
  }

  emitLogo() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    if (ctx) {
      canvas.width = this.logoSize.width;
      canvas.height = this.logoSize.height;

      ctx.drawImage(
        this.backgroundCanvas.nativeElement,
        0,
        0,
        this.logoSize.width,
        this.logoSize.height
      );
      ctx.drawImage(this.logoCanvas.nativeElement, 0, 0, this.logoSize.width, this.logoSize.height);
      const dataUrl = canvas.toDataURL('image/png');
      this.logoUpdated.emit(dataUrl);
    }
  }

  downloadImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    if (ctx) {
      canvas.width = this.logoSize.width;
      canvas.height = this.logoSize.height;

      ctx.drawImage(
        this.backgroundCanvas.nativeElement,
        0,
        0,
        this.logoSize.width,
        this.logoSize.height
      );
      ctx.drawImage(this.logoCanvas.nativeElement, 0, 0, this.logoSize.width, this.logoSize.height);

      switch (this.selectedFormat) {
        case 'PNG':
          this.downloadAsPNG(canvas);
          break;
        case 'JPG':
          this.downloadAsJPG(canvas);
          break;
        case 'PDF':
          this.downloadAsPDF(canvas);
          break;
        case 'PSD':
          this.downloadAsPSD(canvas);
          break;
        default:
          this.downloadAsPNG(canvas);
      }
    }
  }

  downloadAsPNG(canvas: HTMLCanvasElement) {
    const dataUrl = canvas.toDataURL('image/png');
    this.downloadFile(dataUrl, 'logo.png');
  }

  downloadAsJPG(canvas: HTMLCanvasElement) {
    const dataUrl = canvas.toDataURL('image/jpeg');
    this.downloadFile(dataUrl, 'logo.jpg');
  }

  downloadAsPDF(canvas: HTMLCanvasElement) {
    const pdf = new jsPDF();
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      0,
      this.logoSize.width / 4,
      this.logoSize.height / 4
    );
    pdf.save('logo.pdf');
  }

  downloadAsPSD(canvas: HTMLCanvasElement) {
    canvas.toBlob(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        this.downloadFile(url, 'logo.psd');
        URL.revokeObjectURL(url);
      }
    }, 'image/vnd.adobe.photoshop');
  }

  private downloadFile(dataUrl: string, filename: string) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }

  drawBackground() {
    const canvas = this.backgroundCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    this.clearCanvas(ctx, canvas);
    this.clipCanvas(ctx, canvas);

    if (this.logoBackgroundImage) {
      ctx.drawImage(
        this.logoBackgroundImage,
        this.backgroundImagePosition.x,
        this.backgroundImagePosition.y,
        this.logoBackgroundImage.width,
        this.logoBackgroundImage.height
      );
    } else {
      ctx.fillStyle = this.logoBackgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    this.emitLogo()
  }

  drawLogo() {
    const canvas = this.logoCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    this.clearCanvas(ctx, canvas);
    this.clipCanvas(ctx, canvas);

    const iconX = (144 / 768) * canvas.width;
    const iconY = (87 / 420) * canvas.height;
    const iconWidth = (this.defaultIconImage.width / 768) * canvas.width;
    const iconHeight = (this.defaultIconImage.height / 420) * canvas.height;

    if (this.iconBackgroundImage) {
      this.drawIconWithImage(
        ctx,
        this.defaultIconImage,
        iconX,
        iconY,
        iconWidth,
        iconHeight,
        this.iconBackgroundImage
      );
    } else {
      this.drawIconWithColor(
        ctx,
        this.defaultIconImage,
        iconX,
        iconY,
        iconWidth,
        iconHeight,
        this.iconColor
      );
    }

    const secondIconX = (292 / 768) * canvas.width;
    const secondIconY = (87 / 420) * canvas.height;
    const secondIconWidth = (71 / 768) * canvas.width;
    const secondIconHeight = (71 / 420) * canvas.height;

    ctx.drawImage(
      this.secondIconImage,
      secondIconX,
      secondIconY,
      secondIconWidth,
      secondIconHeight
    );
    this.drawText();
    this.emitLogo()
  }

  drawIconWithColor(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;

    tempCtx.drawImage(img, 0, 0);

    tempCtx.globalCompositeOperation = 'source-in';
    tempCtx.fillStyle = color;
    tempCtx.fillRect(0, 0, img.width, img.height);

    ctx.drawImage(tempCanvas, x, y, width, height);
    this.emitLogo()
  }

  drawIconWithImage(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    backgroundImage: HTMLImageElement
  ) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;

    tempCtx.drawImage(img, 0, 0);

    tempCtx.globalCompositeOperation = 'source-in';
    tempCtx.drawImage(backgroundImage, 0, 0, img.width, img.height);

    ctx.drawImage(tempCanvas, x, y, width, height);
    this.emitLogo()
  }

  drawText() {
    const canvas = this.logoCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const textAreaX = (400 / 768) * canvas.width;
    const textAreaY = (100 / 420) * canvas.height;
    const textAreaWidth = canvas.width - textAreaX;
    const textAreaHeight = canvas.height - textAreaY;
    ctx.clearRect(textAreaX, textAreaY, textAreaWidth, textAreaHeight);

    const maxWidth = (200 / 768) * canvas.width;
    const lineHeight = (53 / 420) * canvas.height;
    const x = (400 / 768) * canvas.width;
    let y = (180 / 420) * canvas.height;
    const words = this.userText.split(' ');
    let line = '';

    ctx.font = `bold ${(50 / 420) * canvas.height}px e-Ukraine`;
    ctx.fillStyle = this.textColor;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
    this.emitLogo()
  }

  startDrag(event: MouseEvent | TouchEvent) {
    if (this.logoBackgroundImage) {
      this.dragging = true;
      const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
      const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
      this.dragStart.x = clientX - this.backgroundImagePosition.x;
      this.dragStart.y = clientY - this.backgroundImagePosition.y;
      if (event instanceof TouchEvent) event.preventDefault(); // Prevent scrolling
    }
  }

  drag(event: MouseEvent | TouchEvent) {
    if (this.dragging && this.logoBackgroundImage) {
      const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
      const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
      this.backgroundImagePosition.x = clientX - this.dragStart.x;
      this.backgroundImagePosition.y = clientY - this.dragStart.y;
      this.drawBackground();
      if (event instanceof TouchEvent) event.preventDefault(); // Prevent scrolling
    }
  }

  stopDrag(event: MouseEvent | TouchEvent) {
    if (this.logoBackgroundImage) {
      this.dragging = false;
      if (event instanceof TouchEvent) event.preventDefault(); // Prevent scrolling
    }
  }

  private clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  private clipCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    const radius = (24 / 768) * canvas.width;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(canvas.width - radius, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
    ctx.lineTo(canvas.width, canvas.height - radius);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
    ctx.lineTo(radius, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.clip();
  }
}
