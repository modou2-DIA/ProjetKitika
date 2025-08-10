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
import { AjouterChambreComponent } from './pages/ajouter-chambre/ajouter-chambre.component';
import { ReservationGroupeeComponent } from './pages/reservation-groupee/reservation-groupee.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'hebergement', component: HebergementComponent },
  { path: 'restauration', component: RestaurationComponent },
  { path: 'stock', component: StockComponent },
  { path: 'facturation', component: FacturationComponent },
  { path: 'client', component: ClientsComponent },
  { path: 'utilisateurs', component: UtilisateursComponent }, 
   { path: 'add-room', component: AjouterChambreComponent},
   {path: 'reservation-groupee', component: ReservationGroupeeComponent},
   {path: 'gestion-chambres', loadComponent: () => import('./pages/gestion-chambres/gestion-chambres.component').then(m => m.GestionChambresComponent)},
   {path: 'gestion-reservation-groupee', loadComponent: () => import('./pages/gestion-reservation-groupee/gestion-reservation-groupee.component').then(m => m.GestionReservationGroupeeComponent)},
   {path:'gestion-restauration', loadComponent: () => import('./pages/gestion-restauration/gestion-restauration.component').then(m => m.GestionRestaurationComponent)},
   { path: 'facturation/:id', component: FacturationComponent },
   {path: 'guest-list', loadComponent: () => import('./pages/guest-list/guest-list.component').then(m => m.GuestListComponent)},
   {path: 'client-search', loadComponent: () => import('./pages/client-search/client-search.component').then(m => m.ClientSearchComponent)},
   {path:'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)},
   {path:'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent),canActivate: [AuthGuard]},
  { path: '**', component: NotFoundComponent } // Page 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
