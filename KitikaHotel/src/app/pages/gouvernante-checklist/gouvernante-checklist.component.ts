import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-gouvernante-checklist',
  templateUrl: './gouvernante-checklist.component.html',
  styleUrls: ['./gouvernante-checklist.component.scss'],
  imports:[CommonModule,FormsModule]
})
export class GouvernanteChecklistComponent {

  // Données statiques pour tester
  checklist = [
    { id: 1, employe: 'Awa Ndiaye', tache: 'Nettoyer chambre 101', fait: false },
    { id: 2, employe: 'Fatou Diop', tache: 'Changer draps chambre 102', fait: true },
    { id: 3, employe: 'Moussa Fall', tache: 'Vérifier minibar chambre 103', fait: false },
    { id: 4, employe: 'Mariama Sow', tache: 'Nettoyer salle de réunion', fait: false },
  ];

  toggleTache(item: any) {
    item.fait = !item.fait;
  }

}
