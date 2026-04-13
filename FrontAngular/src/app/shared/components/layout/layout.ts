import { Component, HostListener, OnInit } from '@angular/core';
import { User } from '../../../models/user.interface';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { MENU_ITEMS } from '../../../core/config/menu.config';


@Component({
  selector: 'app-layout',
  imports: [RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export default class Layout implements OnInit {

  toggleDark() {
    this.theme.toggleTheme();
  }
  currentUser: User | null = null;
  sidebarOpen = true;
  isDisabled=false;
  menuItems: MenuItem[] = [];
 
  constructor(
    private authService: AuthService,
    public theme: ThemeService
  ) { }
 
  ngOnInit(): void {
    this.checkScreenSize();
    this.theme.initTheme();
    this.currentUser = this.authService.getCurrentUser();
    this.initializeMenuItems();
    
    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.initializeMenuItems();
    });
  }
 
  /**
   * Initialize menu items based on user role
   */
  private initializeMenuItems(): void {
    this.menuItems = MENU_ITEMS 
  }

  /**
   * Get filtered menu items for current user
   */
  getVisibleMenuItems(): MenuItem[] {
    return this.menuItems.filter(item => this.isMenuItemVisible(item));
  }
  isMenuItemVisible(item: MenuItem): boolean {
    if (!this.currentUser) {
      return false;
    }
    return item.roles.includes(this.currentUser.role);
  }
 
  /**
   * Toggle sidebar
   */
  toggleSidebar(): void {
      this.sidebarOpen = !this.sidebarOpen;
  }
 
  /**
   * Logout user
   */
  logout(): void {
    this.authService.logout();
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

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (window.innerWidth < 764) {
      this.sidebarOpen = false;
      this.isDisabled=true;
    } else {
      this.isDisabled=false;
    }
  }
}
 