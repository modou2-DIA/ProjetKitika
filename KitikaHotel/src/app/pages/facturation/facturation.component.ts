import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'; // Import pour accéder aux paramètres de l'URL
import { FactureService, Facture } from '../../services/facture.service';

@Component({
  selector: 'app-facturation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facturation.component.html',
  styleUrl: './facturation.component.scss'
})
export class FacturationComponent implements OnInit {
  searchClient: string = '';
  filtrePaiement: string = '';
  factures: Facture[] = [];
  facturesFiltrees: Facture[] = [];
  factureUnique: Facture | null = null; // Nouvelle variable pour une seule facture

  constructor(
    private factureService: FactureService,
    private route: ActivatedRoute // Injection du service ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Vérifier si un ID de facture est passé dans l'URL
    this.route.paramMap.subscribe(params => {
      const factureId = params.get('id');
      if (factureId) {
        this.chargerFactureUnique(+factureId);
      } else {
        this.chargerFactures();
      }
    });
  }

  chargerFactureUnique(id: number): void {
    this.factureService.getById(id).subscribe(facture => {
      this.factureUnique = facture;
      // On peut aussi afficher la facture dans le tableau pour la cohérence
      this.factures = [facture];
      this.filtrerFactures();
    });
  }

  chargerFactures(): void {
    this.factureService.getAll().subscribe(data => {
      this.factures = data;
      this.factureUnique = null; // Réinitialiser si on charge toutes les factures
      this.filtrerFactures();
    });
  }

  filtrerFactures(): void {
    this.facturesFiltrees = this.factures.filter(f => {
      const matchPaiement = this.filtrePaiement === '' || f.payee.toString() === this.filtrePaiement;
      const matchClient =
        this.searchClient === '' ||
        f.client?.nom?.toLowerCase().includes(this.searchClient.toLowerCase()) ||
        f.client?.prenom?.toLowerCase().includes(this.searchClient.toLowerCase());
      return matchPaiement && matchClient;
    });
  }

  genererPDF(facture: Facture): void {
    if (facture.id !== undefined) {
      this.factureService.genererPDF(facture.id);
    } else {
      console.error("Erreur : l'identifiant de la facture est manquant.");
    }
  }

  payerFacture(facture: Facture): void {
    if (confirm('Confirmer le règlement de la facture ?')) {
      if (facture.id !== undefined) {
        this.factureService.marquerCommePayee(facture.id).subscribe(() => {
          facture.payee = true;
          this.filtrerFactures(); // mettre à jour la liste filtrée
        });
      } else {
        console.error("Erreur : l'identifiant de la facture est manquant.");
      }
    }
  }
}
