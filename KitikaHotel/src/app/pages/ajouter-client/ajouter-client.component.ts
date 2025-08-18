import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {  ClientService } from '../../services/client.service';
import {  ReservationService } from '../../services/reservation.service';
import {  ChambreService } from '../../services/chambre.service';
import { ReservationGroupee, ReservationGroupeeService } from '../../services/reservation-groupee.service';
import { Observable, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogFeedbackComponent } from '../dialog-feedback/dialog-feedback.component';
import { Client } from '../../models/client.model';
import { Reservation } from '../../models/reservation.model';
import { Chambre } from '../../models/chambre.model';

@Component({
  selector: 'app-ajouter-client',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  templateUrl: './ajouter-client.component.html',
  styleUrls: ['./ajouter-client.component.scss']
})
export class AjouterClientComponent implements OnInit {
  clientForm!: FormGroup;
  reservationGroupeeId: number;
  chambresLibres$!: Observable<Chambre[]>;

  constructor(
    public dialogRef: MatDialogRef<AjouterClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reservationGroupeeId: number, dateDebut: string, dateFin: string, receptionnisteId: number },
    private clientService: ClientService,
    private reservationService: ReservationService,
    private chambreService: ChambreService,
    private dialog: MatDialog,
    private reservationGroupeeService: ReservationGroupeeService
  ) {
    this.reservationGroupeeId = data.reservationGroupeeId;
  }

  ngOnInit(): void {
    this.clientForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl(''),
      telephone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      numeroPieceIdentite: new FormControl(''),
      adresse: new FormControl(''),
      nationalite: new FormControl(''),
      chambreId: new FormControl('', [Validators.required]),
      type: new FormControl('particulier', [Validators.required]),
      societe: new FormControl('')
    });

    this.chambresLibres$ = this.chambreService.getChambresLibres();
  }

  onAjouterClient(): void {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;
      
      // Étape 1: Créer le client
      this.clientService.create({
        nom: clientData.nom,
        prenom: clientData.prenom,
        telephone: clientData.telephone,
        email: clientData.email,
        numeroPieceIdentite: clientData.numeroPieceIdentite,
        adresse: clientData.adresse,
        nationalite: clientData.nationalite,
        societe: clientData.societe,
        type: clientData.type
      }).pipe(
        // Étape 2: Récupérer l'objet Chambre en utilisant l'ID
        switchMap((createdClient: Client) => {
          if (!createdClient.id) {
            throw new Error("Impossible de créer le client");
          }
          const chambreId = clientData.chambreId;
          return this.chambreService.getById(chambreId).pipe(
            switchMap((chambre: Chambre) => {
              // Étape 3: Créer la réservation avec l'objet Client et l'objet Chambre complet
              const reservationData: Reservation = {
                dateDebut: this.data.dateDebut,
                dateFin: this.data.dateFin,
                statut: 'EN_ATTENTE',
                total: 0,
                client: createdClient,
                chambre: chambre,
                receptionniste:  null
                
              };
              return this.reservationService.create(reservationData);
            })
          );
        }),
        // Étape 4: Ajouter la réservation à la réservation groupée
        switchMap((createdReservation: Reservation) => {
          if (!createdReservation.id) {
            throw new Error("Impossible de créer la réservation");
          }
          return this.reservationGroupeeService.addReservationToGroup(this.reservationGroupeeId, createdReservation.id);
        }),
        tap(() => {
          this.showSuccessModal('Client et réservation ajoutés avec succès !');
          this.dialogRef.close(true);
        }),
        catchError((err) => {
          console.error("Erreur lors de l'ajout du client ou de la réservation", err);
          this.showErrorModal("Une erreur est survenue lors de l'ajout du client ou de la réservation.");
          this.dialogRef.close(false);
          return of(null);
        })
      ).subscribe();
    }
  }

  onAnnuler(): void {
    this.dialogRef.close(false);
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
}
