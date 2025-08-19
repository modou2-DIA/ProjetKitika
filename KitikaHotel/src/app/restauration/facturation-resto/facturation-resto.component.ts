import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
interface Facture {
  numero: string;
  client: string;
  montant: number;
  date: string;
}

@Component({
  selector: 'app-facturation-resto',
  templateUrl: './facturation-resto.component.html',
  imports:[CommonModule]
})
export class FacturationRestoComponent {
  factures: Facture[] = [
    { numero: 'FAC-001', client: 'Mamadou Ndiaye', montant: 8500, date: '2025-08-15' },
    { numero: 'FAC-002', client: 'Awa Diop', montant: 3500, date: '2025-08-16' },
    { numero: 'FAC-003', client: 'Cheikh Sarr', montant: 12000, date: '2025-08-17' }
  ];
}
