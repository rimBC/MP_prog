import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ReferenceDataService } from '../../../core/services/refrence-dat.service';
import { Domaine } from '../../../models/domaine.interface';
import { Structure } from '../../../models/structure.interface';
import { Profil } from '../../../models/profile.interface';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MyTableLayout } from '../../../shared/components/my-table-layout/my-table-layout';
import { ConfigModal, ConfigEntity } from './config-modal/config-modal';

type SettingsTab = 'domains' | 'structures' | 'profiles';

@Component({
  selector: 'app-configurations',
  imports: [CommonModule, RouterModule, MyTableLayout, ConfigModal],
  templateUrl: './configurations.html',
  styleUrl: './configurations.css',
})
export class Configurations implements OnInit {

  activeTab: SettingsTab = 'domains';

  // Data
  domaines: Domaine[] = [];
  structures: Structure[] = [];
  profils: Profil[] = [];

  // State
  loading = false;
  error: string | null = null;
  success: string | null = null;

  // Modal state
  modalOpen = false;
  editingEntity: ConfigEntity | null = null;

  constructor(private referenceDataService: ReferenceDataService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  private loadAllData(): void {
    this.referenceDataService.domaines$.subscribe(data => this.domaines = data);
    this.referenceDataService.structures$.subscribe(data => this.structures = data);
    this.referenceDataService.profils$.subscribe(data => this.profils = data);

    this.referenceDataService.loadDomaines();
    this.referenceDataService.loadStructures();
    this.referenceDataService.loadProfils();
  }

  switchTab(tab: SettingsTab): void {
    this.activeTab = tab;
    this.closeModal();
  }

  // ==================== TAB METADATA ====================

  get tabName(): string {
    switch (this.activeTab) {
      case 'domains': return 'Domain';
      case 'structures': return 'Structure';
      case 'profiles': return 'Profile';
    }
  }

  get tabPlural(): string {
    switch (this.activeTab) {
      case 'domains': return 'Domains';
      case 'structures': return 'Structures';
      case 'profiles': return 'Profiles';
    }
  }

  get currentList(): (Domaine | Structure | Profil)[] {
    switch (this.activeTab) {
      case 'domains': return this.domaines;
      case 'structures': return this.structures;
      case 'profiles': return this.profils;
    }
  }

  get showLieu(): boolean {
    return this.activeTab === 'structures';
  }

  // ==================== MODAL HANDLERS ====================

  openCreateModal(): void {
    this.editingEntity = null;
    this.modalOpen = true;
  }

  editEntity(entity: Domaine | Structure | Profil): void {
    this.editingEntity = { ...entity };
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
    const payload: any = data;
    switch (this.activeTab) {
      case 'domains':
        return editingId
          ? this.referenceDataService.updateDomaine(editingId, payload)
          : this.referenceDataService.createDomaine(payload);
      case 'structures':
        return editingId
          ? this.referenceDataService.updateStructure(editingId, payload)
          : this.referenceDataService.createStructure(payload);
      case 'profiles':
        return editingId
          ? this.referenceDataService.updateProfil(editingId, payload)
          : this.referenceDataService.createProfil(payload);
    }
  }

  deleteEntity(entity: Domaine | Structure | Profil): void {
    if (!entity.id || !confirm(`Are you sure you want to delete '${entity.libelle}'?`)) {
      return;
    }

    const id = entity.id;
    const op$: Observable<any> = (() => {
      switch (this.activeTab) {
        case 'domains': return this.referenceDataService.deleteDomaine(id);
        case 'structures': return this.referenceDataService.deleteStructure(id);
        case 'profiles': return this.referenceDataService.deleteProfil(id);
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
