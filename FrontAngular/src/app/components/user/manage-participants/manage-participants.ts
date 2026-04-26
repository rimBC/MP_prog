import { Component, OnInit } from '@angular/core';
import { ParticipantDTO, ParticipantService, Profil, Structure } from '../../../core/services/participant.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MyTableLayout } from '../../../shared/components/my-table-layout/my-table-layout';
import { ParticipantModal } from './participant-modal/participant-modal';

@Component({
  selector: 'app-manage-participants',
  imports: [CommonModule, FormsModule, MyTableLayout, ParticipantModal],
  templateUrl: './manage-participants.html',
  styleUrl: './manage-participants.css',
})
export class ManageParticipants implements OnInit {

  participants: ParticipantDTO[] = [];
  structures: Structure[] = [];
  profils: Profil[] = [];

  loading = false;
  error: string | null = null;
  success: string | null = null;

  // Modal state
  modalOpen = false;
  editingParticipant: ParticipantDTO | null = null;

  // Filters
  filterStructure = 'ALL';
  filterProfil = 'ALL';
  filterStatus = 'ALL';
  searchText = '';

  constructor(private participantService: ParticipantService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.participantService.participants$.subscribe(participants => {
      this.participants = participants;
    });

    this.participantService.structures$.subscribe(structures => {
      this.structures = structures;
    });

    this.participantService.profils$.subscribe(profils => {
      this.profils = profils;
    });

    this.participantService.loadParticipants();
    this.participantService.loadStructures();
    this.participantService.loadProfils();
  }

  getFilteredParticipants(): ParticipantDTO[] {
    return this.participants.filter(participant => {
      if (this.filterStructure !== 'ALL' && participant.structureId !== parseInt(this.filterStructure)) {
        return false;
      }
      if (this.filterProfil !== 'ALL' && participant.profilId !== parseInt(this.filterProfil)) {
        return false;
      }
      if (this.filterStatus !== 'ALL') {
        if (this.filterStatus === 'ACTIVE' && !participant.actif) return false;
        if (this.filterStatus === 'INACTIVE' && participant.actif) return false;
      }
      if (this.searchText) {
        const searchLower = this.searchText.toLowerCase();
        return `${participant.prenom} ${participant.nom}`.toLowerCase().includes(searchLower) ||
               (participant.email?.toLowerCase().includes(searchLower) ?? false) ||
               (participant.structureLibelle?.toLowerCase().includes(searchLower) ?? false) ||
               (participant.profilLibelle?.toLowerCase().includes(searchLower) ?? false);
      }
      return true;
    });
  }

  openCreateModal(): void {
    this.editingParticipant = null;
    this.modalOpen = true;
  }

  editParticipant(participant: ParticipantDTO): void {
    this.editingParticipant = participant;
    this.modalOpen = true;
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

  deleteParticipant(participant: ParticipantDTO): void {
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
    this.filterStructure = 'ALL';
    this.filterProfil = 'ALL';
    this.filterStatus = 'ALL';
    this.searchText = '';
  }

  getStructureName(structureId: number): string {
    const structure = this.structures.find(s => s.id === structureId);
    return structure?.libelle || 'Unknown';
  }

  getProfilName(profilId: number): string {
    const profil = this.profils.find(p => p.id === profilId);
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
