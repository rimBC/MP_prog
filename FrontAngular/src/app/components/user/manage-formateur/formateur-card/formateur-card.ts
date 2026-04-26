import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormateurDTO } from '../../../../core/services/formateurs.service';

@Component({
  selector: 'app-formateur-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formateur-card.html',
  styleUrl: './formateur-card.css',
})
export class FormateurCard {
@Output() deleteClicked= new EventEmitter<any>;
@Output() EditClicked= new EventEmitter<any>;
deleteFormateur(arg0: any) {
      this.deleteClicked.emit(this.formateur); // send input

}
editFormateur(arg0: any) {
      this.EditClicked.emit(this.formateur); // send input
}
  @Input({ required: true }) formateur!: any;

  get initials(): string {
    const p = this.formateur.prenom?.charAt(0) || '';
    const n = this.formateur.nom?.charAt(0) || '';
    return `${p}${n}`.toUpperCase() || '?';
  }

  get fullName(): string {
    return `${this.formateur.prenom} ${this.formateur.nom}`.trim();
  }

  get isInternal(): boolean {
    return this.formateur.type?.toLowerCase() === 'interne';
  }

  get typeLabel(): string {
    return this.isInternal ? 'Internal' : 'External';
  }

  get typeBadgeClass(): string {
    return this.isInternal
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200';
  }
}
