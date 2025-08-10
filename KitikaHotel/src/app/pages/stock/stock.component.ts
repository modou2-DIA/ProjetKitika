import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduitService, Produit } from '../../services/produit.service';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  stock: Produit[] = [];
  criticalItems: Produit[] = [];
  showModal: boolean = false;
  isEditMode: boolean = false;
  form!: FormGroup;
  produitEnEdition?: Produit;

  constructor(private fb: FormBuilder,private produitService: ProduitService) {}

  ngOnInit(): void {
    this.chargerStock();
    this.initForm();
  }
    initForm(): void {
    this.form = this.fb.group({
      id: [],
      nom: ['', Validators.required],
      type: ['', Validators.required],
      stock: [0, Validators.required],
      seuilCritique: [0, Validators.required],
      prixUnitaire: [0, Validators.required]
    });
  }

  chargerStock(): void {
    this.produitService.getAll().subscribe({
      next: (data: Produit[]) => {
        this.stock = data;
        this.criticalItems = this.stock.filter(p => p.stock < p.seuilCritique);
      },
      error: () => {
        console.error("Erreur lors du chargement du stock.");
      }
    });
  }

  commander(produit: Produit): void {
    // Ce code est fictif, ici tu peux appeler une route API pour passer commande
    alert(`Commande en cours pour le produit : ${produit.nom}`);

    // Exemple d’appel vers un backend si tu crées une API de commande :
    // this.produitService.commanderProduit(produit.id).subscribe(...)
  }

  supprimerProduit(id: number): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      this.produitService.delete(id).subscribe(() => {
        this.chargerStock();
      });
    }
  }

ajouterProduit(): void {
    this.isEditMode = false;
    this.produitEnEdition = undefined;
    this.form.reset();
    this.showModal = true;
  }

  modifierProduit(produit: Produit): void {
    this.isEditMode = true;
    this.produitEnEdition = produit;
    this.form.patchValue(produit);
    this.showModal = true;
  }

  fermer(): void {
    this.showModal = false;
    this.form.reset();
  }

  soumettre(): void {
    if (this.form.valid) {
      const produit = this.form.value;
      if (this.isEditMode) {
        this.produitService.update( produit).subscribe(() => {
          this.chargerStock();
          this.fermer();
        });
      } else {
        this.produitService.create(produit).subscribe(() => {
          this.chargerStock();
          this.fermer();
        });
      }
    }
  }

  
}
