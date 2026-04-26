import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ParticipantDTO,
  Profil,
  Structure,
} from '../../../../core/services/participant.service';

@Component({
  selector: 'app-participant-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './participant-modal.html',
  styleUrl: './participant-modal.css',
})
export class ParticipantModal implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() structures: Structure[] = [];
  @Input() profils: Profil[] = [];
  @Input() participant: ParticipantDTO | null = null;
  @Input() loading = false;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ data: Partial<ParticipantDTO>; editingId: number | null }>();

  participantForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.applyParticipantToForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.participantForm) return;

    if (changes['participant']) {
      this.applyParticipantToForm();
      this.submitted = false;
    }

    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.applyParticipantToForm();
      this.submitted = false;
    }
  }

  private initializeForm(): void {
    this.participantForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', [Validators.required, Validators.minLength(10)]],
      dateEmbauche: ['', Validators.required],
      actif: [true, Validators.required],
      structureId: ['', Validators.required],
      profilId: ['', Validators.required],
    });
  }

  private applyParticipantToForm(): void {
    if (this.participant) {
      this.participantForm.patchValue({
        prenom: this.participant.prenom,
        nom: this.participant.nom,
        email: this.participant.email,
        tel: this.participant.tel,
        dateEmbauche: this.participant.dateEmbauche,
        actif: this.participant.actif,
        structureId: this.participant.structureId,
        profilId: this.participant.profilId,
      });
    } else {
      this.participantForm.reset({ actif: true, structureId: '', profilId: '' });
    }
  }

  get f() {
    return this.participantForm.controls;
  }

  get isEditing(): boolean {
    return !!this.participant;
  }

  get title(): string {
    return this.isEditing ? 'Edit Participant' : 'Add New Participant';
  }

  submitForm(): void {
    this.submitted = true;
    if (this.participantForm.invalid) return;

    this.saved.emit({
      data: this.participantForm.value,
      editingId: this.participant?.id ?? null,
    });
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
