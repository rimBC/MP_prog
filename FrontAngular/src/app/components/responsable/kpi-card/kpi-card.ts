import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type KpiTone = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-card.html',
})
export class KpiCard {
  @Input() label: string = '';
  @Input() value: string | number = 0;
  @Input() tone: KpiTone = 1;
  @Input() hint?: string;
}
