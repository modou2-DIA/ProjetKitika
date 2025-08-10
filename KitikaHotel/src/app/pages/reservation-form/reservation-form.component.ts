import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ReservationService } from '../../services/reservation.service';
import { ClientService } from '../../services/client.service';
import { Chambre, ChambreService } from '../../services/chambre.service';
import { Client } from '../../services/client.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogFeedbackComponent } from '../dialog-feedback/dialog-feedback.component';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  standalone: true
})
export class ReservationFormComponent implements OnInit {
  reservationForm!: FormGroup;
  chambresDispo: Chambre[] = [];
  clients: Client[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReservationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private reservationService: ReservationService,
    private clientService: ClientService,
    private chambreService: ChambreService,
    private dialog: MatDialog // Ajouté ici
  ) {}

  ngOnInit(): void {
    this.reservationForm = this.fb.group({
      chambreId: [this.data?.chambre?.id || '', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: [''],
      telephone: ['', Validators.required],
      email: ['', Validators.required],
      nationalite: [''],
      numeroPieceIdentite: ['']
    });

    this.loadChambres();
    this.loadClients();
  }

  loadChambres() {
    this.chambreService.getChambresLibres().subscribe(data => {
      this.chambresDispo = data;
    });
  }

  loadClients() {
    this.clientService.getAll().subscribe(data => {
      this.clients = data;
    });
  }

  submitReservation() {
    if (this.reservationForm.valid) {
      const formValue = this.reservationForm.value;

      this.reservationService.creerReservationAvecClient(formValue).subscribe({
        next: () => {
          this.dialog.open(DialogFeedbackComponent, {
            data: {
              titre: '✅ Réservation réussie',
              message: 'La réservation a été enregistrée avec succès.',
               
            }
          });
          this.dialogRef.close(true);
        },
        error: () => {
          this.dialog.open(DialogFeedbackComponent, {
            data: {
              titre: '❌ Échec de la réservation',
              message: 'Une erreur est survenue lors de la réservation.',
           
            }
          });
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }
}