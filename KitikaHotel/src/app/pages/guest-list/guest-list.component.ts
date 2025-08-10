import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuestListService ,GuestListResponse, ReservationGuestDTO} from '../../services/guest-list.service';

import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.scss']
})
export class GuestListComponent implements OnInit {
  selectedDate: string = new Date().toISOString().slice(0,10);
  searchTerm: string = '';
  reservations: ReservationGuestDTO[] = [];
  searchNom = '';
  searchPrenom = '';
  searchEntite = '';

  guestList?: GuestListResponse;

  constructor(private service: GuestListService) {}

  ngOnInit(): void {
    this.load();
    this.rechercher();

  }
  rechercher(): void {
    this.service
      .searchGuestList(this.searchNom, this.searchPrenom, this.searchEntite)
      .subscribe(data => {
        this.reservations = data;
      });
  }

  load(): void {
    this.service.getGuestList(this.selectedDate).subscribe({
      next: (resp) => {
        this.guestList = resp;
        this.applyFilter();
      },
      error: (err) => {
        console.error('Erreur guest list', err);
      }
    });
  }

  applyFilter(): void {
    // on effectue le filtrage côté UI : ici on n'altère pas les arrays d'origine
    // la template utilisera filtered(...) pour afficher les listes filtrées
  }

  filtered(list: ReservationGuestDTO[] = []): ReservationGuestDTO[] {
    const q = this.searchTerm?.toLowerCase()?.trim() || '';
    if (!q) return list || [];
    return list.filter(r =>
      (r.clientNom || '').toLowerCase().includes(q) ||
      (r.clientPrenom || '').toLowerCase().includes(q) ||
      (r.chambreNumero || '').toLowerCase().includes(q) ||
      (r.chambreType || '').toLowerCase().includes(q)
    );
  }

  // small helper to format date if needed
  formatDate(d?: string) {
    return d ?? '-';
  }
  checkIn(resId?: number) {
  if (!resId) return;
  const ok = window.confirm("Confirmer le Check-In de cette réservation ?");
  if (!ok) return;

  this.service.checkInReservation(resId).subscribe({
    next: () => {
      alert("Check-In effectué avec succès ✅");
      this.load(); // Refresh la liste
    },
    error: (err) => {
      console.error(err);
      alert("Erreur lors du Check-In ❌");
    }
  });
}

}
