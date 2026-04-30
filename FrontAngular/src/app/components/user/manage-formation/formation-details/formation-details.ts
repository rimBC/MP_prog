import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { FormationDTO } from '../../../../models/formationDTO.interface';
import { FormationService } from '../../../../core/services/formation.service';
import { FormateurService } from '../../../../core/services/formateurs.service';
import { ParticipantDTO, ParticipantService } from '../../../../core/services/participant.service';
import { MyTableLayout } from '../../../../shared/components/my-table-layout/my-table-layout';
import { AddParticipantModal } from './add-participant-modal/add-participant-modal';


@Component({
  selector: 'app-formation-details',
  standalone: true,
  imports: [CommonModule, MyTableLayout, AddParticipantModal],
  templateUrl: './formation-details.html',
  styleUrl: './formation-details.css',
})
export class FormationDetails implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formationService = inject(FormationService);
  private formateurService = inject(FormateurService);
  private participantService = inject(ParticipantService);

  readonly formation = signal<FormationDTO | null>(null);
  readonly enrolled = signal<ParticipantDTO[]>([]);
  readonly allParticipants = this.participantService.participants;
  readonly formateurs = this.formateurService.formateurs;

  loading = signal(false);
  modalOpen = signal(false);
  error: string | null = null;
  success: string | null = null;

  readonly availableParticipants = computed<ParticipantDTO[]>(() => {
    const enrolledIds = new Set(this.enrolled().map(p => p.id));
    return this.allParticipants().filter(p => p.id !== undefined && !enrolledIds.has(p.id));
  });

  private destroy$ = new Subject<void>();

  statuses = [
    { value: 'PLANIFIEE', label: 'Planned', badge: 'bg-primary text-primary' },
    { value: 'EN_COURS', label: 'In Progress', badge: 'bg-yellow-200 text-yellow-900' },
    { value: 'COMPLETEE', label: 'Completed', badge: 'bg-emerald-200 text-emerald-900' },
    { value: 'ANNULEA', label: 'Cancelled', badge: 'bg-red-200 text-red-900' },
  ];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/user/trainings']);
      return;
    }

    this.formateurService.loadFormateurs();
    this.participantService.loadParticipants();

    this.formationService.getFormationById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: f => this.formation.set(f),
        error: () => this.router.navigate(['/user/trainings']),
      });

    this.loadEnrolled(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadEnrolled(formationId: number): void {
    this.participantService.getParticipantsByFormation(formationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: list => this.enrolled.set(list),
        error: () => this.enrolled.set([]),
      });
  }

  back(): void {
    this.router.navigate(['/user/trainings']);
  }

  openAddModal(): void {
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  handleEnroll(participantId: number): void {
    const f = this.formation();
    if (!f?.id) return;

    this.error = null;
    this.success = null;
    this.loading.set(true);

    this.formationService.enrollParticipant(f.id, participantId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: updated => {
          this.loading.set(false);
          this.formation.set(updated);
          this.loadEnrolled(f.id!);
          this.success = 'Participant enrolled successfully';
          setTimeout(() => (this.success = null), 4000);
          this.closeModal();
        },
        error: err => {
          this.loading.set(false);
          this.error = err.error?.message || 'Failed to enroll participant';
        },
      });
  }

  viewParticipant(p: ParticipantDTO): void {
    if (p.id === undefined) return;
    this.router.navigate(['/user/participants', p.id]);
  }

  removeParticipant(p: ParticipantDTO, event?: Event): void {
    if (event) event.stopPropagation();
    const f = this.formation();
    if (!f?.id || p.id === undefined) return;
    if (!confirm(`Remove '${p.prenom} ${p.nom}' from this formation?`)) return;

    this.formationService.removeParticipant(f.id, p.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.enrolled.update(list => list.filter(x => x.id !== p.id));
          this.success = `Participant '${p.prenom} ${p.nom}' removed`;
          setTimeout(() => (this.success = null), 4000);
        },
        error: err => {
          this.error = err.error?.message || 'Failed to remove participant';
        },
      });
  }

  get statusInfo() {
    const s = this.formation()?.statut;
    return (
      this.statuses.find(x => x.value === s) || {
        value: s,
        label: s,
        badge: 'bg-base text-primary',
      }
    );
  }

  get initials(): string {
    const parts = (this.formation()?.titre || '').trim().split(/\s+/);
    const first = parts[0]?.charAt(0) || '';
    const second = parts[1]?.charAt(0) || '';
    return `${first}${second}`.toUpperCase() || '?';
  }

  formatCurrency(value: number | undefined): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value || 0);
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getFormateurName(id: number | undefined): string {
    if (id === undefined) return 'Unknown';
    const f = this.formateurs().find(x => x.id === id);
    return f ? `${f.prenom} ${f.nom}` : 'Unknown';
  }
}
