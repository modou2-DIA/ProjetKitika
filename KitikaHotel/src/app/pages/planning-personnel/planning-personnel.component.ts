import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
interface TachePersonnel {
  id: number;
  nom: string;
  role: string;
  shift: string;
  status: 'Présent' | 'Absent' | 'En pause';
}

@Component({
  selector: 'app-planning-personnel',
  templateUrl: './planning-personnel.component.html',
  styleUrls: ['./planning-personnel.component.scss'],
  imports:[CommonModule]
})
export class PlanningPersonnelComponent {
  // Données statiques de test
  planning: TachePersonnel[] = [
    { id: 1, nom: 'Aïcha Ndiaye', role: 'Gouvernante', shift: '08h - 16h', status: 'Présent' },
    { id: 2, nom: 'Moussa Diop', role: 'Réceptionniste', shift: '09h - 17h', status: 'Présent' },
    { id: 3, nom: 'Fatou Fall', role: 'Femme de chambre', shift: '07h - 15h', status: 'En pause' },
    { id: 4, nom: 'Aliou Ba', role: 'Cuisinier', shift: '12h - 20h', status: 'Absent' },
  ];

  getBadgeColor(status: string): string {
    switch (status) {
      case 'Présent': return 'bg-green-500';
      case 'Absent': return 'bg-red-500';
      case 'En pause': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  }
}
