import { Component, OnInit } from '@angular/core';
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

  formateurs: FormateurDTO[] = [];
  employeurs: Employeur[] = [];

  loading = false;
  error: string | null = null;
  success: string | null = null;

  // Modal state
  modalOpen = false;
  editingFormateur: FormateurDTO | null = null;

  // Filters
  filterType = 'ALL';
  searchText = '';

  constructor(private formateurService: FormateurService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.formateurService.formateurs$.subscribe(formateurs => {
      this.formateurs = formateurs;
    });

    this.formateurService.employeurs$.subscribe(employeurs => {
      this.employeurs = employeurs;
    });

    this.formateurService.loadFormateurs();
    this.formateurService.loadEmployeurs();
  }

  getFilteredFormateurs(): FormateurDTO[] {
    return this.formateurs.filter(formateur => {
      if (this.filterType !== 'ALL' && formateur.type !== this.filterType) {
        return false;
      }

      if (this.searchText) {
        const searchLower = this.searchText.toLowerCase();
        return `${formateur.prenom} ${formateur.nom}`.toLowerCase().includes(searchLower) ||
               (formateur.email?.toLowerCase().includes(searchLower) ?? false) ||
               (formateur.specialite?.toLowerCase().includes(searchLower) ?? false);
      }

      return true;
    });
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
    this.filterType = 'ALL';
    this.searchText = '';
  }

  getEmployeurName(employeurId?: number): string {
    if (!employeurId) return 'In-House';
    const employeur = this.employeurs.find(e => e.id === employeurId);
    return employeur?.nomEmployeur || 'Unknown';
  }
}
