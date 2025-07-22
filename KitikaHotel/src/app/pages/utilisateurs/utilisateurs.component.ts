import { Component } from '@angular/core';
import { CommonModule  } from '@angular/common'; 
import { FormsModule } from '@angular/forms';  

interface Utilisateur {
  nom: string;
  email: string;
  role: string;
  connecte: boolean;
}

@Component({
  selector: 'app-utilisateurs',
  imports: [CommonModule,FormsModule],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.scss'
})
export class UtilisateursComponent {
  roles = ['Administrateur', 'Réceptionniste', 'Chef de Cuisine', 'Responsable Hébergement', 'DG'];

  utilisateurs: Utilisateur[] = [
    { nom: 'Awa Ndiaye', email: 'awa@hotel.com', role: 'Administrateur', connecte: true },
    { nom: 'Ousmane Ba', email: 'ousmane@hotel.com', role: 'Chef de Cuisine', connecte: false }
  ];

  nouvelUtilisateur: Utilisateur = { nom: '', email: '', role: '', connecte: false };

  ajouterUtilisateur(): void {
    if (this.nouvelUtilisateur.nom && this.nouvelUtilisateur.email && this.nouvelUtilisateur.role) {
      this.utilisateurs.push({ ...this.nouvelUtilisateur });
      this.nouvelUtilisateur = { nom: '', email: '', role: '', connecte: false };
    }
  }

  supprimerUtilisateur(user: Utilisateur): void {
    this.utilisateurs = this.utilisateurs.filter(u => u !== user);
  }
}