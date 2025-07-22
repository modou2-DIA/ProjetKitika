import { Component } from '@angular/core'; 
import { CommonModule } from '@angular/common';
interface Chambre {
  id: number;
  numero: string;
  type: string;
  prix: number;
  statut: 'Libre' | 'Occupée';
}
@Component({
  selector: 'app-hebergement',
  imports: [ CommonModule],
  templateUrl: './hebergement.component.html',
  styleUrl: './hebergement.component.scss'
})
export class HebergementComponent {

  chambres: Chambre[] = [
    { id: 1, numero: '101', type: 'Standard', prix: 80, statut: 'Libre' },
    { id: 2, numero: '102', type: 'Deluxe', prix: 120, statut: 'Occupée' },
    { id: 3, numero: '103', type: 'Suite', prix: 200, statut: 'Libre' },
  ];

  editChambre(chambre: Chambre) {
    // Logique de modification (popup, formulaire, etc.)
    console.log('Modifier', chambre);
  }

  deleteChambre(id: number) {
    this.chambres = this.chambres.filter(chambre => chambre.id !== id);
  }

}
