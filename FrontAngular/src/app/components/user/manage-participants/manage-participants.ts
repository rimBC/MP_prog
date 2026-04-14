import { Component, OnInit } from '@angular/core';
import { ParticipantDTO, ParticipantService } from '../../../core/services/participant.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-participants',
  imports: [ReactiveFormsModule],
  templateUrl: './manage-participants.html',
  styleUrl: './manage-participants.css',
})
export class ManageParticipants implements OnInit {
  
  participants: ParticipantDTO[] = [];
  structures: Structure[] = [];
  profils: Profil[] = [];
  
  participantForm!: FormGroup;
  loading = false;
  submitted = false;
  error: string | null = null;
  success: string | null = null;
  editingId: number | null = null;
  showForm = false;
  
  // Filters
  filterStructure = 'ALL';
  filterProfil = 'ALL';
  filterStatus = 'ALL';
  searchText = '';
  
  // Test data mode
  usingTestData = true;
 
  constructor(
    private formBuilder: FormBuilder,
    private participantService: ParticipantService
  ) { }
 
  ngOnInit(): void {
    this.initializeForm();
    this.loadData();
  }
 
  /**
   * Initialize form
   */
  private initializeForm(): void {
    this.participantForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', [Validators.required, Validators.minLength(10)]],
      dateEmbauche: ['', Validators.required],
      actif: [true, Validators.required],
      structureId: ['', Validators.required],
      profilId: ['', Validators.required]
    });
  }
 
  /**
   * Load all data
   */
  private loadData(): void {
    this.usingTestData = this.participantService.isUsingTestData();
 
    // Subscribe to participants
    this.participantService.participants$.subscribe(participants => {
      this.participants = participants;
    });
 
    // Subscribe to structures
    this.participantService.structures$.subscribe(structures => {
      this.structures = structures;
    });
 
    // Subscribe to profils
    this.participantService.profils$.subscribe(profils => {
      this.profils = profils;
    });
 
    // Load data
    this.participantService.loadParticipants();
    this.participantService.loadStructures();
    this.participantService.loadProfils();
  }
 
  /**
   * Get filtered participants
   */
  getFilteredParticipants(): ParticipantDTO[] {
    return this.participants.filter(participant => {
      // Filter by structure
      if (this.filterStructure !== 'ALL' && participant.structureId !== parseInt(this.filterStructure)) {
        return false;
      }
 
      // Filter by profil
      if (this.filterProfil !== 'ALL' && participant.profilId !== parseInt(this.filterProfil)) {
        return false;
      }
 
      // Filter by status
      if (this.filterStatus !== 'ALL') {
        if (this.filterStatus === 'ACTIVE' && !participant.actif) {
          return false;
        }
        if (this.filterStatus === 'INACTIVE' && participant.actif) {
          return false;
        }
      }
 
      // Filter by search text
      if (this.searchText) {
        const searchLower = this.searchText.toLowerCase();
        return `${participant.prenom} ${participant.nom}`.toLowerCase().includes(searchLower) ||
               participant.email.toLowerCase().includes(searchLower) ||
               participant.structureName?.toLowerCase().includes(searchLower) ||
               participant.profilName?.toLowerCase().includes(searchLower);
      }
 
      return true;
    });
  }
 
  /**
   * Toggle form visibility
   */
  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }
 
  /**
   * Edit participant
   */
  editParticipant(participant: ParticipantDTO): void {
    this.editingId = participant.id;
    this.participantForm.patchValue({
      nom: participant.nom,
      prenom: participant.prenom,
      email: participant.email,
      tel: participant.tel,
      dateEmbauche: participant.dateEmbauche,
      actif: participant.actif,
      structureId: participant.structureId,
      profilId: participant.profilId
    });
    this.showForm = true;
    this.submitted = false;
  }
 
  /**
   * Submit form
   */
  submitForm(): void {
    this.submitted = true;
    this.error = null;
    this.success = null;
 
    if (this.participantForm.invalid) {
      return;
    }
 
    this.loading = true;
    const participantData = this.participantForm.value;
 
    if (this.editingId) {
      // Update
      this.participantService.updateParticipant(this.editingId, participantData).subscribe({
        next: () => {
          this.loading = false;
          this.success = `Participant '${participantData.prenom} ${participantData.nom}' updated successfully`;
          this.resetForm();
          setTimeout(() => this.success = null, 5000);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Failed to update participant';
        }
      });
    } else {
      // Create
      this.participantService.createParticipant(participantData).subscribe({
        next: () => {
          this.loading = false;
          this.success = `Participant '${participantData.prenom} ${participantData.nom}' created successfully`;
          this.resetForm();
          setTimeout(() => this.success = null, 5000);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Failed to create participant';
        }
      });
    }
  }
 
  /**
   * Delete participant
   */
  deleteParticipant(participant: ParticipantDTO): void {
    if (!confirm(`Are you sure you want to delete '${participant.prenom} ${participant.nom}'?`)) {
      return;
    }
 
    this.participantService.deleteParticipant(participant.id).subscribe({
      next: () => {
        this.success = `Participant '${participant.prenom} ${participant.nom}' deleted`;
        setTimeout(() => this.success = null, 5000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to delete participant';
      }
    });
  }
 
  /**
   * Activate participant
   */
  activateParticipant(participant: ParticipantDTO): void {
    if (!confirm(`Are you sure you want to activate '${participant.prenom} ${participant.nom}'?`)) {
      return;
    }
 
    const updated = { ...participant, actif: true };
    this.participantService.updateParticipant(participant.id, updated).subscribe({
      next: () => {
        this.success = `Participant '${participant.prenom} ${participant.nom}' activated`;
        setTimeout(() => this.success = null, 5000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to activate participant';
      }
    });
  }
 
  /**
   * Deactivate participant
   */
  deactivateParticipant(participant: ParticipantDTO): void {
    if (!confirm(`Are you sure you want to deactivate '${participant.prenom} ${participant.nom}'?`)) {
      return;
    }
 
    const updated = { ...participant, actif: false };
    this.participantService.updateParticipant(participant.id, updated).subscribe({
      next: () => {
        this.success = `Participant '${participant.prenom} ${participant.nom}' deactivated`;
        setTimeout(() => this.success = null, 5000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to deactivate participant';
      }
    });
  }
 
  /**
   * Reset form
   */
  resetForm(): void {
    this.participantForm.reset({ actif: true });
    this.editingId = null;
    this.submitted = false;
    this.showForm = false;
  }
 
  /**
   * Reset filters
   */
  resetFilters(): void {
    this.filterStructure = 'ALL';
    this.filterProfil = 'ALL';
    this.filterStatus = 'ALL';
    this.searchText = '';
  }
 
  /**
   * Get structure name
   */
  getStructureName(structureId: number): string {
    const structure = this.structures.find(s => s.id === structureId);
    return structure?.libelle || 'Unknown';
  }
 
  /**
   * Get profil name
   */
  getProfilName(profilId: number): string {
    const profil = this.profils.find(p => p.id === profilId);
    return profil?.libelle || 'Unknown';
  }
 
  /**
   * Format date
   */
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
 
  /**
   * Toggle test data mode
   */
  toggleTestDataMode(): void {
    this.usingTestData = !this.usingTestData;
    this.participantService.setTestDataMode(this.usingTestData);
    this.loadData();
  }
 
  /**
   * Get form controls
   */
  get f() {
    return this.participantForm.controls;
  }
}
