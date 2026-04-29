import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormationDTO } from '../../../models/formationDTO.interface';
import { DomaineDTO } from '../../../models/domaine.interface';
import { FormsModule } from '@angular/forms';
import { FormationService } from '../../../core/services/formation.service';
import { FormateurService } from '../../../core/services/formateurs.service';
import { ReferenceDataService } from '../../../core/services/refrence-dat.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormationCard } from './formation-card/formation-card';
import { FormationModal } from './formation-modal/formation-modal';

@Component({
  selector: 'app-manage-formation',
  imports: [CommonModule, FormsModule, FormationCard, FormationModal],
  templateUrl: './manage-formation.html',
  styleUrl: './manage-formation.css',
})
export class ManageFormation implements OnInit, OnDestroy {

  private formationService = inject(FormationService);
  private formateurService = inject(FormateurService);
  private referenceDataService = inject(ReferenceDataService);

  readonly formations = this.formationService.formations;
  readonly formateurs = this.formateurService.formateurs;
  readonly domaines = signal<DomaineDTO[]>([]);

  filterStatus = signal('ALL');
  filterDomain = signal('ALL');
  filterYear = signal('ALL');
  searchText = signal('');
  loading = signal(false);

  // Modal state
  modalOpen = signal(false);
  editingFormation = signal<FormationDTO | null>(null);

  error: string | null = null;
  success: string | null = null;

  filteredFormations = computed(() => {
    console.log('this is accessed')
    const formations = this.formations();
    const status = this.filterStatus();
    const domain = this.filterDomain();
    const year = this.filterYear();
    const search = this.searchText().toLowerCase();
    console.log(formations)

    return formations.filter(formation => {
      if (status !== 'ALL' && formation.statut !== status) return false;
      if (domain !== 'ALL' && formation.domaineId !== parseInt(domain)) return false;
      if (year !== 'ALL' && formation.annee.toString() !== year) return false;

      if (search) {
        return formation.titre.toLowerCase().includes(search) ||
               (formation.domaineLibelle?.toLowerCase().includes(search) ?? false) ||
               (formation.formateurNom?.toLowerCase().includes(search) ?? false) ||
               (formation.lieu?.toLowerCase().includes(search) ?? false);
      }
      return true;
    });
  });

  private destroy$ = new Subject<void>();

  statuses = [
    { value: 'PLANIFIEE', label: 'Planned' },
    { value: 'EN_COURS', label: 'In Progress' },
    { value: 'COMPLETEE', label: 'Completed' },
    { value: 'ANNULEA', label: 'Cancelled' }
  ];

  ngOnInit(): void {
    this.referenceDataService.domaines$
      .pipe(takeUntil(this.destroy$))
      .subscribe(domaines => this.domaines.set(domaines));

    this.formationService.loadFormations();
    this.referenceDataService.loadDomaines();
    this.formateurService.loadFormateurs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openCreateModal(): void {
    this.editingFormation.set(null);
    this.modalOpen.set(true);
  }

  editFormation(formation: FormationDTO): void {
    this.editingFormation.set(formation);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.editingFormation.set(null);
  }

  handleSave(event: { data: Partial<FormationDTO>; editingId: number | null }): void {
    this.error = null;
    this.success = null;
    this.loading.set(true);

    const { data, editingId } = event;

    const operation$ = editingId
      ? this.formationService.updateFormation(editingId, data as FormationDTO)
      : this.formationService.createFormation(data as FormationDTO);

    operation$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.success = `Formation '${data.titre}' ${editingId ? 'updated' : 'created'} successfully`;
          this.closeModal();
          setTimeout(() => this.success = null, 5000);
        },
        error: (err) => {
          this.loading.set(false);
          this.error = err.error?.message || 'Operation failed. Please try again.';
        }
      });
  }

  deleteFormation(formation: FormationDTO): void {
    if (formation.id === undefined) return;
    if (!confirm(`Are you sure you want to delete '${formation.titre}'?`)) {
      return;
    }

    this.formationService.deleteFormation(formation.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.success = `Formation deleted successfully`;
          setTimeout(() => this.success = null, 5000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to delete formation';
        }
      });
  }

  resetFilters(): void {
    this.filterStatus.set('ALL');
    this.filterDomain.set('ALL');
    this.filterYear.set('ALL');
    this.searchText.set('');
  }

  getFormateurName(formateurId: number | undefined): string {
    if (formateurId === undefined) return 'Unknown';
    const formateur = this.formateurs().find(f => f.id === formateurId);
    return formateur ? `${formateur.prenom} ${formateur.nom}` : 'Unknown';
  }

  getAvailableYears(): number[] {
    const current = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => current - 2 + i);
  }
}
