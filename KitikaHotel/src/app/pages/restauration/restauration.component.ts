import { Component ,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-restauration',
  imports: [CommonModule],
  templateUrl: './restauration.component.html',
  styleUrl: './restauration.component.scss'
})
export class RestaurationComponent  implements OnInit {
  totalVentes: number = 12450;
  serviceStats = [
    { service: 'Petit-déjeuner', total: 45 },
    { service: 'Déjeuner', total: 72 },
    { service: 'Dîner', total: 38 },
  ];
  stockAlerts: string[] = ['Vin rouge', 'Pain complet'];

  ngOnInit(): void {
    // Appels API à ajouter ici
  }
}
