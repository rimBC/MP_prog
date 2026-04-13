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
import { Configurations } from './components/configurations/configurations';

// Dashboard Components (will be created)
// import { DashboardComponent } from './features/dashboard/dashboard.component';

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
          { path: 'dashboard', component: Testing }, // Replace with actual dashboard
          { path: 'trainers', component: Login }, // Replace with actual component
          { path: 'trainings', component: Login }, // Replace with actual component
          { path: 'participants', component: Login } // Replace with actual component
        ],
        canActivate: [RoleGuard],
        data: { roles: ['SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR'] }
      },

      // Manager Dashboard
      {
        path: 'manager',
        children: [
          { path: 'dashboard', component: Testing }, // Replace with actual dashboard
          { path: 'statistics', component: Testing }, // Replace with actual component
          { path: 'reports', component: Testing }, // Replace with actual component
        ],
        canActivate: [RoleGuard],
        data: { roles: ['RESPONSABLE', 'ADMINISTRATEUR'] }
      },

      // Admin Dashboard
      {
        path: 'admin',
        children: [
          { path: 'dashboard', component: Testing }, // Replace with actual dashboard
          { path: 'users', component: UserManagement },
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
        component: Testing, // Replace with actual component
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
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  // Wildcard route
  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }