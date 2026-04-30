import { Component, OnDestroy, OnInit, computed, effect, inject, signal } from '@angular/core';
import { FormationDTO } from '../../../models/formationDTO.interface';
import { DomaineDTO } from '../../../models/domaine.interface';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormationService } from '../../../core/services/formation.service';
import { FormateurService } from '../../../core/services/formateurs.service';
import { ReferenceDataService } from '../../../core/services/refrence-dat.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormationCard } from './formation-card/formation-card';
import { FormationModal } from './formation-modal/formation-modal';
import { MyTableLayout } from '../../../shared/components/my-table-layout/my-table-layout';

type SortKey = 'titre' | 'domaineLibelle' | 'duree' | 'budget' | 'statut' | 'nombreParticipants';
type SortDir = 'asc' | 'desc';

const STATUS_LABELS: Record<string, string> = {
  PLANIFIEE: 'Planned',
  EN_COURS: 'In Progress',
  COMPLETEE: 'Completed',
  ANNULEA: 'Cancelled',
  ANNULEE: 'Cancelled',
};

@Component({
  selector: 'app-manage-formation',
  imports: [CommonModule, FormsModule, FormationCard, FormationModal, MyTableLayout],
  templateUrl: './manage-formation.html',
  styleUrl: './manage-formation.css',
})
export class ManageFormation implements OnInit, OnDestroy {

  private formationService = inject(FormationService);
  private formateurService = inject(FormateurService);
  private referenceDataService = inject(ReferenceDataService);
  private router = inject(Router);

  readonly formations = this.formationService.formations;
  readonly formateurs = this.formateurService.formateurs;
  readonly domaines = signal<DomaineDTO[]>([]);

  filterStatus = signal('ALL');
  filterDomain = signal('ALL');
  filterYear = signal('ALL');
  searchText = signal('');
  loading = signal(false);

  sortKey = signal<SortKey>('titre');
  sortDir = signal<SortDir>('asc');
  pageSize = signal<number>(10);
  pageIndex = signal<number>(0);

  // Modal state
  modalOpen = signal(false);
  editingFormation = signal<FormationDTO | null>(null);

  error: string | null = null;
  success: string | null = null;

  filteredFormations = computed(() => {
    const formations = this.formations();
    const status = this.filterStatus();
    const domain = this.filterDomain();
    const year = this.filterYear();
    const search = this.searchText().toLowerCase();

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

  sortedFormations = computed<FormationDTO[]>(() => {
    const list = [...this.filteredFormations()];
    const key = this.sortKey();
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    return list.sort((a, b) => {
      const av = (a[key] ?? '') as string | number;
      const bv = (b[key] ?? '') as string | number;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  });

  pagedFormations = computed<FormationDTO[]>(() => {
    const list = this.sortedFormations();
    const size = this.pageSize();
    const start = this.pageIndex() * size;
    return list.slice(start, start + size);
  });

  totalPages = computed<number>(() => {
    const total = this.sortedFormations().length;
    return Math.max(1, Math.ceil(total / this.pageSize()));
  });

  pageNumbers = computed<number[]>(() => {
    const total = this.totalPages();
    const cur = this.pageIndex();
    const window = 5;
    let start = Math.max(0, cur - 2);
    let end = Math.min(total, start + window);
    start = Math.max(0, end - window);
    const out: number[] = [];
    for (let i = start; i < end; i++) out.push(i);
    return out;
  });

  private destroy$ = new Subject<void>();

  statuses = [
    { value: 'PLANIFIEE', label: 'Planned' },
    { value: 'EN_COURS', label: 'In Progress' },
    { value: 'COMPLETEE', label: 'Completed' },
    { value: 'ANNULEA', label: 'Cancelled' }
  ];

  constructor() {
    effect(() => {
      this.filterStatus(); this.filterDomain(); this.filterYear(); this.searchText();
      this.pageIndex.set(0);
    });
  }

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

  viewFormation(formation: FormationDTO): void {
    if (formation.id === undefined) return;
    this.router.navigate(['/user/trainings', formation.id]);
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

  setSort(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
  }

  goToPage(p: number): void {
    if (p < 0 || p >= this.totalPages()) return;
    this.pageIndex.set(p);
  }

  statusLabel(s?: string): string {
    return s ? (STATUS_LABELS[s] ?? s) : '—';
  }

  statusToneClass(s?: string): string {
    switch (s) {
      case 'PLANIFIEE': return 'bg-stats-1 text-stats-1';
      case 'EN_COURS': return 'bg-stats-3 text-stats-3';
      case 'COMPLETEE': return 'bg-stats-2 text-stats-2';
      case 'ANNULEA':
      case 'ANNULEE': return 'bg-stats-4 text-stats-4';
      default: return 'bg-stats-6 text-stats-6';
    }
  }

  formatCurrency(v: number | undefined): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'TND', maximumFractionDigits: 0 }).format(v ?? 0);
  }

  rowClick(formation: FormationDTO, event: Event): void {
    if ((event.target as HTMLElement).closest('button')) return;
    this.viewFormation(formation);
  }
}
