import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FactureService, Facture } from '../../services/facture.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogFeedbackComponent } from '../dialog-feedback/dialog-feedback.component';

@Component({
  selector: 'app-facturation',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './facturation.component.html',
  styleUrl: './facturation.component.scss'
})
export class FacturationComponent implements OnInit {
  // Variables pour les filtres
  searchClient: string = '';
  filtrePaiement: string = '';

  // Listes de factures
  factures: Facture[] = [];
  facturesFiltrees: Facture[] = [];

  constructor(
    private factureService: FactureService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // On charge toutes les factures dès l'initialisation
    this.chargerFactures();
  }

  /**
   * Charge toutes les factures depuis le service et initialise la liste filtrée.
   */
  chargerFactures(): void {
    this.factureService.getAll().subscribe({
      next: (data) => {
        this.factures = data;
        this.filtrerFactures(); // Appel initial pour remplir la liste filtrée
      },
      error: (err) => {
        this.showErrorModal("Erreur lors du chargement des factures : " + err.message);
      }
    });
  }

  /**
   * Filtre les factures en fonction de la recherche client et du statut de paiement.
   * Cette méthode est appelée à chaque modification des filtres.
   */
  filtrerFactures(): void {
    this.facturesFiltrees = this.factures.filter(f => {
      // Filtrage par statut de paiement
      const matchPaiement = this.filtrePaiement === '' || f.payee.toString() === this.filtrePaiement;

      // Filtrage par nom ou prénom du client
      const matchClient =
        this.searchClient === '' ||
        f.client?.nom?.toLowerCase().includes(this.searchClient.toLowerCase()) ||
        f.client?.prenom?.toLowerCase().includes(this.searchClient.toLowerCase());
        
      return matchPaiement && matchClient;
    });
  }

  /**
   * Gère l'événement de changement des filtres (recherche client ou statut).
   * Appelle la méthode de filtrage principale.
   */
  onFiltreChange(): void {
    this.filtrerFactures();
  }

  genererPDF(facture: Facture): void {
    if (facture.id !== undefined) {
      this.factureService.genererPDF(facture.id);
    } else {
      this.showErrorModal("Erreur : l'identifiant de la facture est manquant.");
    }
  }

  payerFacture(facture: Facture): void {
    const confirmation = this.dialog.open(DialogFeedbackComponent, {
      width: '400px',
      data: {
        titre: 'Confirmation ❓',
        message: 'Êtes-vous sûr de vouloir marquer cette facture comme payée ?',
        type: 'confirm'
      }
    });

    confirmation.afterClosed().subscribe(result => {
      if (result) {
        if (facture.id !== undefined) {
          this.factureService.marquerCommePayee(facture.id).subscribe({
            next: () => {
              facture.payee = true;
              this.filtrerFactures();
              this.showSuccessModal("Facture payée avec succès !");
            },
            error: (err) => {
              this.showErrorModal("Échec du paiement de la facture : " + err.message);
            }
          });
        } else {
          this.showErrorModal("Erreur : l'identifiant de la facture est manquant.");
        }
      }
    });
  }

  showSuccessModal(message: string) {
    this.dialog.open(DialogFeedbackComponent, {
      width: '400px',
      data: {
        titre: 'Succès 🎉',
        message
      }
    });
  }

  showErrorModal(message: string) {
    this.dialog.open(DialogFeedbackComponent, {
      width: '400px',
      data: {
        titre: 'Erreur ❌',
        message
      }
    });
  }
}
