import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParticipantDTO } from '../../../../../core/services/participant.service';

@Component({
  selector: 'app-add-participant-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-participant-modal.html',
  styleUrl: './add-participant-modal.css',
})
export class AddParticipantModal implements OnChanges {
  @Input() isOpen = false;
  @Input() participants: ParticipantDTO[] = [];
  @Input() loading = false;

  @Output() closed = new EventEmitter<void>();
  @Output() enrolled = new EventEmitter<number>();

  readonly searchText = signal('');
  readonly selectedId = signal<number | null>(null);

  readonly filtered = computed<ParticipantDTO[]>(() => {
    const search = this.searchText().toLowerCase().trim();
    if (!search) return this.participants;
    return this.participants.filter(p =>
      `${p.prenom} ${p.nom}`.toLowerCase().includes(search) ||
      (p.email?.toLowerCase().includes(search) ?? false) ||
      (p.structureLibelle?.toLowerCase().includes(search) ?? false) ||
      (p.profilLibelle?.toLowerCase().includes(search) ?? false)
    );
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.searchText.set('');
      this.selectedId.set(null);
    }
  }

  select(p: ParticipantDTO): void {
    if (p.id !== undefined) this.selectedId.set(p.id);
  }

  confirm(): void {
    const id = this.selectedId();
    if (id !== null) this.enrolled.emit(id);
  }

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).dataset['backdrop'] === 'true') {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) this.close();
  }
}
