import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormationDTO } from '../../../../models/formationDTO.interface';

@Component({
  selector: 'app-formation-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formation-card.html',
  styleUrl: './formation-card.css',
})
export class FormationCard {
  @Input({ required: true }) formation!: FormationDTO;
  @Input() formateurName: string = '';

  @Output() deleteClicked = new EventEmitter<FormationDTO>();
  @Output() editClicked = new EventEmitter<FormationDTO>();

  statuses = [
    { value: 'PLANIFIEE', label: 'Planned', badge: 'bg-primary text-primary' },
    { value: 'EN_COURS', label: 'In Progress', badge: 'bg-yellow-200 text-yellow-900' },
    { value: 'COMPLETEE', label: 'Completed', badge: 'bg-emerald-200 text-emerald-900' },
    { value: 'ANNULEA', label: 'Cancelled', badge: 'bg-red-200 text-red-900' },
  ];

  edit(): void {
    this.editClicked.emit(this.formation);
  }

  remove(): void {
    this.deleteClicked.emit(this.formation);
  }

  get statusInfo() {
    return (
      this.statuses.find((s) => s.value === this.formation.statut) || {
        value: this.formation.statut,
        label: this.formation.statut,
        badge: 'bg-base text-primary',
      }
    );
  }

  get initials(): string {
    const parts = (this.formation.titre || '').trim().split(/\s+/);
    const first = parts[0]?.charAt(0) || '';
    const second = parts[1]?.charAt(0) || '';
    return `${first}${second}`.toUpperCase() || '?';
  }

  formatCurrency(value: number | undefined): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value || 0);
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
