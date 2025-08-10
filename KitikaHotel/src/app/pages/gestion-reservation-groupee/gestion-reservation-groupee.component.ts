import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AjouterClientComponent } from '../ajouter-client/ajouter-client.component';
import { ReservationGroupeeService, ReservationGroupee as ReservationGroupeeOriginal } from '../../services/reservation-groupee.service';
import { Reservation as ReservationOriginal } from '../../services/reservation.service';
import { FicheClientService } from '../../services/fiche-client.service';

import { ReservationGroupeeComponent } from '../reservation-groupee/reservation-groupee.component';
import { FicheSejourComponent } from '../fiche-sejour/fiche-sejour.component';
import { DialogFeedbackComponent } from '../dialog-feedback/dialog-feedback.component';

// On étend l'interface de base pour inclure la propriété de l'UI
export interface ReservationGroupee extends ReservationGroupeeOriginal {
  afficherDetails?: boolean;
}

// On étend l'interface de base pour inclure la propriété de l'UI
export interface Reservation extends ReservationOriginal {
  statut: 'En attente' | 'Checked-in' | 'Checked-out';
}

@Component({
  selector: 'app-gestion-reservation-groupee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
  
  ],
  templateUrl: './gestion-reservation-groupee.component.html',
  styleUrls: ['./gestion-reservation-groupee.component.scss']
})
export class GestionReservationGroupeeComponent implements OnInit {
  reservationsGroupees: ReservationGroupee[] = [];
  reservationsFiltrees: ReservationGroupee[] = [];

  searchTerm: string = '';
  statutFiltre: string = '';

  constructor(
    private reservationGroupeeService: ReservationGroupeeService,
    private ficheClientService: FicheClientService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerReservations();
  }

  chargerReservations(): void {
    this.reservationGroupeeService.getAll().subscribe(data => {
      // Assigner la propriété 'afficherDetails' à false par défaut pour l'UI
      this.reservationsGroupees = data.map(res => ({ ...res, afficherDetails: false }));
      this.filtrerReservations();
    });
  }

  filtrerReservations(): void {
    const terme = this.searchTerm.toLowerCase();
    
    this.reservationsFiltrees = this.reservationsGroupees.filter(res => {
      const matchSociete = res.societe?.nom?.toLowerCase().includes(terme) || false;
      const matchGroupe = res.nomGroupe?.toLowerCase().includes(terme) || false;
      const matchClient = res.reservations?.some(r =>
        r.client?.nom?.toLowerCase().includes(terme)
      ) || false;
      
      const groupeStatut = this.getStatutGroupe(res);
      const matchStatut = this.statutFiltre === '' || groupeStatut === this.statutFiltre;

      return (matchSociete || matchGroupe || matchClient) && matchStatut;
    });
  }

  checkInGroupe(resGroupe: ReservationGroupee): void {
    const dialogRef = this.dialog.open(DialogFeedbackComponent, {
      data: {
        title: 'Confirmer le Check-In',
        message: `Souhaitez-vous effectuer le check-in pour le groupe "${resGroupe.nomGroupe}" ?`,
        confirmText: 'Oui, continuer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        if (resGroupe.id !== undefined) {
          this.ficheClientService.creerFicheDepuisReservationGroupee(resGroupe.id).subscribe({
            next: () => {
              this.chargerReservations();
              this.showSuccessModal("Check-In de groupe effectué avec succès.");
            },
            error: () => {
              this.showErrorModal("Erreur lors du Check-In de groupe.");
            }
          });
        } else {
          this.showErrorModal("ID du groupe non défini, impossible de faire le Check-In.");
        }
      }
    });
  }

  checkOutGroupe(resGroupe: ReservationGroupee): void {
    const dialogRef = this.dialog.open(FicheSejourComponent, {
      width: '600px',
      data: { reservationGroupee: resGroupe }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.chargerReservations();
    });
  }

  showSuccessModal(message: string): void {
    this.dialog.open(DialogFeedbackComponent, {
      data: {
        title: 'Succès',
        message: message,
        type: 'success'
      }
    });
  }

  showErrorModal(message: string): void {
    this.dialog.open(DialogFeedbackComponent, {
      data: {
        title: 'Erreur',
        message: message,
        type: 'error'
      }
    });
  }

  ouvrirModalAjout(): void {
    const dialogRef = this.dialog.open(ReservationGroupeeComponent, {
      width: '90vw',
      maxWidth: '75vw',
      height: '90vh',
      maxHeight: '100vh',
      data: null
    });
    dialogRef.afterClosed().subscribe(() => {
      this.chargerReservations();
    });
  }

  retour() {
    this.router.navigate(['../hebergement']);
  }

  checkIn(reservation: any): void {
    reservation.statut = 'Checked-in';
    this.showSuccessModal(`${reservation.client.nom} a bien été enregistré (Check-in).`);
    // Le rechargement des données peut être géré par un service pour une meilleure synchro.
  }

  checkOut(reservation: any): void {
    reservation.statut = 'Checked-out';
    this.showSuccessModal(`${reservation.client.nom} a quitté l'établissement (Check-out).`);
    // Le rechargement des données peut être géré par un service pour une meilleure synchro.
  }

  getStatutGroupe(groupe: ReservationGroupee): string {
    const allOut = groupe.reservations?.every(r => r.statut === 'Checked-out');
    const allIn = groupe.reservations?.every(r => r.statut === 'Checked-in');
    const anyIn = groupe.reservations?.some(r => r.statut === 'Checked-in');
    const anyOut = groupe.reservations?.some(r => r.statut === 'Checked-out');

    if (allOut) return 'Terminé';
    if (allIn) return 'En séjour';
    if (anyIn || anyOut) return 'Partiel';
    return 'En attente';
  }
    ouvrirModalAjoutClient(groupe: ReservationGroupee): void {
    const dialogRef = this.dialog.open(AjouterClientComponent, {
      width: '600px',
      data: { reservationGroupeeId: groupe.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.chargerReservations(); // Recharger la liste après l'ajout d'un client
      }
    });
  } 
}
