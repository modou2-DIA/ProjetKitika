import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReservationFormComponent } from '../reservation-form/reservation-form.component';
import { ReservationService } from '../../services/reservation.service';
import { FicheSejourComponent } from '../fiche-sejour/fiche-sejour.component';
import { Reservation } from '../../services/reservation.service';
import { RouterLink } from '@angular/router';
import { FicheClientService } from '../../services/fiche-client.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DialogFeedbackComponent } from '../dialog-feedback/dialog-feedback.component';
import { FactureService, Facture } from '../../services/facture.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ExtraChargeFormComponent } from '../extra-charge-form/extra-charge-form.component';

import { ExtraChargeService, ExtraCharge } from '../../services/extra-charge.service';

// Mise à jour de l'interface Reservation pour inclure une facture
declare module '../../services/reservation.service' {
  interface Reservation {
    facture?: Facture; // Ajout d'une propriété facture optionnelle
  }
}

@Component({
  selector: 'app-hebergement',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, RouterLink],
  templateUrl: './hebergement.component.html',
  styleUrls: ['./hebergement.component.scss']
})
export class HebergementComponent implements OnInit {
  reservations: Reservation[] = [];
  reservationsFiltrees: Reservation[] = [];

  searchTerm: string = '';
  statutFiltre: string = '';
  chargesVisibles: { [key: number]: boolean } = {};
  chargesParReservation: { [key: number]: ExtraCharge[] } = {};

  constructor(
    private reservationService: ReservationService,
    private ficheClientService: FicheClientService,
    private factureService: FactureService,
    private extraChargeService: ExtraChargeService,
    private dialog: MatDialog,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.chargerReservations();
  }

  chargerReservations(): void {
    this.reservationService.getAll().subscribe(data => {
      this.reservations = data;
      this.filtrerReservations();
    });
  }

  filtrerReservations(): void {
    const terme = this.searchTerm.toLowerCase();
    this.reservationsFiltrees = this.reservations.filter(res => {
      const clientNom = res.client?.nom?.toLowerCase() || '';
      const clientPrenom = res.client?.prenom?.toLowerCase() || '';
      const chambreNumero = res.chambre?.numero || '';
      const chambreType = res.chambre?.type?.toLowerCase() || '';
      const statut = res.statut || '';

      const matchClient = clientNom.includes(terme) || clientPrenom.includes(terme);
      const matchChambre = chambreNumero.includes(terme) || chambreType.includes(terme);
      const matchStatut = this.statutFiltre === '' || statut === this.statutFiltre;

      return (matchClient || matchChambre) && matchStatut;
    });
  }

  checkIn(reservation: Reservation) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmer Check-In',
        message: `Voulez-vous confirmer le Check-In de ${reservation.client?.nom} ?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        if (reservation.id) {
          this.ficheClientService.creerFicheDepuisReservation(reservation.id).subscribe({
            next: () => {
              this.chargerReservations();
              this.showSuccessModal('Check-In effectué avec succès.');
            },
            error: () => {
              this.showErrorModal("Échec du Check-In.");
            }
          });
        }
      }
    });
  }


checkOut(res: Reservation): void {
  const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
    width: '400px',
    data: {
      title: "Confirmation du Check-out",
      message: `Voulez-vous vraiment effectuer le check-out de ${res.client?.nom} ? Cette action générera la facture.`
    }
  });

  confirmDialog.afterClosed().subscribe(result => {
    if (result === true && res.id) {
      // 1. Récupère la FicheClient associée à la réservation
      this.ficheClientService.getFicheByReservationId(res.id).subscribe({
        next: (ficheClient) => {
          if (ficheClient && ficheClient.id) {
            // 2. Si la fiche est trouvée, on effectue le check-out via la FicheClient
            this.ficheClientService.checkoutDepuisReservation(ficheClient.id).subscribe({
              next: () => {
                this.showSuccessModal(`Check-out effectué pour ${res.client?.nom}.`);

                // 3. Appelle la génération de la facture avec l'ID de la FicheClient
                this.factureService.genererFactureDepuisReservation(ficheClient.id!).subscribe({
                  next: () => {
                    this.showSuccessModal("Facture générée avec succès.");
                    this.chargerReservations(); // Recharge les données après succès
                  },
                  error: () => {
                    this.showErrorModal(
                      "⚠️ Facture non générée automatiquement. Veuillez la créer manuellement."
                    );
                    this.chargerReservations(); // Recharge les données même en cas d'échec de la facture
                  }
                });
              },
              error: () => {
                this.showErrorModal("Erreur lors du Check-out. Le statut n'a pas été modifié.");
              }
            });
          } else {
            this.showErrorModal("Fiche client non trouvée. Impossible de procéder au check-out et à la facturation.");
          }
        },
        error: () => {
          this.showErrorModal("Erreur lors de la récupération de la fiche client.");
        }
      });
    }
  });
}



  // Nouvelle méthode pour consulter la facture
  consulterFacture(res: Reservation): void {
    if (res.id) {
      // S'il y a un ID de réservation, on cherche d'abord la facture associée
      this.factureService.getFactureByReservationId(res.id).subscribe({
        next: (facture) => {
          if (facture && facture.id) {
            this.router.navigate(['/facturation', facture.id]);
          } else {
            this.showErrorModal("La facture n'est pas disponible pour cette réservation.");
          }
        },
        error: (err) => {
          this.showErrorModal("Erreur lors de la recherche de la facture : " + err.message);
        }
      });
    } else {
      this.showErrorModal("Erreur : l'identifiant de la réservation est manquant.");
    }
  }


  showSuccessModal(message: string) {
    this.dialog.open(DialogFeedbackComponent, {
      width: '400px',
      data: {
        titre: 'Succès 🎉',
        message
      }
    });
    this.chargerReservations();
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

  openReservationForm() {
    this.dialog.open(ReservationFormComponent, {
      width: '600px',
    });
    this.chargerReservations();
  }

  envoyerConfirmation(id: number) {
  if (!id) return;

  this.reservationService.envoyerConfirmation(id).subscribe({
    next: () => this.showSuccessModal('📧 Confirmation envoyée avec succès ✅'),
    error: () => this.showErrorModal('❌ Erreur lors de l\'envoi de la confirmation.')
  });
}

toggleCharges(reservationId: number) {
  //this.chargesVisibles[reservationId] = !this.chargesVisibles[reservationId];
  if (!this.chargesVisibles[reservationId]) {
    this.extraChargeService.getByReservation(reservationId).subscribe(data => {
      this.chargesParReservation[reservationId] = data;
      this.chargesVisibles[reservationId] = true;
    });
  } else {
    this.chargesVisibles[reservationId] = false;
  }
}

ouvrirFormulaireExtraCharge(reservationId: number) {
  const dialogRef = this.dialog.open(ExtraChargeFormComponent, {
    width: '400px',
    data: { reservationId }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.extraChargeService.add(reservationId, result).subscribe(() => {
        this.showSuccessModal('Prestation ajoutée ✅');
        this.toggleCharges(reservationId); // recharge la liste
      });
    }
  });
}
}
