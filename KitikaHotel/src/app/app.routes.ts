import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importation des composants des pages
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HebergementComponent } from './pages/hebergement/hebergement.component';
import { RestaurationComponent } from './pages/restauration/restauration.component';
import { StockComponent } from './pages/stock/stock.component';
import { FacturationComponent } from './pages/facturation/facturation.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { UtilisateursComponent } from './pages/utilisateurs/utilisateurs.component';
import { ReservationGroupeeComponent } from './pages/reservation-groupee/reservation-groupee.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './services/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { GestionRestaurationComponent } from './pages/gestion-restauration/gestion-restauration.component';
import { FactureDetailsComponent } from './pages/facture-details/facture-details.component';

// Définissez un LayoutComponent pour les routes protégées si vous en avez un
// import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent), canActivate: [AuthGuard], data: { role: 'admin' } },
    { path: '', component: HomeComponent },
  // Routes protégées par l'AuthGuard
  {
    path: '',
    // La route principale (avec LayoutComponent si vous en avez un)
    // component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },

      // Réceptionniste
      { path: 'hebergement', component: HebergementComponent, data: { role: 'RECEPTIONNISTE' } },
      { path: 'restauration', component: GestionRestaurationComponent, data: { role: 'RECEPTIONNISTE' } },
      { path: 'stock', component: StockComponent, data: { role: 'RECEPTIONNISTE' } },
      { path: 'facturation', component: FacturationComponent, data: { role: 'RECEPTIONNISTE' } },
      { path: 'reservation-groupee', component: ReservationGroupeeComponent, data: { role: 'RECEPTIONNISTE' } },
      { path: 'gestion-chambres', loadComponent: () => import('./pages/gestion-chambres/gestion-chambres.component').then(m => m.GestionChambresComponent), data: { role: 'RECEPTIONNISTE' } },
      { path: 'gestion-reservation-groupee', loadComponent: () => import('./pages/gestion-reservation-groupee/gestion-reservation-groupee.component').then(m => m.GestionReservationGroupeeComponent), data: { role: 'RECEPTIONNISTE' } },
      { path: 'guest-list', loadComponent: () => import('./pages/guest-list/guest-list.component').then(m => m.GuestListComponent), data: { role: 'RECEPTIONNISTE' } },
      { path: 'client-search', loadComponent: () => import('./pages/client-search/client-search.component').then(m => m.ClientSearchComponent), data: { role: 'RECEPTIONNISTE' } },
      {path:'facturation/:id', component: FactureDetailsComponent, data: { renderMode: 'client',role: 'RECEPTIONNISTE' } },

      // Admin
      { path: 'client', component: ClientsComponent, data: { role: 'ADMIN' } },
      { path: 'utilisateurs', component: UtilisateursComponent, data: { role: 'ADMIN' } },
      { path: 'audit-log', loadComponent: () => import('./admin/audit-log/audit-log.component').then(m => m.AuditLogComponent), data: { role: 'ADMIN' } }
    ]
  },
  
  // Route 404 (non trouvée)
  { path: '**', component: NotFoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
