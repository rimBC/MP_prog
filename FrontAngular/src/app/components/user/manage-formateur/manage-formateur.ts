import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Employeur, FormateurDTO, FormateurService } from '../../../core/services/formateurs.service';
import { FormateurCard } from './formateur-card/formateur-card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormateurModal } from './formateur-modal/formateur-modal';

@Component({
  selector: 'app-manage-formateur',
  imports: [FormateurCard, CommonModule, FormsModule, FormateurModal],
  templateUrl: './manage-formateur.html',
  styleUrl: './manage-formateur.css',
})
export class ManageFormateur implements OnInit {

  private formateurService = inject(FormateurService);

  readonly formateurs = this.formateurService.formateurs;
  readonly employeurs = this.formateurService.employeurs;

  loading = false;
  error: string | null = null;
  success: string | null = null;

  // Modal state
  modalOpen = false;
  editingFormateur: FormateurDTO | null = null;

  // Filters
  readonly filterType = signal('ALL');
  readonly searchText = signal('');

  readonly filteredFormateurs = computed<FormateurDTO[]>(() => {
    const type = this.filterType();
    const search = this.searchText().toLowerCase();
    return this.formateurs().filter(formateur => {
      if (type !== 'ALL' && formateur.type !== type) return false;
      if (search) {
        return `${formateur.prenom} ${formateur.nom}`.toLowerCase().includes(search) ||
               (formateur.email?.toLowerCase().includes(search) ?? false) ||
               (formateur.specialite?.toLowerCase().includes(search) ?? false);
      }
      return true;
    });
  });

  // Pagination
  readonly pageSize = signal(9);
  readonly pageIndex = signal(0);

  readonly pagedFormateurs = computed<FormateurDTO[]>(() => {
    const list = this.filteredFormateurs();
    const size = this.pageSize();
    const start = this.pageIndex() * size;
    return list.slice(start, start + size);
  });

  readonly totalPages = computed<number>(() =>
    Math.max(1, Math.ceil(this.filteredFormateurs().length / this.pageSize()))
  );

  readonly pageNumbers = computed<number[]>(() => {
    const total = this.totalPages();
    const cur = this.pageIndex();
    const windowSize = 5;
    let start = Math.max(0, cur - 2);
    let end = Math.min(total, start + windowSize);
    start = Math.max(0, end - windowSize);
    const out: number[] = [];
    for (let i = start; i < end; i++) out.push(i);
    return out;
  });

  constructor() {
    // Reset to first page on filter change.
    effect(() => {
      this.filterType(); this.searchText();
      this.pageIndex.set(0);
    });
    // Clamp when list shrinks.
    effect(() => {
      const total = this.filteredFormateurs().length;
      const lastPage = Math.max(0, Math.ceil(total / this.pageSize()) - 1);
      if (this.pageIndex() > lastPage) this.pageIndex.set(lastPage);
    });
  }

  goToPage(p: number): void {
    if (p < 0 || p >= this.totalPages()) return;
    this.pageIndex.set(p);
  }

  ngOnInit(): void {
    this.formateurService.loadFormateurs();
    this.formateurService.loadEmployeurs();
  }

  openCreateModal(): void {
    this.editingFormateur = null;
    this.modalOpen = true;
  }

  editFormateur(formateur: FormateurDTO): void {
    this.editingFormateur = formateur;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.editingFormateur = null;
  }

  handleSave(event: { data: Partial<FormateurDTO>; editingId: number | null }): void {
    this.error = null;
    this.success = null;
    this.loading = true;

    const { data, editingId } = event;

    if (editingId) {
      this.formateurService.updateFormateur(editingId, data as FormateurDTO).subscribe({
        next: () => {
          this.loading = false;
          this.success = `Trainer '${data.prenom} ${data.nom}' updated successfully`;
          this.closeModal();
          setTimeout(() => this.success = null, 5000);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Failed to update trainer';
        }
      });
    } else {
      this.formateurService.createFormateur(data as FormateurDTO).subscribe({
        next: () => {
          this.loading = false;
          this.success = `Trainer '${data.prenom} ${data.nom}' created successfully`;
          this.closeModal();
          setTimeout(() => this.success = null, 5000);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Failed to create trainer';
        }
      });
    }
  }

  deleteFormateur(formateur: FormateurDTO): void {
    if (formateur.id === undefined) return;
    if (!confirm(`Are you sure you want to delete '${formateur.prenom} ${formateur.nom}'?`)) {
      return;
    }

    this.formateurService.deleteFormateur(formateur.id).subscribe({
      next: () => {
        this.success = `Trainer '${formateur.prenom} ${formateur.nom}' deleted`;
        setTimeout(() => this.success = null, 5000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete trainer';
      }
    });
  }

  resetFilters(): void {
    this.filterType.set('ALL');
    this.searchText.set('');
  }

  getEmployeurName(employeurId?: number): string {
    if (!employeurId) return 'In-House';
    const employeur = this.employeurs().find(e => e.id === employeurId);
    return employeur?.nomEmployeur || 'Unknown';
  }
}
