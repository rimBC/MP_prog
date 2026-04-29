import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../../models/user.interface';
import { FormationDTO } from '../../../models/formationDTO.interface';
import { ParticipantDTO, ParticipantService } from '../../../core/services/participant.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormationService } from '../../../core/services/formation.service';

interface UserStats {
  formationsAttended: number;
  formationsCompleted: number;
  hoursLearned: number;
  certificatesEarned: number;
  currentFormations: FormationDTO[];
  completedFormations: FormationDTO[];
}

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
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  currentUser: User | null = null;
  userStats: UserStats = {
    formationsAttended: 0,
    formationsCompleted: 0,
    hoursLearned: 0,
    certificatesEarned: 0,
    currentFormations: [],
    completedFormations: []
  };

  recentFormations: FormationDTO[] = [];
  allFormations: FormationDTO[] = [];
  allParticipants: ParticipantDTO[] = [];
  activity: ActivityItem[] = [];

  loading = false;
  userParticipant: ParticipantDTO | null = null;

  activeTab = signal<TabKey>('overview');

  constructor(
    private authService: AuthService,
    private formationService: FormationService,
    private participantService: ParticipantService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
  }

  setTab(tab: TabKey): void {
    this.activeTab.set(tab);
  }

  private loadData(): void {
    this.loading = true;

    this.formationService.getFormations().subscribe(formations => {
      this.allFormations = formations;
      this.calculateStats();
    });

    this.participantService.getParticipants().subscribe(participants => {
      this.allParticipants = participants;
      this.findUserParticipant();
      this.calculateStats();
    });

    this.loading = false;
  }

  private findUserParticipant(): void {
    if (!this.currentUser) return;

    const userEmail = this.currentUser.login.toLowerCase();
    this.userParticipant = this.allParticipants.find(p =>
      (p.email?.toLowerCase().includes(userEmail) ?? false) ||
      `${p.prenom.toLowerCase()} ${p.nom.toLowerCase()}`.includes(userEmail)
    ) || null;

    if (!this.userParticipant && this.allParticipants.length > 0) {
      this.userParticipant = this.allParticipants[0];
    }
  }

  private calculateStats(): void {
    if (this.allFormations.length === 0) {
      this.userStats = {
        formationsAttended: 0,
        formationsCompleted: 0,
        hoursLearned: 0,
        certificatesEarned: 0,
        currentFormations: [],
        completedFormations: []
      };
      this.recentFormations = [];
      this.activity = [];
      return;
    }

    const attended = 6;
    const userFormations = this.allFormations.slice(0, Math.max(attended, 4));
    const currentFormations = userFormations.filter(f => f.statut === 'EN_COURS');
    const completedFormations = userFormations.filter(f => f.statut === 'COMPLETEE');

    let totalHours = 0;
    userFormations.forEach(f => totalHours += (f.duree || 0) * 8);

    this.userStats = {
      formationsAttended: userFormations.length,
      formationsCompleted: completedFormations.length,
      hoursLearned: totalHours,
      certificatesEarned: completedFormations.length,
      currentFormations,
      completedFormations
    };

    this.recentFormations = [...userFormations].slice(0, 5);
    this.buildActivity(userFormations);
  }

  private buildActivity(formations: FormationDTO[]): void {
    const items: ActivityItem[] = [];
    formations.slice(0, 6).forEach(f => {
      if (f.statut === 'COMPLETEE') {
        items.push({
          type: 'certificate',
          title: `Certificate earned — ${f.titre}`,
          subtitle: `${f.domaineLibelle || 'Training'} · ${f.lieu || 'Online'}`,
          date: f.dateFin ?? ''
        });
      } else if (f.statut === 'EN_COURS') {
        items.push({
          type: 'started',
          title: `Started training — ${f.titre}`,
          subtitle: `${f.duree} days · ${f.formateurNom || 'Trainer assigned'}`,
          date: f.dateDebut ?? ''
        });
      } else {
        items.push({
          type: 'enrolled',
          title: `Enrolled in ${f.titre}`,
          subtitle: `${f.domaineLibelle || 'Training'} · starts ${this.formatDate(f.dateDebut)}`,
          date: f.dateDebut ?? ''
        });
      }
    });

    this.activity = items.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  getInitials(): string {
    if (this.userParticipant) {
      return `${this.userParticipant.prenom?.charAt(0) || ''}${this.userParticipant.nom?.charAt(0) || ''}`.toUpperCase();
    }
    return this.currentUser?.login?.charAt(0).toUpperCase() || '?';
  }

  getFullName(): string {
    if (this.userParticipant) {
      return `${this.userParticipant.prenom} ${this.userParticipant.nom}`;
    }
    return this.currentUser?.login || 'User';
  }

  getMemberSince(): string {
    const date = this.userParticipant?.dateEmbauche;
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

  getProgressPercentage(): number {
    if (this.userStats.formationsAttended === 0) return 0;
    return Math.round((this.userStats.formationsCompleted / this.userStats.formationsAttended) * 100);
  }

  formatDate(date: string | undefined): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getFormationStatus(status: string | undefined): string {
    return status ?? '';
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
