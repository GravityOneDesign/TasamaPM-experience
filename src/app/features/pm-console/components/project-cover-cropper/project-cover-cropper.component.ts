import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { PmConsoleIconComponent } from '../../../../shared/components/ui/icon/icon.component';

export interface PmConsoleProjectCoverCropperRequest {
  projectId: string;
  projectName: string;
}

export interface PmConsoleProjectCoverChange {
  projectId: string;
  dataUrl: string;
}

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
}

@Component({
  selector: 'app-pm-console-project-cover-cropper',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: contents;
      }

      .project-cover-file-input {
        display: none;
      }

      .project-cover-crop-backdrop {
        align-items: center;
        background: rgba(11, 11, 11, 0.42);
        display: flex;
        inset: 0;
        justify-content: center;
        padding: 24px;
        position: fixed;
        z-index: 10000;
      }

      .project-cover-crop-dialog {
        background: #ffffff;
        border: 1px solid #e8e8e8;
        border-radius: 12px;
        box-shadow: 0 24px 64px rgba(1, 10, 15, 0.22);
        color: #2f2f2f;
        display: grid;
        gap: 16px;
        max-height: calc(100vh - 48px);
        max-width: min(640px, calc(100vw - 32px));
        overflow: auto;
        padding: 18px;
        width: 100%;
      }

      .project-cover-crop-head {
        align-items: flex-start;
        display: flex;
        gap: 16px;
        justify-content: space-between;
      }

      .project-cover-crop-title {
        display: grid;
        gap: 4px;
        min-width: 0;
      }

      .project-cover-crop-title h2 {
        color: #0b0b0b;
        font-size: 18px;
        font-weight: 600;
        line-height: 24px;
        margin: 0;
      }

      .project-cover-crop-title p {
        color: #727272;
        font-size: 12px;
        line-height: 16px;
        margin: 0;
      }

      .project-cover-crop-close {
        align-items: center;
        appearance: none;
        background: #ffffff;
        border: 1px solid #dfe4ee;
        border-radius: 999px;
        color: #2f2f2f;
        cursor: pointer;
        display: inline-flex;
        flex: 0 0 32px;
        height: 32px;
        justify-content: center;
        padding: 0;
        width: 32px;
      }

      .project-cover-crop-close:hover,
      .project-cover-crop-close:focus-visible {
        background: #f7f7ff;
        border-color: #c7d0f6;
        outline: none;
      }

      .project-cover-crop-close .icon {
        height: 16px;
        width: 16px;
      }

      .project-cover-crop-stage {
        aspect-ratio: var(--project-cover-crop-ratio, 3.2);
        background:
          linear-gradient(45deg, rgba(233, 236, 242, 0.9) 25%, transparent 25%),
          linear-gradient(-45deg, rgba(233, 236, 242, 0.9) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, rgba(233, 236, 242, 0.9) 75%),
          linear-gradient(-45deg, transparent 75%, rgba(233, 236, 242, 0.9) 75%);
        background-color: #f7f8fb;
        background-position:
          0 0,
          0 10px,
          10px -10px,
          -10px 0;
        background-size: 20px 20px;
        border: 1px solid #dfe4ee;
        border-radius: 10px;
        cursor: grab;
        min-height: 164px;
        overflow: hidden;
        position: relative;
        touch-action: none;
        user-select: none;
        width: 100%;
      }

      .project-cover-crop-stage.is-dragging {
        cursor: grabbing;
      }

      .project-cover-crop-image {
        display: block;
        height: auto;
        left: 50%;
        max-width: none;
        pointer-events: none;
        position: absolute;
        top: 50%;
        transform-origin: center;
        width: auto;
      }

      .project-cover-crop-frame {
        border: 1px solid rgba(255, 255, 255, 0.86);
        box-shadow:
          inset 0 0 0 999px rgba(1, 10, 15, 0.04),
          0 0 0 1px rgba(11, 11, 11, 0.18);
        inset: 0;
        pointer-events: none;
        position: absolute;
      }

      .project-cover-crop-loading {
        align-items: center;
        color: #727272;
        display: flex;
        font-size: 12px;
        inset: 0;
        justify-content: center;
        line-height: 16px;
        position: absolute;
      }

      .project-cover-crop-control {
        display: grid;
        gap: 8px;
      }

      .project-cover-crop-control span {
        color: #4f4f4f;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
      }

      .project-cover-crop-control input {
        accent-color: #10069f;
        width: 100%;
      }

      .project-cover-crop-error {
        color: #b42318;
        font-size: 12px;
        line-height: 16px;
        margin: 0;
      }

      .project-cover-crop-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      }

      .project-cover-crop-actions button {
        align-items: center;
        appearance: none;
        border-radius: 999px;
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 12px;
        font-weight: 500;
        gap: 8px;
        min-height: 36px;
        padding: 0 14px;
      }

      .project-cover-secondary-action {
        background: #ffffff;
        border: 1px solid #dfe4ee;
        color: #2f2f2f;
      }

      .project-cover-primary-action {
        background: #10069f;
        border: 1px solid #10069f;
        color: #ffffff;
      }

      .project-cover-crop-actions button:hover,
      .project-cover-crop-actions button:focus-visible {
        outline: 3px solid rgba(173, 220, 145, 0.62);
        outline-offset: 2px;
      }

      .project-cover-crop-actions button:disabled {
        cursor: not-allowed;
        opacity: 0.55;
      }

      .project-cover-primary-action .icon {
        height: 16px;
        width: 16px;
      }

      @media (max-width: 640px) {
        .project-cover-crop-backdrop {
          padding: 16px;
        }

        .project-cover-crop-dialog {
          padding: 16px;
        }

        .project-cover-crop-actions {
          justify-content: stretch;
        }

        .project-cover-crop-actions button {
          justify-content: center;
          flex: 1 1 0;
        }
      }
    `,
  ],
  template: `
    <input
      #fileInput
      class="project-cover-file-input"
      type="file"
      accept="image/*"
      (change)="handleFileInputChange($event)"
      aria-hidden="true"
      tabindex="-1"
    />

    @if (isCropperOpen) {
      <div class="project-cover-crop-backdrop" (click)="cancelCrop()">
        <section class="project-cover-crop-dialog" role="dialog" aria-modal="true" aria-labelledby="project-cover-crop-title" (click)="$event.stopPropagation()">
          <header class="project-cover-crop-head">
            <div class="project-cover-crop-title">
              <h2 id="project-cover-crop-title">Crop cover image</h2>
              <p>{{ activeProjectName }}</p>
            </div>
            <button class="project-cover-crop-close" type="button" aria-label="Close cover image cropper" (click)="cancelCrop()">
              <span [pmConsoleIcon]="'x'" aria-hidden="true"></span>
            </button>
          </header>

          <div
            #cropStage
            class="project-cover-crop-stage"
            [class.is-dragging]="isDragging"
            [style.--project-cover-crop-ratio]="cropAspectRatioValue"
            (pointerdown)="beginDrag($event)"
            (pointermove)="moveDrag($event)"
            (pointerup)="endDrag($event)"
            (pointercancel)="endDrag($event)"
          >
            @if (sourceDataUrl) {
              <img
                #cropImage
                class="project-cover-crop-image"
                [src]="sourceDataUrl"
                [style.width.px]="previewWidth"
                [style.height.px]="previewHeight"
                [style.transform]="cropImageTransform"
                alt=""
                aria-hidden="true"
                draggable="false"
              />
              <span class="project-cover-crop-frame" aria-hidden="true"></span>
            } @else {
              <span class="project-cover-crop-loading">Preparing image...</span>
            }
          </div>

          <label class="project-cover-crop-control">
            <span>Zoom</span>
            <input type="range" min="1" max="3" step="0.01" [value]="zoom" (input)="setZoom($event)" />
          </label>

          @if (errorMessage) {
            <p class="project-cover-crop-error" role="alert">{{ errorMessage }}</p>
          }

          <footer class="project-cover-crop-actions">
            <button class="project-cover-secondary-action" type="button" (click)="cancelCrop()">Cancel</button>
            <button class="project-cover-primary-action" type="button" [disabled]="!sourceImage" (click)="commitCrop()">
              <span [pmConsoleIcon]="'upload-cloud'" aria-hidden="true"></span>
              <span>Use image</span>
            </button>
          </footer>
        </section>
      </div>
    }
  `,
})
export class PmConsoleProjectCoverCropperComponent {
  @Input() aspectRatio = 16 / 5;
  @Input() outputWidth = 1280;

  @Output() readonly coverChange = new EventEmitter<PmConsoleProjectCoverChange>();

  @ViewChild('fileInput') private fileInput?: ElementRef<HTMLInputElement>;
  @ViewChild('cropStage') private cropStage?: ElementRef<HTMLElement>;

  activeProjectName = '';
  isCropperOpen = false;
  isDragging = false;
  sourceDataUrl = '';
  sourceImage: HTMLImageElement | null = null;
  zoom = 1;
  offsetX = 0;
  offsetY = 0;
  previewWidth = 0;
  previewHeight = 0;
  errorMessage = '';

  private activeProjectId = '';
  private dragState: DragState | null = null;

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  get cropAspectRatioValue(): string {
    return String(this.safeAspectRatio);
  }

  get cropImageTransform(): string {
    return `translate(-50%, -50%) translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.zoom})`;
  }

  @HostListener('window:resize')
  handleWindowResize(): void {
    if (!this.isCropperOpen) return;
    this.syncPreviewDimensions();
    this.changeDetector.markForCheck();
  }

  open(request: PmConsoleProjectCoverCropperRequest): void {
    this.activeProjectId = request.projectId;
    this.activeProjectName = request.projectName;
    this.errorMessage = '';
    const input = this.fileInput?.nativeElement;
    if (!input) return;
    input.value = '';
    input.click();
  }

  handleFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0] ?? null;
    if (!file) {
      this.activeProjectId = '';
      this.activeProjectName = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.resetCropState();
      this.errorMessage = 'Choose an image file for the project cover.';
      this.changeDetector.markForCheck();
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => this.prepareImage(typeof reader.result === 'string' ? reader.result : ''));
    reader.addEventListener('error', () => {
      this.resetCropState();
      this.errorMessage = 'This image could not be loaded.';
      this.changeDetector.markForCheck();
    });
    reader.readAsDataURL(file);
  }

  beginDrag(event: PointerEvent): void {
    if (!this.sourceImage) return;
    const target = event.currentTarget as HTMLElement;
    target.setPointerCapture(event.pointerId);
    this.isDragging = true;
    this.dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: this.offsetX,
      originY: this.offsetY,
    };
  }

  moveDrag(event: PointerEvent): void {
    if (!this.dragState || event.pointerId !== this.dragState.pointerId) return;
    this.offsetX = this.dragState.originX + event.clientX - this.dragState.startX;
    this.offsetY = this.dragState.originY + event.clientY - this.dragState.startY;
    this.constrainOffset();
  }

  endDrag(event: PointerEvent): void {
    if (!this.dragState || event.pointerId !== this.dragState.pointerId) return;
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
    this.isDragging = false;
    this.dragState = null;
  }

  setZoom(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.zoom = this.clamp(Number(input?.value ?? 1), 1, 3);
    this.constrainOffset();
  }

  cancelCrop(): void {
    this.resetCropState();
    this.activeProjectId = '';
    this.activeProjectName = '';
    this.changeDetector.markForCheck();
  }

  commitCrop(): void {
    const image = this.sourceImage;
    const stage = this.cropStage?.nativeElement;
    if (!image || !stage || !this.activeProjectId) return;

    const stageRect = stage.getBoundingClientRect();
    const stageWidth = stageRect.width;
    const stageHeight = stageRect.height;
    if (!stageWidth || !stageHeight) {
      this.errorMessage = 'The crop area is not ready yet.';
      this.changeDetector.markForCheck();
      return;
    }

    const scale = this.coverScale(stageWidth, stageHeight, image) * this.zoom;
    const displayedWidth = image.naturalWidth * scale;
    const displayedHeight = image.naturalHeight * scale;
    const imageLeft = stageWidth / 2 + this.offsetX - displayedWidth / 2;
    const imageTop = stageHeight / 2 + this.offsetY - displayedHeight / 2;
    const sourceX = this.clamp((0 - imageLeft) / scale, 0, image.naturalWidth);
    const sourceY = this.clamp((0 - imageTop) / scale, 0, image.naturalHeight);
    const sourceWidth = this.clamp(stageWidth / scale, 1, image.naturalWidth - sourceX);
    const sourceHeight = this.clamp(stageHeight / scale, 1, image.naturalHeight - sourceY);

    const outputWidth = Math.max(320, Math.round(this.outputWidth));
    const outputHeight = Math.max(120, Math.round(outputWidth / this.safeAspectRatio));
    const canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      this.errorMessage = 'The cover image could not be prepared.';
      this.changeDetector.markForCheck();
      return;
    }

    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, outputWidth, outputHeight);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    this.coverChange.emit({ projectId: this.activeProjectId, dataUrl });
    this.cancelCrop();
  }

  private prepareImage(dataUrl: string): void {
    if (!dataUrl) {
      this.resetCropState();
      this.errorMessage = 'This image could not be loaded.';
      this.changeDetector.markForCheck();
      return;
    }

    const image = new Image();
    image.addEventListener(
      'load',
      () => {
        this.sourceImage = image;
        this.sourceDataUrl = dataUrl;
        this.zoom = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.errorMessage = '';
        this.isCropperOpen = true;
        this.changeDetector.markForCheck();
        window.requestAnimationFrame(() => {
          this.syncPreviewDimensions();
          this.changeDetector.markForCheck();
        });
      },
      { once: true },
    );
    image.addEventListener(
      'error',
      () => {
        this.resetCropState();
        this.errorMessage = 'This image could not be loaded.';
        this.changeDetector.markForCheck();
      },
      { once: true },
    );
    image.src = dataUrl;
  }

  private resetCropState(): void {
    this.isCropperOpen = false;
    this.isDragging = false;
    this.sourceDataUrl = '';
    this.sourceImage = null;
    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.previewWidth = 0;
    this.previewHeight = 0;
    this.errorMessage = '';
    this.dragState = null;
  }

  private syncPreviewDimensions(): void {
    const image = this.sourceImage;
    const stage = this.cropStage?.nativeElement;
    if (!image || !stage) return;

    const stageRect = stage.getBoundingClientRect();
    if (!stageRect.width || !stageRect.height) return;

    const scale = this.coverScale(stageRect.width, stageRect.height, image);
    this.previewWidth = image.naturalWidth * scale;
    this.previewHeight = image.naturalHeight * scale;
    this.constrainOffset();
  }

  private constrainOffset(): void {
    const image = this.sourceImage;
    const stage = this.cropStage?.nativeElement;
    if (!image || !stage) return;

    const stageRect = stage.getBoundingClientRect();
    const scale = this.coverScale(stageRect.width, stageRect.height, image) * this.zoom;
    const maxX = Math.max(0, (image.naturalWidth * scale - stageRect.width) / 2);
    const maxY = Math.max(0, (image.naturalHeight * scale - stageRect.height) / 2);
    this.offsetX = this.clamp(this.offsetX, -maxX, maxX);
    this.offsetY = this.clamp(this.offsetY, -maxY, maxY);
  }

  private coverScale(stageWidth: number, stageHeight: number, image: HTMLImageElement): number {
    return Math.max(stageWidth / image.naturalWidth, stageHeight / image.naturalHeight);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private get safeAspectRatio(): number {
    return Number.isFinite(this.aspectRatio) && this.aspectRatio > 0 ? this.aspectRatio : 16 / 5;
  }
}


