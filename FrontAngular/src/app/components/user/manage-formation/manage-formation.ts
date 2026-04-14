import { Component, computed, effect, NgModule, OnDestroy, OnInit, signal } from '@angular/core';
import { FormationDTO } from '../../../models/formationDTO.interface';
import { Formateur } from '../../../models/formateur.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormationService } from '../../../core/services/formation.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-formation',
  imports: [CommonModule, ReactiveFormsModule, FormsModule,],
  templateUrl: './manage-formation.html',
  styleUrl: './manage-formation.css',
})
export class ManageFormation implements OnInit , OnDestroy {
  
  // Angular 21 Signals
  formations = signal<FormationDTO[]>([]);
  domaines = signal<Domaine[]>([]);
  formateurs = signal<Formateur[]>([]);
  
  filterStatus = signal('ALL');
  filterDomain = signal('ALL');
  filterYear = signal("ALL");
  searchText = signal('');
  viewMode = signal<'list' | 'cards' | 'grid'>('cards');
  usingTestData = signal(true);
  loading = signal(false);
  showForm = signal(false);
  submitted = signal(false);
  
  // Computed signals for filtered data
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
               formation.domaineName?.toLowerCase().includes(search) ||
               formation.formateurNom?.toLowerCase().includes(search) ||
               formation.lieu.toLowerCase().includes(search);
      }
      
      return true;
    });
  });
 
  // Computed statistics
  stats = computed(() => {
    const formations = this.formations();
    const filtered = this.filteredFormations();
 
    return {
      total: filtered.length,
      planned: filtered.filter(f => f.statut === 'PLANIFIEE').length,
      inProgress: filtered.filter(f => f.statut === 'EN_COURS').length,
      completed: filtered.filter(f => f.statut === 'COMPLETEE').length,
      cancelled: filtered.filter(f => f.statut === 'ANNULEA').length,
      totalBudget: filtered.reduce((sum, f) => sum + f.budget, 0),
      totalHours: filtered.reduce((sum, f) => sum + f.duree, 0),
      totalParticipants: filtered.reduce((sum, f) => sum + (f.participantCount || 0), 0)
    } as FormationStats;
  });
 
  formationForm!: FormGroup;
  editingId: number | null = null;
  error: string | null = null;
  success: string | null = null;
 
  private destroy$ = new Subject<void>();
 
  statuses = [
    { value: 'PLANIFIEE', label: 'Planned', color: 'bg-blue-100 text-blue-800', icon: '📋', bgColor: 'bg-blue-50' },
    { value: 'EN_COURS', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800', icon: '⏳', bgColor: 'bg-yellow-50' },
    { value: 'COMPLETEE', label: 'Completed', color: 'bg-green-100 text-green-800', icon: '✓', bgColor: 'bg-green-50' },
    { value: 'ANNULEA', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: '✕', bgColor: 'bg-red-50' }
  ];
 
  constructor(
    private formBuilder: FormBuilder,
    private formationService: FormationService
  ) {
    // Effect to handle data updates
    effect(() => {
      this.formationService.loadFormations();
      this.formationService.loadDomaines();
      this.formationService.loadFormateurs();
    });
  }
 
  ngOnInit(): void {
    this.initializeForm();
    this.loadData();
  }
 
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
 
  /**
   * Initialize reactive form with enhanced validation
   */
  private initializeForm(): void {
    this.formationForm = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      annee: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]],
      duree: ['', [Validators.required, Validators.min(1), Validators.max(500)]],
      budget: ['', [Validators.required, Validators.min(0)]],
      lieu: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      statut: ['PLANIFIEE', Validators.required],
      description: ['', [Validators.minLength(10), Validators.maxLength(1000)]],
      domaineId: ['', Validators.required],
      formateurId: ['', Validators.required]
    }, { validators: this.dateRangeValidator });
  }
 
  /**
   * Date range validator
   */
  private dateRangeValidator(group: FormGroup): { [key: string]: any } | null {
    const startDate = group.get('dateDebut');
    const endDate = group.get('dateFin');
 
    if (!startDate?.value || !endDate?.value) return null;
 
    if (new Date(startDate.value) > new Date(endDate.value)) {
      return { dateRange: true };
    }
 
    return null;
  }
 
  /**
   * Load all data with Angular 21 signal approach
   */
  private loadData(): void {
    this.usingTestData.set(this.formationService.isUsingTestData());
 
    this.formationService.formations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(formations => this.formations.set(formations));
 
    this.formationService.domaines$
      .pipe(takeUntil(this.destroy$))
      .subscribe(domaines => this.domaines.set(domaines));
 
    this.formationService.formateurs$
      .pipe(takeUntil(this.destroy$))
      .subscribe(formateurs => this.formateurs.set(formateurs));
 
    this.formationService.loadFormations();
    this.formationService.loadDomaines();
    this.formationService.loadFormateurs();
  }
 
  /**
   * Toggle form visibility
   */
  toggleForm(): void {
    this.showForm.update(val => !val);
    if (!this.showForm()) {
      this.resetForm();
    }
  }
 
  /**
   * Edit formation
   */
  editFormation(formation: FormationDTO): void {
    this.editingId = formation.id;
    this.formationForm.patchValue({
      titre: formation.titre,
      annee: formation.annee,
      duree: formation.duree,
      budget: formation.budget,
      lieu: formation.lieu,
      dateDebut: formation.dateDebut,
      dateFin: formation.dateFin,
      statut: formation.statut,
      description: formation.description,
      domaineId: formation.domaineId,
      formateurId: formation.formateurId
    });
    this.showForm.set(true);
    this.submitted.set(false);
  }
 
  /**
   * Submit form with improved error handling
   */
  submitForm(): void {
    this.submitted.set(true);
    this.error = null;
    this.success = null;
 
    if (this.formationForm.invalid) {
      this.error = 'Please fill all required fields correctly';
      return;
    }
 
    this.loading.set(true);
    const formationData = this.formationForm.value;
 
    const operation$ = this.editingId 
      ? this.formationService.updateFormation(this.editingId, formationData)
      : this.formationService.createFormation(formationData);
 
    operation$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.success = `Formation '${formationData.titre}' ${this.editingId ? 'updated' : 'created'} successfully`;
          this.resetForm();
          setTimeout(() => this.success = null, 5000);
        },
        error: (error) => {
          this.loading.set(false);
          this.error = error.error?.message || 'Operation failed. Please try again.';
        }
      });
  }
 
  /**
   * Delete formation
   */
  deleteFormation(formation: FormationDTO): void {
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
        error: (error) => {
          this.error = error.error?.message || 'Failed to delete formation';
        }
      });
  }
 
  /**
   * Duplicate formation
   */
  duplicateFormation(formation: FormationDTO): void {
    const duplicate = { ...formation };
    delete (duplicate as any).id;
    duplicate.titre = `${duplicate.titre} (Copy)`;
 
    this.formationService.createFormation(duplicate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.success = `Formation duplicated successfully`;
          setTimeout(() => this.success = null, 5000);
        },
        error: () => {
          this.error = 'Failed to duplicate formation';
        }
      });
  }
 
  /**
   * Reset form
   */
   resetForm(): void {
    this.formationForm.reset({
      statut: 'PLANIFIEE',
      annee: new Date().getFullYear()
    });
    this.editingId = null;
    this.submitted.set(false);
    this.showForm.set(false);
  }
 
  /**
   * Reset all filters
   */
  resetFilters(): void {
    this.filterStatus.set('ALL');
    this.filterDomain.set('ALL');
    this.filterYear.set(new Date().getFullYear().toString());
    this.searchText.set('');
  }
 
  /**
   * Get domain name by ID
   */
  getDomainName(domaineId: number): string {
    return this.domaines().find(d => d.id === domaineId)?.libelle || 'Unknown';
  }
 
  /**
   * Get formateur name by ID
   */
  getFormateurName(formateurId: number): string {
    const formateur = this.formateurs().find(f => f.id === formateurId);
    return formateur ? `${formateur.prenom} ${formateur.nom}` : 'Unknown';
  }
 
  /**
   * Get status display with details
   */
  getStatusDisplay(status: string): any {
    const s = this.statuses.find(st => st.value === status);
    return s || { label: status, color: 'bg-gray-100 text-gray-800', icon: '?', bgColor: 'bg-gray-50' };
  }
 
  /**
   * Get progress percentage
   */
  getProgressPercentage(): number {
    const stats = this.stats();
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  }
 
  /**
   * Toggle test data mode
   */
  toggleTestDataMode(): void {
    this.usingTestData.update(val => !val);
    this.formationService.setTestDataMode(this.usingTestData());
    this.loadData();
  }
 
  /**
   * Export to CSV
   */
  exportToCSV(): void {
    const filtered = this.filteredFormations();
    const headers = ['Title', 'Year', 'Duration', 'Budget', 'Status', 'Domain', 'Trainer', 'Participants', 'Location'];
    const rows = filtered.map(f => [
      f.titre,
      f.annee,
      f.duree,
      f.budget,
      this.getStatusDisplay(f.statut).label,
      f.domaineName,
      f.formateurNom,
      f.participantCount || 0,
      f.lieu
    ]);
 
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
 
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `formations-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  }
 
  /**
   * Get form controls helper
   */
  get f() {
    return this.formationForm.controls;
  }
 
  /**
   * Get available years
   */
  getAvailableYears(): number[] {
    const current = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => current - 2 + i);
  }
 
  /**
   * Format currency
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
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
}