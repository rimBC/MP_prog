import { Component, OnInit, computed, inject, signal } from '@angular/core';
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
    alert("adding formateur")
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
