import { Component,OnInit ,Inject  } from '@angular/core';
import { ReservationService } from '../../services/reservation.service'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';  
import { MAT_DIALOG_DATA } from '@angular/material/dialog'; // Ajout de l'import manquant

@Component({
  selector: 'app-fiche-sejour',
  imports: [CommonModule,FormsModule],
  templateUrl: './fiche-sejour.component.html',
  styleUrl: './fiche-sejour.component.scss'
})


export class FicheSejourComponent implements OnInit {
  consommations: any[] = [];
  chambre: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private reservationService: ReservationService
  ) {
    this.chambre = data.chambre;
  }

  ngOnInit(): void {
    /*this.reservationService.getFicheSejour(this.chambre.id).subscribe(data => {
      this.consommations = data.consommations;
    });*/
  }
}
