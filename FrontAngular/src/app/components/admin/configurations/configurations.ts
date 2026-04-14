import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReferenceDataService } from '../../../core/services/refrence-dat.service';
import { RouterModule } from '@angular/router';
import { Testing } from "../../testing/testing";


type SettingsTab = 'domains' | 'structures' | 'profiles';
 
@Component({
  selector: 'app-configurations',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './configurations.html',
  styleUrl: './configurations.css',
})
export class Configurations implements OnInit{
  
  // Active tab
  activeTab: SettingsTab = 'domains';
  
  // Forms
  domaineForm!: FormGroup;
  structureForm!: FormGroup;
  profilForm!: FormGroup;
  
  // Data
  domaines: Domaine[] = [];
  structures: Structure[] = [];
  profils: Profil[] = [];
  
  // State
  loading = false;
  submitted = false;
  error: string | null = null;
  success: string | null = null;
  editingId: number | null = null;
 
  constructor(
    private formBuilder: FormBuilder,
    private referenceDataService: ReferenceDataService
  ) { }
 
  ngOnInit(): void {
    this.initializeForms();
    this.loadAllData();
  }
 
  /**
   * Initialize all forms
   */
  private initializeForms(): void {
    this.domaineForm = this.formBuilder.group({
      libelle: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });
 
    this.structureForm = this.formBuilder.group({
      libelle: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      lieu: ['']
    });
 
    this.profilForm = this.formBuilder.group({
      libelle: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });
  }
 
  /**
   * Load all data
   */
  private loadAllData(): void {
    // Load domaines
    this.referenceDataService.domaines$.subscribe(
      data => this.domaines = data
    );
 
    // Load structures
    this.referenceDataService.structures$.subscribe(
      data => this.structures = data
    );
 
    // Load profils
    this.referenceDataService.profils$.subscribe(
      data => this.profils = data
    );
 
    // Reload from server
    this.referenceDataService.loadDomaines();
    this.referenceDataService.loadStructures();
    this.referenceDataService.loadProfils();
  }
 
  /**
   * Switch to tab
   */
  switchTab(tab: SettingsTab): void {
    this.activeTab = tab;
    this.resetForm();
  }
 
  // ==================== DOMAINE OPERATIONS ====================
 
  /**
   * Submit domaine form
   */
  submitDomaineForm(): void {
    this.submitted = true;
    this.error = null;
    this.success = null;
 
    if (this.domaineForm.invalid) {
      return;
    }
 
    this.loading = true;
    const domaine = this.domaineForm.value;
 
    if (this.editingId) {
      // Update
      this.referenceDataService.updateDomaine(this.editingId, domaine).subscribe({
        next: () => {
          this.loading = false;
          this.success = `Domain '${domaine.libelle}' updated successfully`;
          this.resetForm();
          setTimeout(() => this.success = null, 5000);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Failed to update domain';
        }
      });
    } else {
      // Create
      this.referenceDataService.createDomaine(domaine).subscribe({
        next: () => {
          this.loading = false;
          this.success = `Domain '${domaine.libelle}' created successfully`;
          this.resetForm();
          setTimeout(() => this.success = null, 5000);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Failed to create domain';
        }
      });
    }
  }
 
  /**
   * Edit domaine
   */
  editDomaine(domaine: Domaine): void {
    this.editingId = domaine.id || null;
    this.domaineForm.patchValue(domaine);
    this.submitted = false;
  }
 
  /**
   * Delete domaine
   */
  deleteDomaine(id: number | undefined): void {
    if (!id || !confirm('Are you sure you want to delete this domain?')) {
      return;
    }
 
    this.referenceDataService.deleteDomaine(id).subscribe({
      next: () => {
        this.success = 'Domain deleted successfully';
        setTimeout(() => this.success = null, 5000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to delete domain';
      }
    });
  }
 
  // ==================== STRUCTURE OPERATIONS ====================
 
  /**
   * Submit structure form
   */
  submitStructureForm(): void {
    this.submitted = true;
    this.error = null;
    this.success = null;
 
    if (this.structureForm.invalid) {
      return;
    }
 
    this.loading = true;
    const structure = this.structureForm.value;
 
    if (this.editingId) {
      // Update
      this.referenceDataService.updateStructure(this.editingId, structure).subscribe({
        next: () => {
          this.loading = false;
          this.success = `Structure '${structure.libelle}' updated successfully`;
          this.resetForm();
          setTimeout(() => this.success = null, 5000);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Failed to update structure';
        }
      });
    } else {
      // Create
      this.referenceDataService.createStructure(structure).subscribe({
        next: () => {
          this.loading = false;
          this.success = `Structure '${structure.libelle}' created successfully`;
          this.resetForm();
          setTimeout(() => this.success = null, 5000);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Failed to create structure';
        }
      });
    }
  }
 
  /**
   * Edit structure
   */
  editStructure(structure: Structure): void {
    this.editingId = structure.id || null;
    this.structureForm.patchValue(structure);
    this.submitted = false;
  }
 
  /**
   * Delete structure
   */
  deleteStructure(id: number | undefined): void {
    if (!id || !confirm('Are you sure you want to delete this structure?')) {
      return;
    }
 
    this.referenceDataService.deleteStructure(id).subscribe({
      next: () => {
        this.success = 'Structure deleted successfully';
        setTimeout(() => this.success = null, 5000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to delete structure';
      }
    });
  }
 
  // ==================== PROFIL OPERATIONS ====================
 
  /**
   * Submit profil form
   */
  submitProfilForm(): void {
    this.submitted = true;
    this.error = null;
    this.success = null;
 
    if (this.profilForm.invalid) {
      return;
    }
 
    this.loading = true;
    const profil = this.profilForm.value;
 
    if (this.editingId) {
      // Update
      this.referenceDataService.updateProfil(this.editingId, profil).subscribe({
        next: () => {
          this.loading = false;
          this.success = `Profile '${profil.libelle}' updated successfully`;
          this.resetForm();
          setTimeout(() => this.success = null, 5000);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Failed to update profile';
        }
      });
    } else {
      // Create
      this.referenceDataService.createProfil(profil).subscribe({
        next: () => {
          this.loading = false;
          this.success = `Profile '${profil.libelle}' created successfully`;
          this.resetForm();
          setTimeout(() => this.success = null, 5000);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Failed to create profile';
        }
      });
    }
  }
 
  /**
   * Edit profil
   */
  editProfil(profil: Profil): void {
    this.editingId = profil.id || null;
    this.profilForm.patchValue(profil);
    this.submitted = false;
  }
 
  /**
   * Delete profil
   */
  deleteProfil(id: number | undefined): void {
    if (!id || !confirm('Are you sure you want to delete this profile?')) {
      return;
    }
 
    this.referenceDataService.deleteProfil(id).subscribe({
      next: () => {
        this.success = 'Profile deleted successfully';
        setTimeout(() => this.success = null, 5000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to delete profile';
      }
    });
  }
 
  /**
   * Reset form
   */
  private resetForm(): void {
    this.domaineForm.reset();
    this.structureForm.reset();
    this.profilForm.reset();
    this.editingId = null;
    this.submitted = false;
  }
 
  /**
   * Cancel editing
   */
  cancelEdit(): void {
    this.resetForm();
  }
 
  /**
   * Get form controls
   */
  get df() { return this.domaineForm.controls; }
  get sf() { return this.structureForm.controls; }
  get pf() { return this.profilForm.controls; }
}