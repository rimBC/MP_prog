import { Component, OnInit } from '@angular/core';
import { UserService, UtilisateurDTO,Role } from '../../../core/services/user.service';

@Component({
  selector: 'app-manage-users',
  imports: [],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.css',
})
export class ManageUsers implements OnInit {
  
  utilisateurs: UtilisateurDTO[] = [];
  roles: Role[] = [];
  
  // State
  loading = false;
  error: string | null = null;
  success: string | null = null;
  selectedUser: UtilisateurDTO | null = null;
  showChangeRoleModal = false;
  
  // Filters
  filterRole = 'ALL';
  filterStatus = 'ALL';
  searchText = '';
  
  // Test data mode
  usingTestData = true;
 
  constructor(private userService: UserService) { }
 
  ngOnInit(): void {
    this.loadData();
  }
 
  /**
   * Load all data
   */
  private loadData(): void {
    this.usingTestData = this.userService.isUsingTestData();
    
    // Subscribe to roles
    this.userService.roles$.subscribe(roles => {
      this.roles = roles;
    });
 
    // Subscribe to users
    this.userService.utilisateurs$.subscribe(users => {
      this.utilisateurs = users;
    });
 
    // Load data
    this.userService.loadRoles();
    this.userService.loadUtilisateurs();
  }
 
  /**
   * Get filtered users
   */
  getFilteredUsers(): UtilisateurDTO[] {
    return this.utilisateurs.filter(user => {
      // Filter by role
      if (this.filterRole !== 'ALL' && user.role !== this.filterRole) {
        return false;
      }
 
      // Filter by status
      if (this.filterStatus === 'ACTIVE' && !user.actif) {
        return false;
      }
      if (this.filterStatus === 'INACTIVE' && user.actif) {
        return false;
      }
 
      // Filter by search text
      if (this.searchText) {
        const searchLower = this.searchText.toLowerCase();
        return user.login.toLowerCase().includes(searchLower);
      }
 
      return true;
    });
  }
 
  /**
   * Open change role modal
   */
  openChangeRoleModal(user: UtilisateurDTO): void {
    this.selectedUser = { ...user };
    this.showChangeRoleModal = true;
    this.error = null;
  }
 
  /**
   * Close modal
   */
  closeModal(): void {
    this.showChangeRoleModal = false;
    this.selectedUser = null;
  }
 
  /**
   * Change user role
   */
  changeRole(roleId: number): void {
    if (!this.selectedUser) return;
 
    this.loading = true;
    this.error = null;
    this.success = null;
 
    this.userService.changeUserRole(this.selectedUser.id, roleId).subscribe({
      next: (updated) => {
        this.loading = false;
        const role = this.roles.find(r => r.id === roleId);
        this.success = `User '${this.selectedUser?.login}' role changed to '${role?.nom}'`;
        this.closeModal();
        setTimeout(() => this.success = null, 5000);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Failed to change user role';
      }
    });
  }
 
  /**
   * Activate user
   */
  activateUser(user: UtilisateurDTO): void {
    if (!confirm(`Are you sure you want to activate user '${user.login}'?`)) {
      return;
    }
 
    this.userService.activateUser(user.id).subscribe({
      next: () => {
        this.success = `User '${user.login}' activated`;
        setTimeout(() => this.success = null, 5000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to activate user';
      }
    });
  }
 
  /**
   * Deactivate user
   */
  deactivateUser(user: UtilisateurDTO): void {
    if (!confirm(`Are you sure you want to deactivate user '${user.login}'?`)) {
      return;
    }
 
    this.userService.deactivateUser(user.id).subscribe({
      next: () => {
        this.success = `User '${user.login}' deactivated`;
        setTimeout(() => this.success = null, 5000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to deactivate user';
      }
    });
  }
 
  /**
   * Delete user
   */
  deleteUser(user: UtilisateurDTO): void {
    if (!confirm(`Are you sure you want to delete user '${user.login}'? This action cannot be undone.`)) {
      return;
    }
 
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.success = `User '${user.login}' deleted`;
        setTimeout(() => this.success = null, 5000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to delete user';
      }
    });
  }
 
  /**
   * Get role name display
   */
  getRoleDisplay(role: string): string {
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
   * Reset filters
   */
  resetFilters(): void {
    this.filterRole = 'ALL';
    this.filterStatus = 'ALL';
    this.searchText = '';
  }
 
  /**
   * Toggle test data mode
   */
  toggleTestDataMode(): void {
    this.usingTestData = !this.usingTestData;
    this.userService.setTestDataMode(this.usingTestData);
    this.loadData();
  }
}
