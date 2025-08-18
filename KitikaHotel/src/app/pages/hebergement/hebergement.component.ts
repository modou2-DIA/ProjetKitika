// src/app/components/hebergement/hebergement.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of, switchMap, catchError, throwError } from 'rxjs';

import { ReservationService} from '../../services/reservation.service';
import { FicheClientService } from '../../services/fiche-client.service';
import { FactureService} from '../../services/facture.service';
import { Reservation } from '../../models/reservation.model';
import { Facture } from '../../models/facture.model';

import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DialogFeedbackComponent } from '../dialog-feedback/dialog-feedback.component';
import { ReservationFormComponent } from '../reservation-form/reservation-form.component';
import { FacturePreviewModalComponent, FacturePreviewData } from '../facture-preview-modal/facture-preview-modal.component';
import { Consommation } from '../../models/consommation.model';
import { ConsommationService, CreateConsommationDto } from '../../services/consommation.service';
import { ConsommationAnnexeFormComponent } from '../consommation-annexe-form/consommation-annexe-form.component';

@Component({
  selector: 'app-hebergement',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './hebergement.component.html',
  styleUrls: ['./hebergement.component.scss']
})
export class HebergementComponent implements OnInit {
  reservations: Reservation[] = [];
  reservationsFiltrees: Reservation[] = [];
  searchTerm = '';
  statutFiltre = '';

  fichesVisibles: { [reservationId: number]: boolean } = {};
  ficheIdParReservation: { [reservationId: number]: number } = {};
  consommationsParReservation: { [reservationId: number]: Consommation[] } = {};

  constructor(
    private reservationService: ReservationService,
    private ficheClientService: FicheClientService,
    private factureService: FactureService,
    private consommationService: ConsommationService,
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
      const chambreNumero = res.chambre?.numero?.toLowerCase() || '';
      const chambreType = res.chambre?.type?.toLowerCase() || '';
      const statut = res.statut || '';
      const matchClient = clientNom.includes(terme) || clientPrenom.includes(terme);
      const matchChambre = chambreNumero.includes(terme) || chambreType.includes(terme);
      const matchStatut = this.statutFiltre === '' || statut === this.statutFiltre;
      return (matchClient || matchChambre) && matchStatut;
    });
  }

  // -------- Fiche + consommations
  toggleFicheClient(reservationId: number) {
    if (!this.fichesVisibles[reservationId]) {
      // 1) ficheId
      this.ficheClientService.getFicheByReservationId(reservationId).pipe(
        switchMap(fiche => {
          if (!fiche || !fiche.id) throw new Error('Fiche client introuvable');
          this.ficheIdParReservation[reservationId] = fiche.id;
          // 2) consommations
          return this.consommationService.getByFicheSejourId(fiche.id);
        })
      ).subscribe({
        next: (consos) => {
          this.consommationsParReservation[reservationId] = consos;
          this.fichesVisibles[reservationId] = true;
        },
        error: (e) => this.showErrorModal(e.message || 'Erreur lors du chargement de la fiche')
      });
    } else {
      this.fichesVisibles[reservationId] = false;
    }
  }

  ouvrirFormulaireService(reservationId: number) {
    const ficheId = this.ficheIdParReservation[reservationId];
    if (!ficheId) { this.showErrorModal('Fiche client introuvable'); return; }

    const dialogRef = this.dialog.open(ConsommationAnnexeFormComponent, {
      width: '520px',
      data: { ficheId }
    });

    dialogRef.afterClosed().subscribe((dto: CreateConsommationDto | undefined) => {
      if (!dto) return;
      this.consommationService.ajouter(dto).subscribe({
        next: () => {
          this.showSuccessModal('Service annexe ajouté ✅');
          // recharger les consommations de la fiche
          this.consommationService.getByFicheSejourId(ficheId).subscribe(c =>
            this.consommationsParReservation[reservationId] = c
          );
        },
        error: () => this.showErrorModal('Échec lors de l’ajout du service annexe')
      });
    });
  }

  // -------- Totaux
  private montantConsommation(c: Consommation): number {
    if (typeof c.montantTotal === 'number') return c.montantTotal;
    if (!c.articles?.length) return 0;
    return c.articles.reduce((s, a) => s + a.quantite * a.prixUnitaire, 0);
  }

  getNombreDeNuits(res: Reservation): number {
    const d1 = new Date(res.dateDebut).getTime();
    const d2 = new Date(res.dateFin).getTime();
    return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
  }

  totalParType(reservationId: number, type: 'RESTAURATION' | 'ANNEXE'): number {
    const list = this.consommationsParReservation[reservationId] || [];
    return list
      .filter(c => (c.type || '').toUpperCase() === type)
      .reduce((t, c) => t + this.montantConsommation(c), 0);
  }

  totalExtras(reservationId: number): number {
    const list = this.consommationsParReservation[reservationId] || [];
    return list.reduce((t, c) => t + this.montantConsommation(c), 0);
  }

  totalSejour(res: Reservation): number {
    const hebergement = res.chambre.prixParNuit * this.getNombreDeNuits(res);
    const extras = this.totalExtras(res.id!);
    return hebergement + extras;
  }

  // -------- Check-in / Check-out (inchangés sur le fond)
  checkIn(reservation: Reservation) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: { title: 'Confirmer Check-In', message: `Confirmer le Check-In de ${reservation.client?.nom} ?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true && reservation.id) {
        this.ficheClientService.creerFicheDepuisReservation(reservation.id).subscribe({
          next: () => { this.chargerReservations(); this.showSuccessModal('Check-In effectué ✔'); },
          error: () => this.showErrorModal('Échec du Check-In.')
        });
      }
    });
  }

  previewFacture(res: Reservation): void {
    if (!res.id) { this.showErrorModal("Identifiant de réservation manquant."); return; }
    const montantTotal = (res.chambre.prixParNuit * this.getNombreDeNuits(res)) + this.totalExtras(res.id);

    // On convertit les consommations en "lignes" simples pour la modale
    const lignes = (this.consommationsParReservation[res.id] || []).map(c => ({
      type: c.type,
      description: c.description || (c.articles?.map(a => a.nom).join(', ') || ''),
      montant: this.montantConsommation(c)
    }));

    const previewData: FacturePreviewData = {
      reservation: res,
      extraCharges: lignes as any, // compat. avec l’existant
      montantTotal
    };

    const dialogRef = this.dialog.open(FacturePreviewModalComponent, { width: '640px', data: previewData });
    dialogRef.afterClosed().subscribe(ok => { if (ok) this.genererFactureEtCheckout(res); });
  }

  genererFactureEtCheckout(res: Reservation): void {
    this.ficheClientService.getFicheByReservationId(res.id!).pipe(
      switchMap(fiche => {
        if (!fiche?.id) return throwError(() => new Error("Fiche client non trouvée."));
        return this.ficheClientService.checkoutDepuisReservation(fiche.id).pipe(
          switchMap(() => {
            this.showSuccessModal(`Check-out effectué pour ${res.client?.nom}.`);
            return this.factureService.genererFactureDepuisReservation(fiche.id!);
          }),
          catchError(() => { this.showErrorModal("Facture non générée automatiquement."); return of(null); })
        );
      }),
      catchError((err) => { this.showErrorModal("Erreur: " + err.message); return of(null); })
    ).subscribe(() => this.chargerReservations());
  }

  consulterFacture(res: Reservation): void {
    if (!res.id) { this.showErrorModal("Identifiant de réservation manquant."); return; }
    this.factureService.getFactureByReservationId(res.id).subscribe({
      next: (facture) => facture?.id ? this.router.navigate(['/facturation', facture.id]) :
                                      this.showErrorModal("Aucune facture pour cette réservation."),
      error: (err) => this.showErrorModal("Erreur facture : " + err.message)
    });
  }

  // -------- UI utils
  showSuccessModal(message: string) {
    this.dialog.open(DialogFeedbackComponent, { width: '400px', data: { titre: 'Succès 🎉', message } });
    this.chargerReservations();
  }
  showErrorModal(message: string) {
    this.dialog.open(DialogFeedbackComponent, { width: '400px', data: { titre: 'Erreur ❌', message } });
  }
openReservationForm() {
  const ref = this.dialog.open(ReservationFormComponent, { width: '600px' });

  ref.afterClosed().subscribe((created) => {
    if (created) {
      // insertion optimiste sans recharger
      this.reservations.unshift(created);
      this.filtrerReservations();
      this.showSuccessModal('Réservation ajoutée.');
    }
  });
}

  getMontantTotal(c: any): number {
  if (c.montantTotal != null) {
    return c.montantTotal;
  }
  if (c.articles && Array.isArray(c.articles)) {
    return c.articles.reduce(
      (s: number, a: any) => s + (a.quantite || 0) * (a.prixUnitaire || 0),
      0
    );
  }
  return 0;
}
getDescription(c: any): string {
  if (c.description && c.description.trim() !== '') {
    return c.description;
  }
  if (c.articles && Array.isArray(c.articles) && c.articles.length > 0) {
    return c.articles.map((a: any) => a.nom).join(', ');
  }
  return '—';
}


}
