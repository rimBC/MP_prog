import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, Role } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { UtilisateurDTO } from '../../../models/user.interface';
import { ThemeService } from '../../../core/services/theme.service';
import { MyTableLayout } from '../../../shared/components/my-table-layout/my-table-layout';
import { UserModal, UserFormPayload } from './user-modal/user-modal';

@Component({
  selector: 'app-manage-users',
  imports: [CommonModule, FormsModule, MyTableLayout, UserModal],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.css',
})
export class ManageUsers implements OnInit {

  utilisateurs: UtilisateurDTO[] = [];
  roles: Role[] = [];

  loading = false;
  error: string | null = null;
  success: string | null = null;

  // Modal state
  modalOpen = false;
  editingUser: UtilisateurDTO | null = null;

  // Filters
  filterRole = 'ALL';
  filterStatus = 'ALL';
  searchText = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private themeService: ThemeService,
  ) {}

  get isDark(): boolean {
    return this.themeService.isDark();
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.userService.roles$.subscribe(roles => this.roles = roles);
    this.userService.utilisateurs$.subscribe(users => this.utilisateurs = users);

    this.userService.loadRoles();
    this.userService.loadUtilisateurs();
  }

  getFilteredUsers(): UtilisateurDTO[] {
    return this.utilisateurs.filter(user => {
      if (this.filterRole !== 'ALL' && user.roleName !== this.filterRole) return false;
      if (this.filterStatus === 'ACTIVE' && !user.actif) return false;
      if (this.filterStatus === 'INACTIVE' && user.actif) return false;

      if (this.searchText) {
        return user.login.toLowerCase().includes(this.searchText.toLowerCase());
      }
      return true;
    });
  }

  openCreateModal(): void {
    this.editingUser = null;
    this.modalOpen = true;
  }

  editUser(user: UtilisateurDTO): void {
    this.editingUser = { ...user };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.editingUser = null;
  }

  handleSave(event: { data: UserFormPayload; editingId: number | null }): void {
    this.error = null;
    this.success = null;
    this.loading = true;

    const { data, editingId } = event;

    if (editingId) {
      this.applyEdits(editingId, data);
    } else {
      this.authService.signUp({
        login: data.login,
        password: data.password ?? '',
        passwordConfirm: data.passwordConfirm ?? '',
        roleId: data.roleId,
      }).subscribe({
        next: () => {
          this.loading = false;
          this.success = `User '${data.login}' created successfully`;
          this.closeModal();
          this.userService.loadUtilisateurs();
          setTimeout(() => this.success = null, 5000);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Failed to create user';
        },
      });
    }
  }

  private applyEdits(userId: number, data: UserFormPayload): void {
    const original = this.utilisateurs.find(u => u.id === userId);
    if (!original) {
      this.loading = false;
      return;
    }

    const tasks: { run: () => void; label: string }[] = [];

    if (data.role !== original.roleName) {
      const role = this.roles.find(r => r.nom === data.role);
      if (role) {
        tasks.push({
          label: 'role',
          run: () => this.userService.changeUserRole(userId, role.id).subscribe({
            next: () => this.advance(tasks, data),
            error: (err) => this.failEdit(err, 'change role'),
          }),
        });
      }
    }

    if (data.actif !== original.actif) {
      tasks.push({
        label: 'status',
        run: () => {
          const op$ = data.actif
            ? this.userService.activateUser(userId)
            : this.userService.deactivateUser(userId);
          op$.subscribe({
            next: () => this.advance(tasks, data),
            error: (err) => this.failEdit(err, 'change status'),
          });
        },
      });
    }

    if (tasks.length === 0) {
      this.loading = false;
      this.success = 'No changes to save';
      this.closeModal();
      setTimeout(() => this.success = null, 3000);
      return;
    }

    tasks[0].run();
  }

  private advance(tasks: { run: () => void; label: string }[], data: UserFormPayload): void {
    tasks.shift();
    if (tasks.length > 0) {
      tasks[0].run();
      return;
    }
    this.loading = false;
    this.success = `User '${data.login}' updated successfully`;
    this.closeModal();
    setTimeout(() => this.success = null, 5000);
  }

  private failEdit(err: any, action: string): void {
    this.loading = false;
    this.error = err.error?.message || `Failed to ${action}`;
  }

  deleteUser(user: UtilisateurDTO): void {
    if (!confirm(`Are you sure you want to delete user '${user.login}'? This action cannot be undone.`)) {
      return;
    }

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.success = `User '${user.login}' deleted`;
        setTimeout(() => this.success = null, 5000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete user';
      },
    });
  }

  getRoleDisplay(role: string | undefined): string {
    if (!role) return '';
    const roleMap: { [key: string]: string } = {
      SIMPLE_UTILISATEUR: 'Simple User',
      RESPONSABLE: 'Manager',
      ADMINISTRATEUR: 'Administrator',
    };
    return roleMap[role] || role;
  }

  getRoleBadgeClass(role: string | undefined): string {
    if (!role) return 'bg-base text-primary';
    const lightMap: { [key: string]: string } = {
      SIMPLE_UTILISATEUR: 'bg-blue-100 text-slate-700',
      RESPONSABLE: 'bg-rose-100 text-rose-900',
      ADMINISTRATEUR: 'bg-violet-100 text-violet-700',
    };
    const darkMap: { [key: string]: string } = {
      SIMPLE_UTILISATEUR: 'bg-sky-900/40 text-sky-200',
      RESPONSABLE: 'bg-red-900/40 text-red-200',
      ADMINISTRATEUR: 'bg-violet-900/40 text-violet-200',
    };
    const map = this.isDark ? darkMap : lightMap;
    return map[role] || 'bg-base text-primary';
  }

  resetFilters(): void {
    this.filterRole = 'ALL';
    this.filterStatus = 'ALL';
    this.searchText = '';
  }
}
