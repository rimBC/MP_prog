import { Component, OnInit } from '@angular/core';
import { Employeur, FormateurDTO, FormateurService } from '../../../core/services/formateurs.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-formateur',
  imports: [ReactiveFormsModule,],
  templateUrl: './manage-formateur.html',
  styleUrl: './manage-formateur.css',
})
export class ManageFormateur implements OnInit {
  
  formateurs: FormateurDTO[] = [];
  employeurs: Employeur[] = [];
  
  formateurForm!: FormGroup;
  loading = false;
  submitted = false;
  error: string | null = null;
  success: string | null = null;
  editingId: number | null = null;
  showForm = false;
  
  // Filters
  filterType = 'ALL';
  searchText = '';
  
  // Test data mode
  usingTestData = true;
 
  constructor(
    private formBuilder: FormBuilder,
    private formateurService: FormateurService
  ) { }
 
  ngOnInit(): void {
    this.initializeForm();
    this.loadData();
  }
 
  /**
   * Initialize form
   */
  private initializeForm(): void {
    this.formateurForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', [Validators.required, Validators.minLength(10)]],
      type: ['interne', Validators.required],
      specialite: ['', [Validators.required, Validators.minLength(3)]],
      bio: ['', [Validators.minLength(10)]],
      employeurId: ['']
    });
  }
 
  /**
   * Load all data
   */
  private loadData(): void {
    this.usingTestData = this.formateurService.isUsingTestData();
 
    this.formateurService.formateurs$.subscribe(formateurs => {
      this.formateurs = formateurs;
    });
 
    this.formateurService.employeurs$.subscribe(employeurs => {
      this.employeurs = employeurs;
    });
 
    this.formateurService.loadFormateurs();
    this.formateurService.loadEmployeurs();
  }
 
  /**
   * Get filtered formateurs
   */
  getFilteredFormateurs(): FormateurDTO[] {
    return this.formateurs.filter(formateur => {
      if (this.filterType !== 'ALL' && formateur.type !== this.filterType) {
        return false;
      }
 
      if (this.searchText) {
        const searchLower = this.searchText.toLowerCase();
        return `${formateur.prenom} ${formateur.nom}`.toLowerCase().includes(searchLower) ||
               formateur.email.toLowerCase().includes(searchLower) ||
               formateur.specialite.toLowerCase().includes(searchLower);
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
   * Edit formateur
   */
  editFormateur(formateur: FormateurDTO): void {
    this.editingId = formateur.id;
    this.formateurForm.patchValue({
      nom: formateur.nom,
      prenom: formateur.prenom,
      email: formateur.email,
      tel: formateur.tel,
      type: formateur.type,
      specialite: formateur.specialite,
      bio: formateur.bio,
      employeurId: formateur.employeurId || ''
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
 
    if (this.formateurForm.invalid) {
      return;
    }
 
    this.loading = true;
    const formateurData = this.formateurForm.value;
 
    if (this.editingId) {
      this.formateurService.updateFormateur(this.editingId, formateurData).subscribe({
        next: () => {
          this.loading = false;
          this.success = `Trainer '${formateurData.prenom} ${formateurData.nom}' updated successfully`;
          this.resetForm();
          setTimeout(() => this.success = null, 5000);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Failed to update trainer';
        }
      });
    } else {
      this.formateurService.createFormateur(formateurData).subscribe({
        next: () => {
          this.loading = false;
          this.success = `Trainer '${formateurData.prenom} ${formateurData.nom}' created successfully`;
          this.resetForm();
          setTimeout(() => this.success = null, 5000);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Failed to create trainer';
        }
      });
    }
  }
 
  /**
   * Delete formateur
   */
  deleteFormateur(formateur: FormateurDTO): void {
    if (!confirm(`Are you sure you want to delete '${formateur.prenom} ${formateur.nom}'?`)) {
      return;
    }
 
    this.formateurService.deleteFormateur(formateur.id).subscribe({
      next: () => {
        this.success = `Trainer '${formateur.prenom} ${formateur.nom}' deleted`;
        setTimeout(() => this.success = null, 5000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to delete trainer';
      }
    });
  }
 
  /**
   * Reset form
   */
  resetForm(): void {
    this.formateurForm.reset({ type: 'interne' });
    this.editingId = null;
    this.submitted = false;
    this.showForm = false;
  }
 
  /**
   * Reset filters
   */
  resetFilters(): void {
    this.filterType = 'ALL';
    this.searchText = '';
  }
 
  /**
   * Get employeur name
   */
  getEmployeurName(employeurId?: number): string {
    if (!employeurId) return 'In-House';
    const employeur = this.employeurs.find(e => e.id === employeurId);
    return employeur?.nomemployeur || 'Unknown';
  }
 
  /**
   * Toggle test data mode
   */
  toggleTestDataMode(): void {
    this.usingTestData = !this.usingTestData;
    this.formateurService.setTestDataMode(this.usingTestData);
    this.loadData();
  }
 
  /**
   * Get form controls
   */
  get f() {
    return this.formateurForm.controls;
  }
}
