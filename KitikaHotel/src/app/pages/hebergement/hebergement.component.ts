import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReservationFormComponent } from '../reservation-form/reservation-form.component';
import { ChambreService ,Chambre} from '../../services/chambre.service';
import { ReservationService } from '../../services/reservation.service';
import { FicheSejourComponent } from '../fiche-sejour/fiche-sejour.component';
import { RouterLink } from '@angular/router';
import { FicheClientService } from '../../services/fiche-client.service';
import { AjouterChambreComponent } from '../ajouter-chambre/ajouter-chambre.component';
@Component({
  selector: 'app-hebergement',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './hebergement.component.html',
  styleUrls: ['./hebergement.component.scss']
})
export class HebergementComponent implements OnInit {
  chambres: Chambre[] = [];
  selectedChambre?: Chambre;

  constructor(
    private chambreService: ChambreService,
    private reservationService: ReservationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadChambres();
  }

  loadChambres(): void {
    this.chambreService.getAll().subscribe(data => {
      this.chambres = data;
      this.filtrerChambres();
    });
  }

  selectChambre(chambre: Chambre): void {
    this.selectedChambre = chambre;
  }

openReservationForm() {
  this.dialog.open(ReservationFormComponent, {
      width: '700px',  // ou même 'auto' si tu veux qu’il s’adapte
  maxHeight: '90vh', // pour éviter les coupures verticales
  panelClass: 'custom-modal-panel'
  }).afterClosed().subscribe(result => {
    if (result) this.loadChambres(); // Recharger les chambres après réservation
  });
}


  checkInSelected(): void {
    if (!this.selectedChambre) return;

    this.reservationService.checkIn(this.selectedChambre.id).subscribe(() => {
      alert("Client enregistré (check-in)");
      this.loadChambres();
    });
  }

  checkOutSelected(): void {
    if (!this.selectedChambre) return;

    this.dialog.open(FicheSejourComponent, {
      width: '600px',
      data: { chambre: this.selectedChambre }
    });
  } 
ajouterChambre() {
  const dialogRef = this.dialog.open(AjouterChambreComponent, {
   width: '600px',  // ou même 'auto' si tu veux qu’il s’adapte
  maxHeight: '90vh', // pour éviter les coupures verticales
  panelClass: 'custom-modal-panel'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadChambres(); // recharge la liste
    }
  });
}
searchTerm: string = '';
statutFiltre: string = '';
typeFiltre: string = '';
chambresFiltrees: any[] = [];

filtrerChambres(): void {
  this.chambresFiltrees = this.chambres.filter(chambre => {
    const matchSearch = this.searchTerm === '' || 
      chambre.numero.includes(this.searchTerm) || 
      chambre.type.toLowerCase().includes(this.searchTerm.toLowerCase());

    const matchStatut = this.statutFiltre === '' || chambre.statut === this.statutFiltre;
    const matchType = this.typeFiltre === '' || chambre.type === this.typeFiltre;

    return matchSearch && matchStatut && matchType;
  });
}




}
