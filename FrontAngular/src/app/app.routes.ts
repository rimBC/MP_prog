import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

// Auth Components
import { Login } from './auth/components/login/login';
import { UserManagement } from './auth/components/user-management/user-management';

// Layout Component (will be created)
import Layout from './shared/components/layout/layout';
import { Testing } from './components/testing/testing';

import { Unauthorized } from './auth/components/unauthorized/unauthorized';
import { Contact } from './shared/components/contact/contact';
import { Configurations } from './components/admin/configurations/configurations';
import { ManageUsers } from './components/admin/manage-users/manage-users';
import { ManageFormation } from './components/user/manage-formation/manage-formation';
import { Profile } from './shared/components/profile/profile';
import { ManageFormateur } from './components/user/manage-formateur/manage-formateur';
import { ManageParticipants } from './components/user/manage-participants/manage-participants';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
  // Auth routes (no guard - public)
  {
    path: 'auth',
    children: [
      
        { path: 'login', component: Login },
      
      
      { path: 'admin-create-user', component: UserManagement, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMINISTRATEUR'] } },
    ]
  },

  // Protected routes with layout
  {
    path: '',
    component: Layout,
    canActivate: [AuthGuard],
    
    children: [
      
      { path: 'contact', component: Contact } ,
      
      // User Dashboard
      {
        path: 'user',
        children: [
          { path: 'dashboard', component: Dashboard },
          { path: 'trainers', component: ManageFormateur }, // Replace with actual component
          { path: 'trainings', component: ManageFormation }, // Replace with actual component
          { path: 'participants', component: ManageParticipants } // Replace with actual component
        ],
        canActivate: [RoleGuard],
        data: { roles: ['SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR'] }
      },

      // Manager Dashboard
      {
        path: 'manager',
        children: [
          { path: 'dashboard', component: Dashboard },
          { path: 'statistics', component: Dashboard },
          { path: 'reports', component: Testing }, // Replace with actual component
        ],
        canActivate: [RoleGuard],
        data: { roles: ['RESPONSABLE', 'ADMINISTRATEUR'] }
      },

      // Admin Dashboard
      {
        path: 'admin',
        children: [
          { path: 'dashboard', component: Dashboard },
          { path: 'users', component: ManageUsers },
          { path: 'domains', component: Testing }, // Replace with actual component
          { path: 'structures', component: Testing }, // Replace with actual component
          { path: 'profiles', component: Testing }, // Replace with actual component
          { path: 'settings', component: Configurations } // Replace with actual component
        ],
        canActivate: [RoleGuard],
        data: { roles: ['ADMINISTRATEUR'] }
      },

      // Default dashboard redirect
      {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [AuthGuard]
      }
    ]
  },

  // Unauthorized page
  {
    path: 'unauthorized',
    component: Unauthorized 
  },

  // Default redirect
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Wildcard route
  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }