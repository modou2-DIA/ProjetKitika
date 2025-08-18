import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reservation } from '../../models/reservation.model';

@Component({
  selector: 'app-hebergement-resp',
  templateUrl: './hebergement-resp.component.html',
  imports:[CommonModule,FormsModule]
})
export class HebergementRespComponent implements OnInit {
  reservations: Reservation[] = [];
  loading = false;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations() {
    this.loading = true;
    this.reservationService.getAll().subscribe({
      next: (data) => { this.reservations = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  changerStatut(reservation: Reservation, statut: Reservation['statut']) {
    this.reservationService.update( reservation).subscribe({
      next: () => reservation.statut = statut
    });
  }
}
