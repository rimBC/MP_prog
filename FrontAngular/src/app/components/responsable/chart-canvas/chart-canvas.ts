import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart-canvas',
  standalone: true,
  template: `
    <div class="relative w-full" [class]="heightClass">
      <canvas #canvas></canvas>
    </div>
  `,
})
export class ChartCanvas implements AfterViewInit, OnChanges, OnDestroy {
  @Input() config!: ChartConfiguration;
  @Input() heightClass = 'h-56 sm:h-64 lg:h-72';

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.canvasRef) {
      this.render();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.chart = null;
  }

  private render(): void {
    if (!this.config) return;
    this.chart?.destroy();
    this.chart = new Chart(this.canvasRef.nativeElement, this.config);
  }
}
