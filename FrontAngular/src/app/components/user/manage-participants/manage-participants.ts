import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { ParticipantDTO, ParticipantService } from '../../../core/services/participant.service';
import { FormationService } from '../../../core/services/formation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MyTableLayout } from '../../../shared/components/my-table-layout/my-table-layout';
import { ParticipantModal } from './participant-modal/participant-modal';

@Component({
  selector: 'app-manage-participants',
  imports: [CommonModule, FormsModule, MyTableLayout, ParticipantModal],
  templateUrl: './manage-participants.html',
  styleUrl: './manage-participants.css',
})
export class ManageParticipants implements OnInit {

  private participantService = inject(ParticipantService);
  private formationService = inject(FormationService);
  private router = inject(Router);

  readonly participants = this.participantService.participants;
  readonly structures = this.participantService.structures;
  readonly profils = this.participantService.profils;
  readonly formations = this.formationService.formations;

  readonly formationCountByParticipant = computed<Map<number, number>>(() => {
    const map = new Map<number, number>();
    for (const f of this.formations()) {
      if (!Array.isArray(f.participantIds)) continue;
      for (const pid of f.participantIds) {
        map.set(pid, (map.get(pid) ?? 0) + 1);
      }
    }
    return map;
  });

  loading = false;
  error: string | null = null;
  success: string | null = null;

  // Modal state
  modalOpen = false;
  editingParticipant: ParticipantDTO | null = null;

  // Filters
  readonly filterStructure = signal('ALL');
  readonly filterProfil = signal('ALL');
  readonly filterStatus = signal('ALL');
  readonly searchText = signal('');

  readonly filteredParticipants = computed<ParticipantDTO[]>(() => {
    const structure = this.filterStructure();
    const profil = this.filterProfil();
    const status = this.filterStatus();
    const search = this.searchText().toLowerCase();

    return this.participants().filter(participant => {
      if (structure !== 'ALL' && participant.structureId !== parseInt(structure)) return false;
      if (profil !== 'ALL' && participant.profilId !== parseInt(profil)) return false;
      if (status === 'ACTIVE' && !participant.actif) return false;
      if (status === 'INACTIVE' && participant.actif) return false;
      if (search) {
        return `${participant.prenom} ${participant.nom}`.toLowerCase().includes(search) ||
               (participant.email?.toLowerCase().includes(search) ?? false) ||
               (participant.structureLibelle?.toLowerCase().includes(search) ?? false) ||
               (participant.profilLibelle?.toLowerCase().includes(search) ?? false);
      }
      return true;
    });
  });

  // Pagination
  readonly pageSize = signal(10);
  readonly pageIndex = signal(0);

  readonly pagedParticipants = computed<ParticipantDTO[]>(() => {
    const list = this.filteredParticipants();
    const size = this.pageSize();
    const start = this.pageIndex() * size;
    return list.slice(start, start + size);
  });

  readonly totalPages = computed<number>(() =>
    Math.max(1, Math.ceil(this.filteredParticipants().length / this.pageSize()))
  );

  constructor() {
    // Reset to first page when filters change.
    effect(() => {
      this.filterStructure(); this.filterProfil(); this.filterStatus(); this.searchText();
      this.pageIndex.set(0);
    });
    // Clamp page index when the filtered list shrinks.
    effect(() => {
      const total = this.filteredParticipants().length;
      const lastPage = Math.max(0, Math.ceil(total / this.pageSize()) - 1);
      if (this.pageIndex() > lastPage) this.pageIndex.set(lastPage);
    });
  }

  ngOnInit(): void {
    this.participantService.loadParticipants();
    this.participantService.loadStructures();
    this.participantService.loadProfils();
    this.formationService.loadFormations();
  }

  formationCount(participant: ParticipantDTO): number {
    if (participant.id === undefined) return 0;
    return this.formationCountByParticipant().get(participant.id) ?? 0;
  }

  openCreateModal(): void {
    this.editingParticipant = null;
    this.modalOpen = true;
  }

  editParticipant(participant: ParticipantDTO, event?: Event): void {
    if (event) event.stopPropagation();
    this.editingParticipant = participant;
    this.modalOpen = true;
  }

  viewParticipant(participant: ParticipantDTO): void {
    if (participant.id === undefined) return;
    this.router.navigate(['/user/participants', participant.id]);
  }

  closeModal(): void {
    this.modalOpen = false;
    this.editingParticipant = null;
  }

  handleSave(event: { data: Partial<ParticipantDTO>; editingId: number | null }): void {
    this.error = null;
    this.success = null;
    this.loading = true;

    const { data, editingId } = event;

    if (editingId) {
      this.participantService.updateParticipant(editingId, data as ParticipantDTO).subscribe({
        next: () => {
          this.loading = false;
          this.success = `Participant '${data.prenom} ${data.nom}' updated successfully`;
          this.closeModal();
          setTimeout(() => this.success = null, 5000);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Failed to update participant';
        }
      });
    } else {
      this.participantService.createParticipant(data as ParticipantDTO).subscribe({
        next: () => {
          this.loading = false;
          this.success = `Participant '${data.prenom} ${data.nom}' created successfully`;
          this.closeModal();
          setTimeout(() => this.success = null, 5000);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Failed to create participant';
        }
      });
    }
  }

  deleteParticipant(participant: ParticipantDTO, event?: Event): void {
    if (event) event.stopPropagation();
    if (participant.id === undefined) return;
    if (!confirm(`Are you sure you want to delete '${participant.prenom} ${participant.nom}'?`)) return;

    this.participantService.deleteParticipant(participant.id).subscribe({
      next: () => {
        this.success = `Participant '${participant.prenom} ${participant.nom}' deleted`;
        setTimeout(() => this.success = null, 5000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete participant';
      }
    });
  }

  activateParticipant(participant: ParticipantDTO): void {
    if (participant.id === undefined) return;
    if (!confirm(`Are you sure you want to activate '${participant.prenom} ${participant.nom}'?`)) return;
    this.participantService.reactivateParticipant(participant.id).subscribe({
      next: () => {
        this.success = `Participant '${participant.prenom} ${participant.nom}' activated`;
        setTimeout(() => this.success = null, 5000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to activate participant';
      }
    });
  }

  deactivateParticipant(participant: ParticipantDTO): void {
    if (participant.id === undefined) return;
    if (!confirm(`Are you sure you want to deactivate '${participant.prenom} ${participant.nom}'?`)) return;
    this.participantService.deactivateParticipant(participant.id).subscribe({
      next: () => {
        this.success = `Participant '${participant.prenom} ${participant.nom}' deactivated`;
        setTimeout(() => this.success = null, 5000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to deactivate participant';
      }
    });
  }

  resetFilters(): void {
    this.filterStructure.set('ALL');
    this.filterProfil.set('ALL');
    this.filterStatus.set('ALL');
    this.searchText.set('');
  }

  getStructureName(structureId: number): string {
    const structure = this.structures().find(s => s.id === structureId);
    return structure?.libelle || 'Unknown';
  }

  getProfilName(profilId: number): string {
    const profil = this.profils().find(p => p.id === profilId);
    return profil?.libelle || 'Unknown';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

}
