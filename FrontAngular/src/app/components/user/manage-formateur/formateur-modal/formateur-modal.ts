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
import { Employeur, FormateurDTO } from '../../../../core/services/formateurs.service';

@Component({
  selector: 'app-formateur-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formateur-modal.html',
  styleUrl: './formateur-modal.css',
})
export class FormateurModal implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() employeurs: Employeur[] = [];
  @Input() formateur: FormateurDTO | null = null;
  @Input() loading = false;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ data: Partial<FormateurDTO>; editingId: number | null }>();

  formateurForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.applyFormateurToForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.formateurForm) return;

    if (changes['formateur']) {
      this.applyFormateurToForm();
      this.submitted = false;
    }

    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.applyFormateurToForm();
      this.submitted = false;
    }
  }

  private initializeForm(): void {
    this.formateurForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', [Validators.required, Validators.minLength(10)]],
      type: ['interne', Validators.required],
      specialite: ['', [Validators.required, Validators.minLength(3)]],
      bio: ['', [Validators.minLength(10)]],
      employeurId: [''],
    });
  }

  private applyFormateurToForm(): void {
    if (this.formateur) {
      this.formateurForm.patchValue({
        prenom: this.formateur.prenom,
        nom: this.formateur.nom,
        email: this.formateur.email,
        tel: this.formateur.tel,
        type: this.formateur.type,
        specialite: this.formateur.specialite,
        bio: this.formateur.bio,
        employeurId: this.formateur.employeurId || '',
      });
    } else {
      this.formateurForm.reset({ type: 'interne', employeurId: '' });
    }
  }

  get f() {
    return this.formateurForm.controls;
  }

  get isEditing(): boolean {
    return !!this.formateur;
  }

  get title(): string {
    return this.isEditing ? 'Edit Trainer' : 'Add New Trainer';
  }

  submitForm(): void {
    this.submitted = true;
    if (this.formateurForm.invalid) return;

    this.saved.emit({
      data: this.formateurForm.value,
      editingId: this.formateur?.id ?? null,
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
