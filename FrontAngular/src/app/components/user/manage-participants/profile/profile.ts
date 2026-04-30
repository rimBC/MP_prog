import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { FormationDTO } from '../../../../models/formationDTO.interface';
import { ParticipantDTO, ParticipantService } from '../../../../core/services/participant.service';
import { AuthService } from '../../../../core/services/auth.service';
import { FormationService } from '../../../../core/services/formation.service';

interface ActivityItem {
  type: 'enrolled' | 'completed' | 'started' | 'certificate';
  title: string;
  subtitle: string;
  date: string;
}

type TabKey = 'overview' | 'current' | 'completed' | 'activity';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  private authService = inject(AuthService);
  private formationService = inject(FormationService);
  private participantService = inject(ParticipantService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private readonly currentUserSignal = signal(this.authService.getCurrentUser());

  readonly participants = this.participantService.participants;
  readonly formations = this.formationService.formations;

  private readonly routeIdSignal = toSignal(
    this.route.paramMap.pipe(map(p => {
      const raw = p.get('id');
      const n = raw ? Number(raw) : NaN;
      return Number.isFinite(n) && n > 0 ? n : null;
    })),
    { initialValue: this.parseInitialRouteId() }
  );

  readonly viewingOther = computed(() => this.routeIdSignal() !== null);

  readonly userParticipant = computed<ParticipantDTO | null>(() => {
    const list = this.participants();
    const explicitId = this.routeIdSignal();

    if (explicitId !== null) {
      return list.find(p => p.id === explicitId) ?? null;
    }

    const user = this.currentUserSignal();
    if (!user) return null;
    const userEmail = user.login.toLowerCase();
    const match = list.find(p =>
      (p.email?.toLowerCase().includes(userEmail) ?? false) ||
      `${p.prenom.toLowerCase()} ${p.nom.toLowerCase()}`.includes(userEmail)
    );
    return match ?? (list.length > 0 ? list[0] : null);
  });

  readonly currentUser = this.currentUserSignal.asReadonly();

  readonly userFormations = computed<FormationDTO[]>(() => {
    const p = this.userParticipant();
    if (!p?.id) return [];
    return this.formations().filter(f =>
      Array.isArray(f.participantIds) && f.participantIds.includes(p.id!)
    );
  });

  readonly currentFormations = computed(() =>
    this.userFormations().filter(f => f.statut === 'EN_COURS')
  );

  readonly completedFormations = computed(() =>
    this.userFormations().filter(f => f.statut === 'COMPLETEE')
  );

  readonly hoursLearned = computed(() =>
    this.userFormations().reduce((sum, f) => sum + (f.duree ?? 0), 0)
  );

  readonly progressPercentage = computed(() => {
    const attended = this.userFormations().length;
    if (attended === 0) return 0;
    return Math.round((this.completedFormations().length / attended) * 100);
  });

  readonly recentFormations = computed(() => this.userFormations().slice(0, 5));

  readonly activity = computed<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];
    this.userFormations().slice(0, 6).forEach(f => {
      if (f.statut === 'COMPLETEE') {
        items.push({
          type: 'certificate',
          title: f.titre,
          subtitle: `${f.duree} hours · ${f.formateurNom || 'Trainer assigned'}`,
          date: f.dateFin ?? ''
        });
      } else if (f.statut === 'EN_COURS') {
        items.push({
          type: 'started',
          title: f.titre,
          subtitle: `${f.duree} hours · ${f.formateurNom || 'Trainer assigned'}`,
          date: f.dateDebut ?? ''
        });
      } else {
        items.push({
          type: 'enrolled',
          title: f.titre,
          subtitle: `${f.duree} hours · ${f.formateurNom || 'Trainer assigned'}`,
          date: f.dateDebut ?? ''
        });
      }
    });
    return items.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  readonly loading = computed(() =>
    this.participants().length === 0 && this.formations().length === 0
  );

  activeTab = signal<TabKey>('overview');

  ngOnInit(): void {
    this.participantService.loadParticipants();
    this.formationService.loadFormations();
  }

  private parseInitialRouteId(): number | null {
    const raw = this.route.snapshot.paramMap.get('id');
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  back(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  setTab(tab: TabKey): void {
    this.activeTab.set(tab);
  }

  getInitials(): string {
    const p = this.userParticipant();
    if (p) {
      return `${p.prenom?.charAt(0) || ''}${p.nom?.charAt(0) || ''}`.toUpperCase();
    }
    return this.currentUser()?.login?.charAt(0).toUpperCase() || '?';
  }

  getFullName(): string {
    const p = this.userParticipant();
    if (p) return `${p.prenom} ${p.nom}`;
    return this.currentUser()?.login || 'User';
  }

  getMemberSince(): string {
    const date = this.userParticipant()?.dateEmbauche;
    if (!date) return 'Recently joined';
    const year = new Date(date).getFullYear();
    return `Member since ${year}`;
  }

  getRoleDisplayName(role: string): string {
    const roleMap: { [key: string]: string } = {
      'SIMPLE_UTILISATEUR': 'Simple User',
      'RESPONSABLE': 'Center Manager',
      'ADMINISTRATEUR': 'Administrator'
    };
    return roleMap[role] || role;
  }

  getRoleColor(role: string): string {
    const colorMap: { [key: string]: string } = {
      'SIMPLE_UTILISATEUR': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
      'RESPONSABLE': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
      'ADMINISTRATEUR': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200'
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800';
  }

  getFormationStatusColor(status: string | undefined): string {
    const colorMap: { [key: string]: string } = {
      'PLANIFIEE': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200',
      'EN_COURS': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
      'COMPLETEE': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
      'ANNULEE': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200'
    };
    return (status && colorMap[status]) || 'bg-gray-100 text-gray-700';
  }

  getFormationStatusLabel(status: string | undefined): string {
    if (!status) return '';
    const labels: { [key: string]: string } = {
      'PLANIFIEE': 'Planned',
      'EN_COURS': 'In Progress',
      'COMPLETEE': 'Completed',
      'ANNULEE': 'Cancelled'
    };
    return labels[status] || status;
  }

  formatDate(date: string | undefined): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formationProgress(f: FormationDTO): number {
    if (f.statut === 'COMPLETEE') return 100;
    if (f.statut === 'PLANIFIEE') return 0;
    if (!f.dateDebut || !f.dateFin) return 50;
    const start = new Date(f.dateDebut).getTime();
    const end = new Date(f.dateFin).getTime();
    const now = Date.now();
    if (now <= start) return 0;
    if (now >= end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  }

  activityIconClass(type: ActivityItem['type']): string {
    switch (type) {
      case 'completed': return 'bg-emerald-500';
      case 'certificate': return 'bg-amber-500';
      case 'started': return 'bg-blue-500';
      case 'enrolled':
      default: return 'bg-slate-400';
    }
  }
}
