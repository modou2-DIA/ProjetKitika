import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConsommationService, Consommation, CreateConsommationDto } from '../../services/consommation.service';
import { ProduitService, Produit } from '../../services/produit.service';
import { FicheSejourService,FicheSejour } from '../../services/fiche-sejour.service'; // Assurez-vous que ce service existe

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
  //public ficheSejour: FicheSejour=null; // Assurez-vous que FicheSejour est correctement importé
  public nouvelleConsommation = {
    produitId: null,
    quantite: 1
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { ficheSejour: FicheSejourService },
    private consommationService: ConsommationService,
    private produitService: ProduitService
  ) {
    //this.ficheSejour = data.ficheSejour;
  }

  ngOnInit(): void {
    this.chargerConsommations();
    this.chargerProduits();
  }

  chargerConsommations(): void {
    /*if (this.ficheSejour && this.ficheSejour.id) {
      this.consommationService.getByFicheSejourId(this.ficheSejour.id).subscribe(data => {
        this.consommations = data;
      });
    }*/
  }

  chargerProduits(): void {
    this.produitService.getAll().subscribe(data => {
      this.produitsDisponibles = data;
    });
  }

  ajouterConsommation(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const dto: CreateConsommationDto = {
      ficheSejourId: 2,
      produitId: form.value.produitId,
      quantite: form.value.quantite
    };

    this.consommationService.ajouter(dto).subscribe(() => {
      this.chargerConsommations(); // Recharger la liste après ajout
      form.resetForm({ quantite: 1 }); // Réinitialiser le formulaire
    });
  }

  // Optionnel : Calculer le total pour affichage
  getTotalConsommations(): number {
    return this.consommations.reduce((acc, curr) => acc + curr.prixTotal, 0);
  }
}
