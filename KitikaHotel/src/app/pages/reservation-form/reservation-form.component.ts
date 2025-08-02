

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReservationService } from '../../services/reservation.service';
import { ClientService } from '../../services/client.service';
import { Chambre } from '../../services/chambre.service';
import { Client } from '../../services/client.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss'] ,
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
    @Inject(MAT_DIALOG_DATA) public data: any, // Peut contenir chambre pré-sélectionnée
    private reservationService: ReservationService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.reservationForm = this.fb.group({
      chambreId: [this.data?.chambre?.id || '', Validators.required],
      clientId: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
    });

    this.loadChambres();
    this.loadClients();
  }

  loadChambres() {
    this.reservationService.getChambresLibres().subscribe(data => {
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

      this.reservationService.create(formValue).subscribe(() => {
        alert('Réservation effectuée avec succès ✅');
        this.dialogRef.close(true);
      });
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
