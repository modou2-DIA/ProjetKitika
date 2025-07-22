import { Component , OnInit } from '@angular/core';
import { CommonModule  } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

interface Facture {
  numero: string;
  client: string;
  montant: number;
  date: string;
  typePaiement: 'comptant' | 'credit';
}
@Component({
  selector: 'app-facturation',
  imports: [CommonModule,FormsModule],
  templateUrl: './facturation.component.html',
  styleUrl: './facturation.component.scss'
})
export class FacturationComponent {
  searchClient: string = '';
  filtrePaiement: string = '';

  factures: Facture[] = [
    { numero: 'FCT-001', client: 'Jean Dupont', montant: 120.50, date: '2025-07-05', typePaiement: 'comptant' },
    { numero: 'FCT-002', client: 'Société X', montant: 800.00, date: '2025-07-06', typePaiement: 'credit' },
    { numero: 'FCT-003', client: 'Ali Ben', montant: 200.00, date: '2025-07-07', typePaiement: 'comptant' },
    { numero: 'FCT-004', client: 'Société Y', montant: 1450.00, date: '2025-07-08', typePaiement: 'credit' }
  ];

  filteredFactures(): Facture[] {
    return this.factures.filter(f =>
      (this.filtrePaiement === '' || f.typePaiement === this.filtrePaiement) &&
      (this.searchClient === '' || f.client.toLowerCase().includes(this.searchClient.toLowerCase()))
    );
  }

  genererPDF(facture: Facture): void {
    // Simulation – à remplacer par une vraie génération PDF
    alert(`Génération de la facture PDF : ${facture.numero}`);
  }
}