import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';

import { ConsommationService,  CreateConsommationDto } from '../../services/consommation.service';
import { ProduitService } from '../../services/produit.service';
import { FicheSejour } from '../../services/fiche-sejour.service';
import { Consommation } from '../../models/consommation.model';
import { Produit } from '../../models/produit.model';

@Component({
  selector: 'app-fiche-sejour',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fiche-sejour.component.html',
  styleUrls: ['./fiche-sejour.component.scss']
})
export class FicheSejourComponent implements OnInit {
  public consommations: Consommation[] = [];
  public produitsDisponibles: Produit[] = [];
  public ficheSejour: FicheSejour;
  
  // Modèle pour le formulaire, représentant un seul article à ajouter
  public nouvelArticle = {
    produitId: null,
    quantite: 1
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { ficheSejour: FicheSejour },
    private consommationService: ConsommationService,
    private produitService: ProduitService
  ) {
    this.ficheSejour = data.ficheSejour;
  }

  ngOnInit(): void {
    this.chargerConsommations();
    this.chargerProduits();
  }

  chargerConsommations(): void {
    if (this.ficheSejour && this.ficheSejour.id) {
      this.consommationService.getByFicheSejourId(this.ficheSejour.id).subscribe(data => {
        this.consommations = data;
      });
    }
  }

  chargerProduits(): void {
    this.produitService.getAll().subscribe(data => {
      // Le type Produit est désormais cohérent avec celui de ConsommationService
      //this.produitsDisponibles = data;
    });
  }

  ajouterConsommation(form: NgForm): void {
    if (form.invalid || !this.ficheSejour?.id) {
      return;
    }

    // Création du DTO en conformité avec la nouvelle structure du backend
    const dto: CreateConsommationDto = {
      ficheId: this.ficheSejour.id,
      articles: [/* {
        nom:'',

        produitId: this.nouvelArticle.produitId!,
        quantite: this.nouvelArticle.quantite
      }*/]
    };

    this.consommationService.ajouter(dto).pipe(
      // Utilisation de switchMap pour recharger les données après un succès
      switchMap(() => this.consommationService.getByFicheSejourId(this.ficheSejour.id!))
    ).subscribe(updatedConsommations => {
      this.consommations = updatedConsommations;
      form.resetForm({ quantite: 1 }); // Réinitialiser le formulaire
    });
  }

  supprimerConsommation(id: number): void {
    this.consommationService.supprimer(id).pipe(
      // Recharger la liste après la suppression
      switchMap(() => this.consommationService.getByFicheSejourId(this.ficheSejour.id!))
    ).subscribe(updatedConsommations => {
      this.consommations = updatedConsommations;
    });
  }

  getTotalConsommations(): number {
    return this.consommations.reduce((acc, curr) => acc + curr.montantTotal, 0);
  }
}
