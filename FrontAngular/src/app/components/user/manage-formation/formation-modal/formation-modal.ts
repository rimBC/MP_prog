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
import { FormationDTO } from '../../../../models/formationDTO.interface';
import { Formateur } from '../../../../models/formateur.interface';
import { Domaine } from '../../../../models/domaine.interface';

@Component({
  selector: 'app-formation-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formation-modal.html',
  styleUrl: './formation-modal.css',
})
export class FormationModal implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() domaines: Domaine[] = [];
  @Input() formateurs: Formateur[] = [];
  @Input() formation: FormationDTO | null = null;
  @Input() loading = false;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ data: Partial<FormationDTO>; editingId: number | null }>();

  formationForm!: FormGroup;
  submitted = false;

  statuses = [
    { value: 'PLANIFIEE', label: 'Planned' },
    { value: 'EN_COURS', label: 'In Progress' },
    { value: 'COMPLETEE', label: 'Completed' },
    { value: 'ANNULEA', label: 'Cancelled' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.applyFormationToForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.formationForm) return;

    if (changes['formation']) {
      this.applyFormationToForm();
      this.submitted = false;
    }

    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.applyFormationToForm();
      this.submitted = false;
    }
  }

  private initializeForm(): void {
    this.formationForm = this.fb.group(
      {
        titre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
        annee: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]],
        duree: ['', [Validators.required, Validators.min(1), Validators.max(500)]],
        budget: ['', [Validators.required, Validators.min(0)]],
        lieu: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
        dateDebut: ['', Validators.required],
        dateFin: ['', Validators.required],
        statut: ['PLANIFIEE', Validators.required],
        description: ['', [Validators.minLength(10), Validators.maxLength(1000)]],
        domaineId: ['', Validators.required],
        formateurId: ['', Validators.required],
      },
      { validators: this.dateRangeValidator }
    );
  }

  private dateRangeValidator(group: FormGroup): { [key: string]: any } | null {
    const startDate = group.get('dateDebut');
    const endDate = group.get('dateFin');
    if (!startDate?.value || !endDate?.value) return null;
    if (new Date(startDate.value) > new Date(endDate.value)) {
      return { dateRange: true };
    }
    return null;
  }

  private applyFormationToForm(): void {
    if (this.formation) {
      this.formationForm.patchValue({
        titre: this.formation.titre,
        annee: this.formation.annee,
        duree: this.formation.duree,
        budget: this.formation.budget,
        lieu: this.formation.lieu,
        dateDebut: this.formation.dateDebut,
        dateFin: this.formation.dateFin,
        statut: this.formation.statut,
        description: this.formation.description,
        domaineId: this.formation.domaineId,
        formateurId: this.formation.formateurId,
      });
    } else {
      this.formationForm.reset({
        statut: 'PLANIFIEE',
        annee: new Date().getFullYear(),
      });
    }
  }

  get f() {
    return this.formationForm.controls;
  }

  get isEditing(): boolean {
    return !!this.formation;
  }

  get title(): string {
    return this.isEditing ? 'Edit Formation' : 'Add New Formation';
  }

  getAvailableYears(): number[] {
    const current = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => current - 2 + i);
  }

  submitForm(): void {
    this.submitted = true;
    if (this.formationForm.invalid) return;

    this.saved.emit({
      data: this.formationForm.value,
      editingId: this.formation?.id ?? null,
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
