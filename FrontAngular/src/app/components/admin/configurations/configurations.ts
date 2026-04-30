import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ReferenceDataService } from '../../../core/services/refrence-dat.service';
import { Domaine } from '../../../models/domaine.interface';
import { Structure } from '../../../models/structure.interface';
import { Profil } from '../../../models/profile.interface';
import { Employeur } from '../../../models/employeur.interface';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MyTableLayout } from '../../../shared/components/my-table-layout/my-table-layout';
import { ConfigModal, ConfigEntity } from './config-modal/config-modal';

type SettingsTab = 'domains' | 'structures' | 'profiles' | 'employeurs';
type ConfigItem = Domaine | Structure | Profil | Employeur;

@Component({
  selector: 'app-configurations',
  imports: [CommonModule, RouterModule, MyTableLayout, ConfigModal],
  templateUrl: './configurations.html',
  styleUrl: './configurations.css',
})
export class Configurations implements OnInit {

  private referenceDataService = inject(ReferenceDataService);

  readonly activeTab = signal<SettingsTab>('domains');

  readonly domaines = this.referenceDataService.domaines;
  readonly structures = this.referenceDataService.structures;
  readonly profils = this.referenceDataService.profils;
  readonly employeurs = this.referenceDataService.employeurs;

  // State
  loading = false;
  error: string | null = null;
  success: string | null = null;

  // Modal state
  modalOpen = false;
  editingEntity: ConfigEntity | null = null;

  // Pagination
  readonly pageSize = signal(10);
  readonly pageIndex = signal(0);

  readonly currentList = computed<ConfigItem[]>(() => {
    switch (this.activeTab()) {
      case 'domains': return this.domaines();
      case 'structures': return this.structures();
      case 'profiles': return this.profils();
      case 'employeurs': return this.employeurs();
    }
  });

  readonly pagedList = computed<ConfigItem[]>(() => {
    const list = this.currentList();
    const size = this.pageSize();
    const start = this.pageIndex() * size;
    return list.slice(start, start + size);
  });

  constructor() {
    // Reset to first page when switching tab or when the list shrinks past the current page.
    effect(() => {
      this.activeTab();
      this.pageIndex.set(0);
    });
    effect(() => {
      const total = this.currentList().length;
      const size = this.pageSize();
      const lastPage = Math.max(0, Math.ceil(total / size) - 1);
      if (this.pageIndex() > lastPage) this.pageIndex.set(lastPage);
    });
  }

  ngOnInit(): void {
    this.referenceDataService.loadDomaines();
    this.referenceDataService.loadStructures();
    this.referenceDataService.loadProfils();
    this.referenceDataService.loadEmployeurs();
  }

  switchTab(tab: SettingsTab): void {
    this.activeTab.set(tab);
    this.closeModal();
  }

  // ==================== TAB METADATA ====================

  get tabName(): string {
    switch (this.activeTab()) {
      case 'domains': return 'Domain';
      case 'structures': return 'Structure';
      case 'profiles': return 'Profile';
      case 'employeurs': return 'Employer';
    }
  }

  get tabPlural(): string {
    switch (this.activeTab()) {
      case 'domains': return 'Domains';
      case 'structures': return 'Structures';
      case 'profiles': return 'Profiles';
      case 'employeurs': return 'Employers';
    }
  }

  get showLieu(): boolean {
    return this.activeTab() === 'structures';
  }

  get showDescription(): boolean {
    return this.activeTab() !== 'employeurs';
  }

  get isEmployeurTab(): boolean {
    return this.activeTab() === 'employeurs';
  }

  displayName(item: ConfigItem): string {
    return this.isEmployeurTab ? (item as Employeur).nomEmployeur : (item as Domaine).libelle;
  }

  // ==================== MODAL HANDLERS ====================

  openCreateModal(): void {
    this.editingEntity = null;
    this.modalOpen = true;
  }

  editEntity(entity: ConfigItem): void {
    if (this.isEmployeurTab) {
      const e = entity as Employeur;
      this.editingEntity = { id: e.id, libelle: e.nomEmployeur };
    } else {
      this.editingEntity = { ...(entity as Domaine | Structure | Profil) };
    }
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.editingEntity = null;
  }

  handleSave(event: { data: ConfigEntity; editingId: number | null }): void {
    this.error = null;
    this.success = null;
    this.loading = true;

    const { data, editingId } = event;
    const operation$: Observable<any> = this.buildOperation(data, editingId);

    operation$.subscribe({
      next: () => {
        this.loading = false;
        const verb = editingId ? 'updated' : 'created';
        this.success = `${this.tabName} '${data.libelle}' ${verb} successfully`;
        this.closeModal();
        setTimeout(() => this.success = null, 5000);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || `Failed to save ${this.tabName.toLowerCase()}`;
      }
    });
  }

  private buildOperation(data: ConfigEntity, editingId: number | null): Observable<any> {
    switch (this.activeTab()) {
      case 'domains':
        return editingId
          ? this.referenceDataService.updateDomaine(editingId, data as Domaine)
          : this.referenceDataService.createDomaine(data as Domaine);
      case 'structures':
        return editingId
          ? this.referenceDataService.updateStructure(editingId, data as Structure)
          : this.referenceDataService.createStructure(data as Structure);
      case 'profiles':
        return editingId
          ? this.referenceDataService.updateProfil(editingId, data as Profil)
          : this.referenceDataService.createProfil(data as Profil);
      case 'employeurs':
        const employeur: Employeur = { nomEmployeur: data.libelle };
        return editingId
          ? this.referenceDataService.updateEmployeur(editingId, employeur)
          : this.referenceDataService.createEmployeur(employeur);
    }
  }

  deleteEntity(entity: ConfigItem): void {
    const id = entity.id;
    const name = this.displayName(entity);
    if (!id || !confirm(`Are you sure you want to delete '${name}'?`)) {
      return;
    }

    const op$: Observable<any> = (() => {
      switch (this.activeTab()) {
        case 'domains': return this.referenceDataService.deleteDomaine(id);
        case 'structures': return this.referenceDataService.deleteStructure(id);
        case 'profiles': return this.referenceDataService.deleteProfil(id);
        case 'employeurs': return this.referenceDataService.deleteEmployeur(id);
      }
    })();

    op$.subscribe({
      next: () => {
        this.success = `${this.tabName} deleted successfully`;
        setTimeout(() => this.success = null, 5000);
      },
      error: (err: any) => {
        this.error = err.error?.message || `Failed to delete ${this.tabName.toLowerCase()}`;
      }
    });
  }
}
