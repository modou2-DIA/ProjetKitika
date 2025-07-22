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

import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'hebergement', component: HebergementComponent },
  { path: 'restauration', component: RestaurationComponent },
  { path: 'stock', component: StockComponent },
  { path: 'facturation', component: FacturationComponent },
  { path: 'client', component: ClientsComponent },
  { path: 'utilisateurs', component: UtilisateursComponent },
  { path: '**', component: NotFoundComponent } // Page 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
