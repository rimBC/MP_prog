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
import { FormationDetails } from './components/user/manage-formation/formation-details/formation-details';
import { Profile } from './components/user/manage-participants/profile/profile';
import { ManageFormateur } from './components/user/manage-formateur/manage-formateur';
import { ManageParticipants } from './components/user/manage-participants/manage-participants';
import { Dashboard } from './components/responsable/dashboard/dashboard';
import { Home } from './components/home/home';

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
        // Default redirect
      { path: '', redirectTo: 'user/home', pathMatch: 'full' },

      
      { path: 'contact', component: Contact } ,
      
      // User Dashboard
      {
        path: 'user',
        children: [
          { path: 'home', component: Home },
          { path: 'trainers', component: ManageFormateur }, 
          { path: 'trainings', component: ManageFormation },
          { path: 'trainings/:id', component: FormationDetails },
          { path: 'participants', component: ManageParticipants },
          { path: 'participants/:id', component: Profile }
        ],
        canActivate: [RoleGuard],
        data: { roles: ['SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR'] }
      },

      // Manager Dashboard
      {
        path: 'manager',
        children: [
          { path: 'statistics', component: Dashboard },
          { path: 'reports', component: Testing }, 
        ],
        canActivate: [RoleGuard],
        data: { roles: ['RESPONSABLE', 'ADMINISTRATEUR'] }
      },

      // Admin Dashboard
      {
        path: 'admin',
        children: [
          { path: 'users', component: ManageUsers },
          { path: 'domains', component: Testing }, 
          { path: 'structures', component: Testing }, 
          { path: 'profiles', component: Testing },
          { path: 'employeurs', component: Testing }, 
          { path: 'settings', component: Configurations } 
        ],
        canActivate: [RoleGuard],
        data: { roles: ['ADMINISTRATEUR'] }
      },

      // Default dashboard redirect
      {
        path: 'Home',
        component: Home,
        canActivate: [AuthGuard]
      }
    ]
  },

  // Unauthorized page
  {
    path: 'unauthorized',
    component: Unauthorized 
  },

  // Wildcard route
  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }