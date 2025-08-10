import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FicheClientService } from '../../services/fiche-client.service';
import { ProduitService } from '../../services/produit.service';
import { ConsommationService } from '../../services/consommation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-gestion-restauration',
  templateUrl: './gestion-restauration.component.html',
  styleUrls: ['./gestion-restauration.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class GestionRestaurationComponent implements OnInit {
  fichesClients: any[] = [];
  ficheSelectionneeId: number | null = null;
  consommations: any[] = [];
  produits: any[] = [];
  formConsommation!: FormGroup;

  @ViewChild('modalAjout') modalAjout!: TemplateRef<any>;

  constructor(
    private ficheService: FicheClientService,
    private produitService: ProduitService,
    private consommationService: ConsommationService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadFichesClients();
    this.loadProduits();

    this.formConsommation = this.fb.group({
      produitId: [null, Validators.required],
      type: ['', Validators.required],
      description: [''],
      montant: [0, Validators.required]
    });
  }

  loadFichesClients() {
    this.ficheService.getAll().subscribe(data => {
      this.fichesClients = data;
      // Sélectionner la première fiche par défaut si elle existe
      if (this.fichesClients.length > 0) {
        this.ficheSelectionneeId = this.fichesClients[0].id;
        this.chargerConsommations();
      }
    });
  }

  loadProduits() {
    this.produitService.getAll().subscribe(data => {
      this.produits = data;
    });
  }

  chargerConsommations() {
    if (this.ficheSelectionneeId) {
      this.consommationService.getByFicheSejourId(this.ficheSelectionneeId).subscribe(data => {
        this.consommations = data;
      });
    }
  }

  ouvrirModalAjout() {
    if (!this.ficheSelectionneeId) {
      console.error('Aucune fiche client n\'est sélectionnée.');
      return;
    }
    
    this.formConsommation.reset();
    this.dialog.open(this.modalAjout, {
      width: '500px'
    });
  }

  ajouterConsommation() {
    if (this.formConsommation.valid && this.ficheSelectionneeId) {
      const payload = {
        ...this.formConsommation.value,
        ficheId: this.ficheSelectionneeId
      };
      
      this.consommationService.ajouter(payload).pipe(
        // Utilisation de switchMap pour enchaîner l'ajout et la mise à jour
        tap(() => this.dialog.closeAll()),
        switchMap(() => this.consommationService.getByFicheSejourId(this.ficheSelectionneeId!))
      ).subscribe(
        updatedConsommations => {
          this.consommations = updatedConsommations;
        },
        error => {
          console.error('Erreur lors de l\'ajout de la consommation', error);
        }
      );
    }
  }

  supprimerConsommation(id: number) {
    this.consommationService.supprimer(id).pipe(
      // Enchaîner la suppression et la mise à jour de la liste
      switchMap(() => this.consommationService.getByFicheSejourId(this.ficheSelectionneeId!))
    ).subscribe(
      updatedConsommations => {
        this.consommations = updatedConsommations;
      },
      error => {
        console.error('Erreur lors de la suppression de la consommation', error);
      }
    );
  }

  totalVentes: number = 12450;
  serviceStats = [
    { service: 'Petit-déjeuner', total: 45 },
    { service: 'Déjeuner', total: 72 },
    { service: 'Dîner', total: 38 },
  ];
  stockAlerts: string[] = ['Vin rouge', 'Pain complet'];
}
