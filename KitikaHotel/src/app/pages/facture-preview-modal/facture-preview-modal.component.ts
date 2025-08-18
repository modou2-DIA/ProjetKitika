import { Component, Inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Reservation } from '../../models/reservation.model';
import { ExtraCharge } from '../../services/extra-charge.service';

// Interface pour les données de prévisualisation de la facture
export interface FacturePreviewData {
  reservation: Reservation;
  extraCharges: ExtraCharge[];
  montantTotal: number;
}

@Component({
  selector: 'app-facture-preview-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, CurrencyPipe],
  template: `
    <!-- Template de la modale de prévisualisation -->
    <div class="p-6 bg-white rounded-xl shadow-lg font-sans">
      <h2 class="text-2xl font-bold text-blue-800 mb-4 text-center">Prévisualisation de la Facture</h2>

      <!-- Détails de la réservation -->
      <div class="border-b pb-4 mb-4">
        <h3 class="text-xl font-semibold text-blue-600 mb-2">Détails de la réservation</h3>
        <p><span class="font-medium text-gray-700">Client:</span> {{ data.reservation.client.nom }} {{ data.reservation.client.prenom }}</p>
        <p><span class="font-medium text-gray-700">Chambre:</span> {{ data.reservation.chambre.numero }} ({{ data.reservation.chambre.type }})</p>
        <p><span class="font-medium text-gray-700">Période:</span> {{ data.reservation.dateDebut }} au {{ data.reservation.dateFin }}</p>
      </div>

      <!-- Détail des prestations et prix -->
      <div class="border-b pb-4 mb-4">
        <h3 class="text-xl font-semibold text-blue-600 mb-2">Détail des prestations</h3>
        <div class="mb-2">
            <p class="font-bold text-gray-800">Frais de séjour:</p>
            <p class="text-sm text-gray-600 ml-4">{{ data.reservation.chambre.prixParNuit | currency:'EUR':'symbol':'1.2-2' }} par nuit</p>
        </div>
        <div *ngIf="data.extraCharges.length > 0">
            <p class="font-bold text-gray-800 mt-4">Prestations additionnelles:</p>
            <ul class="list-disc pl-8">
                <li *ngFor="let charge of data.extraCharges" class="text-sm text-gray-600">
                    {{ charge.description }} ({{ charge.montant | currency:'EUR':'symbol':'1.2-2' }})
                </li>
            </ul>
        </div>
      </div>

      <!-- Montant total -->
      <div class="text-right mt-6">
        <p class="text-2xl font-bold text-green-700">
          Montant Total: {{ data.montantTotal | currency:'EUR':'symbol':'1.2-2' }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-4 mt-6">
        <button mat-dialog-close
                class="bg-gray-300 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-400 transition-colors">
          Annuler
        </button>
        <button (click)="genererFacture()"
                class="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors">
          <i class="fas fa-check-circle mr-2"></i> Générer la facture
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class FacturePreviewModalComponent {
  constructor(
    public dialogRef: MatDialogRef<FacturePreviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FacturePreviewData
  ) {}

  genererFacture(): void {
    // Ferme la modale avec un résultat 'true' pour indiquer que l'action est confirmée
    this.dialogRef.close(true);
  }
}
