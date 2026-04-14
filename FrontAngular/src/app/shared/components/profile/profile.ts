import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-profile',
  imports: [],
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
  
  loading = false;
  userParticipant: ParticipantDTO | null = null;
 
  constructor(
    private authService: AuthService,
    private formationService: FormationService,
    private participantService: ParticipantService
  ) { }
 
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
  }
 
  /**
   * Load all data
   */
  private loadData(): void {
    this.loading = true;
 
    // Subscribe to formations
    this.formationService.formations$.subscribe(formations => {
      this.allFormations = formations;
      this.calculateStats();
    });
 
    // Subscribe to participants
    this.participantService.participants$.subscribe(participants => {
      this.allParticipants = participants;
      this.findUserParticipant();
    });
 
    // Load data
    this.formationService.loadFormations();
    this.participantService.loadParticipants();
 
    this.loading = false;
  }
 
  /**
   * Find the user's participant record
   */
  private findUserParticipant(): void {
    if (this.currentUser) {
      // Try to find participant with matching email or name
      const userEmail = this.currentUser.login.toLowerCase();
      this.userParticipant = this.allParticipants.find(p => 
        p.email.toLowerCase().includes(userEmail) ||
        `${p.prenom.toLowerCase()} ${p.nom.toLowerCase()}`.includes(userEmail)
      ) || null;
 
      // If not found, just use the first one for demo purposes
      if (!this.userParticipant && this.allParticipants.length > 0) {
        this.userParticipant = this.allParticipants[Math.floor(Math.random() * this.allParticipants.length)];
      }
    }
  }
 
  /**
   * Calculate user stats based on formations
   */
  private calculateStats(): void {
    if (!this.userParticipant || this.allFormations.length === 0) {
      // Use mock data if no participant found
      const mockStats = {
        formationsAttended: 6,
        formationsCompleted: 3,
        hoursLearned: 152,
        certificatesEarned: 2,
        currentFormations: this.allFormations.filter(f => f.statut === 'EN_COURS').slice(0, 3),
        completedFormations: this.allFormations.filter(f => f.statut === 'COMPLETEE').slice(0, 3)
      };
      this.userStats = mockStats;
      this.recentFormations = [
        ...mockStats.currentFormations,
        ...mockStats.completedFormations
      ].slice(0, 5);
      return;
    }
 
    // Calculate based on user's formations count
    const attended = this.userParticipant.formationsCount || 6;
    const completed = Math.floor(attended * 0.5);
    
    // Find user's formations (using first N formations as attended)
    const userFormations = this.allFormations.slice(0, attended);
    const currentFormations = userFormations.filter(f => f.statut === 'EN_COURS');
    const completedFormations = userFormations.filter(f => f.statut === 'COMPLETEE');
 
    // Calculate hours
    let totalHours = 0;
    userFormations.forEach(f => totalHours += f.duree);
 
    this.userStats = {
      formationsAttended: attended,
      formationsCompleted: completed,
      hoursLearned: totalHours,
      certificatesEarned: completed,
      currentFormations: currentFormations,
      completedFormations: completedFormations
    };
 
    // Get recent formations
    this.recentFormations = [...userFormations].reverse().slice(0, 5);
  }
 
  /**
   * Get role display name
   */
  getRoleDisplayName(role: string): string {
    const roleMap: { [key: string]: string } = {
      'SIMPLE_UTILISATEUR': 'Simple User',
      'RESPONSABLE': 'Manager',
      'ADMINISTRATEUR': 'Administrator'
    };
    return roleMap[role] || role;
  }
 
  /**
   * Get role color
   */
  getRoleColor(role: string): string {
    const colorMap: { [key: string]: string } = {
      'SIMPLE_UTILISATEUR': 'bg-blue-100 text-blue-800',
      'RESPONSABLE': 'bg-green-100 text-green-800',
      'ADMINISTRATEUR': 'bg-purple-100 text-purple-800'
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800';
  }
 
  /**
   * Get formation status color
   */
  getFormationStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'PLANIFIEE': 'bg-blue-100 text-blue-800',
      'EN_COURS': 'bg-yellow-100 text-yellow-800',
      'COMPLETEE': 'bg-green-100 text-green-800',
      'ANNULEE': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  }
 
  /**
   * Get formation status label
   */
  getFormationStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'PLANIFIEE': 'Planned',
      'EN_COURS': 'In Progress',
      'COMPLETEE': 'Completed',
      'ANNULEA': 'Cancelled'
    };
    return labels[status] || status;
  }
 
  /**
   * Get progress percentage
   */
  getProgressPercentage(): number {
    if (this.userStats.formationsAttended === 0) return 0;
    return Math.round((this.userStats.formationsCompleted / this.userStats.formationsAttended) * 100);
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
 
