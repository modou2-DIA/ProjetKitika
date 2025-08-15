import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FicheClientService, FicheClient } from '../../services/fiche-client.service';
import { ProduitService, Produit } from '../../services/produit.service';
import { ConsommationService, Consommation, Article } from '../../services/consommation.service';
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
  fichesClients: FicheClient[] = [];
  ficheSelectionneeId: number | null = null;
  consommations: Consommation[] = [];
  produits: Produit[] = [];
  formConsommation!: FormGroup;

  // Nouvelle propriété pour stocker la consommation à afficher dans le modal de détails
  consommationDetaillee: Consommation | null = null;

  // Référence aux templates des modals
  @ViewChild('modalAjout') modalAjout!: TemplateRef<any>;
  @ViewChild('modalDetailsConsommation') modalDetailsConsommation!: TemplateRef<any>;

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

    // Initialisation du formulaire pour gérer la consommation et ses articles
    this.formConsommation = this.fb.group({
      description: [''],
      // FormArray pour gérer les articles dynamiquement
      articles: this.fb.array([this.createArticleFormGroup()])
    });
  }

  // Getter pour accéder facilement au FormArray dans le template
  get articlesFormArray() {
    return this.formConsommation.get('articles') as FormArray;
  }

  // Crée un nouveau FormGroup pour un article
  private createArticleFormGroup(article?: Article): FormGroup {
    return this.fb.group({
      produitId: [article?.produit?.id || null, Validators.required],
      quantite: [article?.quantite || 1, [Validators.required, Validators.min(1)]]
    });
  }

  // Ajoute un FormGroup vide au FormArray pour un nouvel article
  ajouterLigneArticle(): void {
    this.articlesFormArray.push(this.createArticleFormGroup());
  }

  // Supprime un article du FormArray
  supprimerLigneArticle(index: number): void {
    this.articlesFormArray.removeAt(index);
  }

  loadFichesClients() {
    this.ficheService.getAll().subscribe(data => {
      this.fichesClients = data;
      // Sélectionner la première fiche par défaut si elle existe
      if (this.fichesClients.length > 0) {
        // Utilisation de l'opérateur de coalescence des nuls (??)
        // pour s'assurer que ficheSelectionneeId est un 'number' ou 'null'
        this.ficheSelectionneeId = this.fichesClients[0].id ?? null;
        // On ne charge les consommations que si un ID valide est trouvé
        if (this.ficheSelectionneeId) {
          this.chargerConsommations();
        }
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

  // Ouvre le modal d'ajout et réinitialise le formulaire
  ouvrirModalAjout() {
    if (!this.ficheSelectionneeId) {
      console.error('Aucune fiche client n\'est sélectionnée.');
      return;
    }
    
    this.formConsommation.reset();
    this.articlesFormArray.clear(); // S'assurer que le FormArray est vide
    this.ajouterLigneArticle();    // Ajouter une ligne vide par défaut
    this.dialog.open(this.modalAjout, {
      width: '500px'
    });
  }

  // Ouvre le modal de détails
  ouvrirModalDetails(consommation: Consommation) {
    this.consommationDetaillee = consommation;
    this.dialog.open(this.modalDetailsConsommation, {
      width: '600px'
    });
  }

  // Ferme la modal de détails
  fermerModalDetails() {
    this.dialog.closeAll();
  }

  // Prépare et ouvre le formulaire pour la modification d'une consommation
  modifierConsommation(consommation: Consommation) {
    this.ouvrirModalAjout(); // Réutilise la méthode pour ouvrir et réinitialiser le formulaire
    this.formConsommation.patchValue({
      description: consommation.description
    });
    this.articlesFormArray.clear();
    consommation.articles.forEach(article => {
      this.articlesFormArray.push(this.createArticleFormGroup(article));
    });
    // TODO: Implémenter la logique de modification (appeler une méthode de service dédiée)
    console.log('Modification de la consommation:', consommation);
  }

  ajouterConsommation() {
    if (this.formConsommation.valid && this.ficheSelectionneeId) {
      const articlesPayload = this.formConsommation.get('articles')?.value;
      
      const payload = {
        ficheId: this.ficheSelectionneeId,
        description: this.formConsommation.get('description')?.value,
        articles: articlesPayload.map((article: any) => ({
          produitId: article.produitId,
          quantite: article.quantite
        }))
      };

      this.consommationService.ajouter(payload).pipe(
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

  // Données de mock pour l'affichage des statistiques (inchangé)
  totalVentes: number = 12450;
  serviceStats = [
    { service: 'Petit-déjeuner', total: 45 },
    { service: 'Déjeuner', total: 72 },
    { service: 'Dîner', total: 38 },
  ];
  stockAlerts: string[] = ['Vin rouge', 'Pain complet'];
}
