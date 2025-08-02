import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog'; 
import { ClientService } from '../../services/client.service';

import { ChambreService } from '../../services/chambre.service';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-reservation-dialog',
  imports: [ ], 
  templateUrl: './reservation-dialog.component.html',
  styleUrl: './reservation-dialog.component.scss'
})




export class ReservationDialogComponent implements OnInit {
  reservationForm!: FormGroup;
  clients: any[] = [];
  chambresLibres: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReservationDialogComponent>,
    private clientService: ClientService,
    private chambreService: ChambreService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.reservationForm = this.fb.group({
      clientId: ['', Validators.required],
      chambreId: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required]
    });

    /*this.clientService.getAll().subscribe(data => this.clients = data);
    this.chambreService.getChambresLibres().subscribe(data => this.chambresLibres = data);*/
  }

  confirmer() {
    if (this.reservationForm.valid) {
    /* this.reservationService.create(this.reservationForm.value).subscribe(() => {
        this.dialogRef.close(true);
      });*/
    }
  }
}
