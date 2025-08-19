import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Composants principaux
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

// Pages partagées
import { FactureDetailsComponent } from './pages/facture-details/facture-details.component';

// Admin
import { ClientsComponent } from './pages/clients/clients.component';
import { UtilisateursComponent } from './pages/utilisateurs/utilisateurs.component';

// Réceptionniste
import { HebergementComponent } from './pages/hebergement/hebergement.component';
import { FacturationComponent } from './pages/facturation/facturation.component';
import { ReservationGroupeeComponent } from './pages/reservation-groupee/reservation-groupee.component';
import { GestionRestaurationComponent } from './pages/gestion-restauration/gestion-restauration.component';
import { StockComponent } from './pages/stock/stock.component';
import { MenuComponent } from './restauration/menu/menu.component';
import { StockCuisineComponent } from './restauration/stock-cuisine/stock-cuisine.component';
import { FacturationRestoComponent } from './restauration/facturation-resto/facturation-resto.component';
import {PlanningPersonnelComponent}  from './pages/planning-personnel/planning-personnel.component';
// Guards
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './services/role.guard';

export const routes: Routes = [
  // Auth
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },

  // Page publique
  { path: '', component: HomeComponent },

  // Routes protégées
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },

      // ================= Réceptionniste =================
      
      { path: 'hebergement', component: HebergementComponent, canActivate: [RoleGuard], data: { role: 'RECEPTIONNISTE' } },
      
     
      { path: 'stock', component: StockComponent, canActivate: [RoleGuard], data: { role: 'RECEPTIONNISTE' } },
      { path: 'facturation', component: FacturationComponent, canActivate: [RoleGuard], data: { role: 'RECEPTIONNISTE' } },
      { path: 'reservation-groupee', component: ReservationGroupeeComponent, canActivate: [RoleGuard], data: { role: 'RECEPTIONNISTE' } },

      { path: 'gestion-reservation-groupee', loadComponent: () => import('./pages/gestion-reservation-groupee/gestion-reservation-groupee.component').then(m => m.GestionReservationGroupeeComponent), canActivate: [RoleGuard], data: { role: 'RECEPTIONNISTE' } },
      { path: 'guest-list', loadComponent: () => import('./pages/guest-list/guest-list.component').then(m => m.GuestListComponent), canActivate: [RoleGuard], data: { role: 'RECEPTIONNISTE' } },
      { path: 'client-search', loadComponent: () => import('./pages/client-search/client-search.component').then(m => m.ClientSearchComponent), canActivate: [RoleGuard], data: { role: 'RECEPTIONNISTE' } },
      { path: 'facturation/:id', component: FactureDetailsComponent, canActivate: [RoleGuard], data: { role: 'RECEPTIONNISTE' } },

      // ================= Gouvernante =================
      { path: 'gestion-chambres', loadComponent: () => import('./pages/gestion-chambres/gestion-chambres.component').then(m => m.GestionChambresComponent), canActivate: [RoleGuard], data: { role: 'GOUVERNANTE' } },
      { path: 'gouvernante-checklist', loadComponent: () => import('./pages/gouvernante-checklist/gouvernante-checklist.component').then(m => m.GouvernanteChecklistComponent), canActivate: [RoleGuard], data: { role: 'GOUVERNANTE' } },

      {
          path: 'planning-personnel',
          component: PlanningPersonnelComponent,
          canActivate: [RoleGuard],
          data: { role: 'GOUVERNANTE' } // ou autre selon ton design
        },

         // ================= Responsable Restauration =================

         { path: 'restauration', component: GestionRestaurationComponent, canActivate: [RoleGuard], data: { role: 'GESTIONNAIRE_RESTAURANT' } },
         {path:'menu', component:MenuComponent,canActivate:[RoleGuard],data:{role:'GESTIONNAIRE_RESTAURANT'}},
      {path:'stock-cuisine', component:StockCuisineComponent,canActivate:[RoleGuard],data:{role:'GESTIONNAIRE_RESTAURANT'}},
      {path:'facturation-resto', component:FacturationRestoComponent,canActivate:[RoleGuard],data:{role:'GESTIONNAIRE_RESTAURANT'}},
      
      // ================= Responsable Hébergement =================
      { path: 'hebergement-resp', loadComponent: () => import('./pages/hebergement-resp/hebergement-resp.component').then(m => m.HebergementRespComponent), canActivate: [RoleGuard], data: { role: 'RESP_HEBERGEMENT' } },

      // ================= Admin =================
      { path: 'client', component: ClientsComponent, canActivate: [RoleGuard], data: { role: 'ADMIN' } },
      { path: 'utilisateurs', component: UtilisateursComponent, canActivate: [RoleGuard], data: { role: 'ADMIN' } },
      { path: 'audit-log', loadComponent: () => import('./admin/audit-log/audit-log.component').then(m => m.AuditLogComponent), canActivate: [RoleGuard], data: { role: 'ADMIN' } }
    ]
  },

  // 404
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
