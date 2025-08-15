import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FactureService, Facture } from '../../services/facture.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogFeedbackComponent } from '../dialog-feedback/dialog-feedback.component';

@Component({
  selector: 'app-facture-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './facture-details.component.html',
  styleUrls: ['./facture-details.component.scss']
   ,
})
export class FactureDetailsComponent implements OnInit {
  facture: Facture | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private factureService: FactureService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.factureService.getById(+id).subscribe({
          next: (data) => {
            this.facture = data;
          },
          error: (err) => {
            this.showErrorModal("Erreur lors du chargement de la facture : " + err.message);
            this.router.navigate(['/']); // Redirection en cas d'erreur
          }
        });
      } else {
        this.showErrorModal("Identifiant de facture manquant.");
        this.router.navigate(['/']);
      }
    });
  } 
  getNombreDeNuits(): number {
    if (this.facture?.reservation?.dateDebut && this.facture?.reservation?.dateFin) {
      const dateArrivee = new Date(this.facture.reservation.dateDebut);
      const dateDepart = new Date(this.facture.reservation.dateFin);
      const diffTime = Math.abs(dateDepart.getTime() - dateArrivee.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays;
    }
    return 0;
  }

  genererPDF(): void {
    if (this.facture?.id) {
      this.factureService.genererPDF(this.facture.id);
    }
  }

  marquerCommePayee(): void {
    if (this.facture?.id) {
      this.factureService.marquerCommePayee(this.facture.id).subscribe({
        next: () => {
          this.showSuccessModal("Facture marquée comme payée avec succès !");
          if (this.facture) {
            this.facture.payee = true;
          }
        },
        error: (err) => {
          this.showErrorModal("Échec de la mise à jour du statut de la facture : " + err.message);
        }
      });
    }
  }

  retour(): void {
    this.router.navigate(['/hebergement']); // Remplacez par votre route de la liste des réservations
  }

  showSuccessModal(message: string) {
    this.dialog.open(DialogFeedbackComponent, {
      width: '400px',
      data: {
        titre: 'Succès 🎉',
        message
      }
    });
  }

  showErrorModal(message: string) {
    this.dialog.open(DialogFeedbackComponent, {
      width: '400px',
      data: {
        titre: 'Erreur ❌',
        message
      }
    });
  }
}
