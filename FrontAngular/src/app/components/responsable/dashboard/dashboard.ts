import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ChartConfiguration } from 'chart.js';

import { FormationService } from '../../../core/services/formation.service';
import { ParticipantService } from '../../../core/services/participant.service';
import { FormateurService } from '../../../core/services/formateurs.service';
import { ReferenceDataService } from '../../../core/services/refrence-dat.service';

import { FormationDTO } from '../../../models/formationDTO.interface';
import { ParticipantDTO } from '../../../models/participant.interface';
import { FormateurDTO } from '../../../models/formateur.interface';
import { DomaineDTO } from '../../../models/domaine.interface';
import { StructureDTO } from '../../../models/structure.interface';

import { KpiCard } from '../kpi-card/kpi-card';
import { ChartCanvas } from '../chart-canvas/chart-canvas';
import { MyTableLayout } from '../../../shared/components/my-table-layout/my-table-layout';

type SortKey = 'titre' | 'domaineLibelle' | 'duree' | 'budget' | 'statut' | 'nombreParticipants';
type SortDir = 'asc' | 'desc';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const STATUS_LABELS: Record<string, string> = {
  PLANIFIEE: 'Planifiée',
  EN_COURS: 'En cours',
  COMPLETEE: 'Complétée',
  ANNULEA: 'Annulée',
  ANNULEE: 'Annulée',
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, KpiCard, ChartCanvas, MyTableLayout],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {

  private formationService = inject(FormationService);
  private participantService = inject(ParticipantService);
  private formateurService = inject(FormateurService);
  private referenceDataService = inject(ReferenceDataService);

  formations = this.formationService.formations;
  participants = this.participantService.participants;
  formateurs = this.formateurService.formateurs;
  domaines = signal<DomaineDTO[]>([]);
  structures = signal<StructureDTO[]>([]);

  filterDomaine = signal<string>('ALL');
  filterStatut = signal<string>('ALL');
  filterAnnee = signal<string>('ALL');
  searchText = signal<string>('');

  sortKey = signal<SortKey>('titre');
  sortDir = signal<SortDir>('asc');
  pageSize = signal<number>(10);
  pageIndex = signal<number>(0);

  private themeTick = signal(0);
  private destroy$ = new Subject<void>();

  filteredFormations = computed<FormationDTO[]>(() => {
    const dom = this.filterDomaine();
    const sta = this.filterStatut();
    const yr = this.filterAnnee();

    return this.formations().filter(f => {
      if (dom !== 'ALL' && String(f.domaineId) !== dom) return false;
      if (sta !== 'ALL' && (f.statut ?? '') !== sta) return false;
      if (yr !== 'ALL' && String(f.annee) !== yr) return false;
      return true;
    });
  });

  searchedFormations = computed<FormationDTO[]>(() => {
    const term = this.searchText().trim().toLowerCase();
    const list = this.filteredFormations();
    if (!term) return list;
    return list.filter(f =>
      (f.titre ?? '').toLowerCase().includes(term) ||
      (f.domaineLibelle ?? '').toLowerCase().includes(term) ||
      (f.formateurNom ?? '').toLowerCase().includes(term) ||
      (f.lieu ?? '').toLowerCase().includes(term) ||
      (f.statut ?? '').toLowerCase().includes(term),
    );
  });

  sortedFormations = computed<FormationDTO[]>(() => {
    const list = [...this.searchedFormations()];
    const key = this.sortKey();
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    return list.sort((a, b) => {
      const av = (a[key] ?? '') as string | number;
      const bv = (b[key] ?? '') as string | number;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  });

  pagedFormations = computed<FormationDTO[]>(() => {
    const list = this.sortedFormations();
    const size = this.pageSize();
    const start = this.pageIndex() * size;
    return list.slice(start, start + size);
  });

  totalPages = computed<number>(() => {
    const total = this.sortedFormations().length;
    return Math.max(1, Math.ceil(total / this.pageSize()));
  });

  pageNumbers = computed<number[]>(() => {
    const total = this.totalPages();
    const cur = this.pageIndex();
    const window = 5;
    let start = Math.max(0, cur - 2);
    let end = Math.min(total, start + window);
    start = Math.max(0, end - window);
    const out: number[] = [];
    for (let i = start; i < end; i++) out.push(i);
    return out;
  });

  availableYears = computed<number[]>(() => {
    const set = new Set<number>();
    this.formations().forEach(f => { if (f.annee) set.add(f.annee); });
    return Array.from(set).sort((a, b) => b - a);
  });

  availableStatuses = computed<string[]>(() => {
    const set = new Set<string>();
    this.formations().forEach(f => { if (f.statut) set.add(f.statut); });
    return Array.from(set);
  });

  // ===== KPIs =====

  totalFormations = computed(() => this.filteredFormations().length);

  participantsActifs = computed(() => {
    const filteredIds = new Set<number>();
    this.filteredFormations().forEach(f => f.participantIds?.forEach(id => filteredIds.add(id)));
    if (this.filterDomaine() === 'ALL' && this.filterStatut() === 'ALL' && this.filterAnnee() === 'ALL') {
      return this.participants().filter(p => p.actif).length;
    }
    return this.participants().filter(p => p.actif && p.id !== undefined && filteredIds.has(p.id)).length;
  });

  budgetTotal = computed(() => this.filteredFormations().reduce((s, f) => s + (f.budget ?? 0), 0));

  dureeMoyenne = computed(() => {
    const list = this.filteredFormations();
    if (!list.length) return 0;
    const sum = list.reduce((s, f) => s + (f.duree ?? 0), 0);
    return Math.round((sum / list.length) * 10) / 10;
  });

  // ===== Charts =====

  statusPieConfig = computed<ChartConfiguration>(() => {
    this.themeTick();
    const counts: Record<string, number> = {};
    this.filteredFormations().forEach(f => {
      const k = f.statut ?? 'INCONNU';
      counts[k] = (counts[k] ?? 0) + 1;
    });
    const labels = Object.keys(counts).map(k => STATUS_LABELS[k] ?? k);
    const data = Object.values(counts);
    return {
      type: 'pie',
      data: {
        labels,
        datasets: [{ data, backgroundColor: this.statColors(data.length), borderWidth: 0 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: this.textColor(), boxWidth: 12, padding: 12 } } },
      },
    };
  });

  domainBarConfig = computed<ChartConfiguration>(() => {
    this.themeTick();
    const counts = new Map<string, number>();
    this.filteredFormations().forEach(f => {
      const k = f.domaineLibelle ?? 'Inconnu';
      counts.set(k, (counts.get(k) ?? 0) + 1);
    });
    const labels = Array.from(counts.keys());
    const data = Array.from(counts.values());
    return {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Formations',
          data,
          backgroundColor: this.statColor(1),
          borderRadius: 6,
          maxBarThickness: 36,
        }],
      },
      options: this.barOptions(),
    };
  });

  structureBarConfig = computed<ChartConfiguration>(() => {
    this.themeTick();
    const filteredIds = new Set<number>();
    this.filteredFormations().forEach(f => f.participantIds?.forEach(id => filteredIds.add(id)));

    const noFilter = this.filterDomaine() === 'ALL'
      && this.filterStatut() === 'ALL'
      && this.filterAnnee() === 'ALL';

    const counts = new Map<string, number>();
    this.participants().forEach(p => {
      if (!noFilter && (p.id === undefined || !filteredIds.has(p.id))) return;
      const k = p.structureLibelle ?? 'Sans structure';
      counts.set(k, (counts.get(k) ?? 0) + 1);
    });

    const labels = Array.from(counts.keys());
    const data = Array.from(counts.values());
    return {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Participants',
          data,
          backgroundColor: this.statColor(2),
          borderRadius: 6,
          maxBarThickness: 36,
        }],
      },
      options: this.barOptions(),
    };
  });

  formateurTypePieConfig = computed<ChartConfiguration>(() => {
    this.themeTick();
    const formateurIds = new Set<number>();
    this.filteredFormations().forEach(f => { if (f.formateurId !== undefined) formateurIds.add(f.formateurId); });

    const noFilter = this.filterDomaine() === 'ALL'
      && this.filterStatut() === 'ALL'
      && this.filterAnnee() === 'ALL';

    let interne = 0, externe = 0;
    this.formateurs().forEach(fr => {
      if (!noFilter && (fr.id === undefined || !formateurIds.has(fr.id))) return;
      const t = (fr.type ?? '').toLowerCase();
      if (t === 'interne') interne++;
      else if (t === 'externe') externe++;
    });

    return {
      type: 'pie',
      data: {
        labels: ['Internes', 'Externes'],
        datasets: [{
          data: [interne, externe],
          backgroundColor: [this.statColor(1), this.statColor(3)],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: this.textColor(), boxWidth: 12, padding: 12 } } },
      },
    };
  });

  monthlyLineConfig = computed<ChartConfiguration>(() => {
    this.themeTick();
    const buckets = new Array(12).fill(0);
    this.filteredFormations().forEach(f => {
      if (!f.dateDebut) return;
      const d = new Date(f.dateDebut);
      if (isNaN(d.getTime())) return;
      buckets[d.getMonth()]++;
    });

    return {
      type: 'line',
      data: {
        labels: MONTHS,
        datasets: [{
          label: 'Formations',
          data: buckets,
          borderColor: this.statColor(1),
          backgroundColor: this.statColor(1) + '33',
          tension: 0.35,
          fill: true,
          pointBackgroundColor: this.statColor(1),
          pointRadius: 3,
        }],
      },
      options: this.barOptions(),
    };
  });

  constructor() {
    effect(() => {
      this.filterDomaine(); this.filterStatut(); this.filterAnnee(); this.searchText();
      this.pageIndex.set(0);
    });
  }

  ngOnInit(): void {
    this.referenceDataService.domaines$
      .pipe(takeUntil(this.destroy$))
      .subscribe(d => this.domaines.set(d));

    this.referenceDataService.structures$
      .pipe(takeUntil(this.destroy$))
      .subscribe(d => this.structures.set(d));

    this.formationService.loadFormations();
    this.participantService.loadParticipants();
    this.formateurService.loadFormateurs();
    this.referenceDataService.loadDomaines();
    this.referenceDataService.loadStructures();

    if (typeof window !== 'undefined' && (window as any).MutationObserver) {
      const obs = new MutationObserver(() => this.themeTick.update(v => v + 1));
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      this.destroy$.subscribe(() => obs.disconnect());
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetFilters(): void {
    this.filterDomaine.set('ALL');
    this.filterStatut.set('ALL');
    this.filterAnnee.set('ALL');
    this.searchText.set('');
  }

  onSearch(term: string | null): void {
    this.searchText.set(term ?? '');
  }

  setSort(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
  }

  goToPage(p: number): void {
    if (p < 0 || p >= this.totalPages()) return;
    this.pageIndex.set(p);
  }

  statusLabel(s?: string): string {
    return s ? (STATUS_LABELS[s] ?? s) : '—';
  }

  statusToneClass(s?: string): string {
    switch (s) {
      case 'PLANIFIEE': return 'bg-stats-1 text-stats-1';
      case 'EN_COURS': return 'bg-stats-3 text-stats-3';
      case 'COMPLETEE': return 'bg-stats-2 text-stats-2';
      case 'ANNULEA':
      case 'ANNULEE': return 'bg-stats-4 text-stats-4';
      default: return 'bg-stats-6 text-stats-6';
    }
  }

  formatCurrency(v: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'TND', maximumFractionDigits: 0 }).format(v ?? 0);
  }

  // --- color helpers (resolve CSS variables so chart respects theme) ---

  private statColor(idx: number): string {
    if (typeof document === 'undefined') return '#0b7cf4';
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue(`--bg-stats-solid-${idx}`).trim();
    return v || '#0b7cf4';
  }

  private statColors(count: number): string[] {
    const out: string[] = [];
    for (let i = 0; i < count; i++) out.push(this.statColor((i % 8) + 1));
    return out;
  }

  private textColor(): string {
    if (typeof document === 'undefined') return '#3c4f75';
    return getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() || '#3c4f75';
  }

  private gridColor(): string {
    if (typeof document === 'undefined') return 'rgba(0,0,0,.06)';
    const isDark = document.documentElement.classList.contains('dark');
    return isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)';
  }

  private barOptions(): ChartConfiguration['options'] {
    const text = this.textColor();
    const grid = this.gridColor();
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: text }, grid: { color: grid } },
        y: { beginAtZero: true, ticks: { color: text, precision: 0 }, grid: { color: grid } },
      },
    };
  }
}
