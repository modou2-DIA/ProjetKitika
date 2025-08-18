import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, finalize } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { ProduitService } from '../../services/produit.service';
import {  FicheClientService } from '../../services/fiche-client.service';
import { ConsommationService, CreateConsommationDto } from '../../services/consommation.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { Consommation } from '../../models/consommation.model';
import { Article } from '../../models/article.model';
import { AbstractControl } from '@angular/forms';
import { Produit } from '../../models/produit.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FicheClient } from '../../models/fiche-client.model';

@Component({
  selector: 'app-consommations',
  templateUrl: './gestion-restauration.component.html',
  styleUrls: ['./gestion-restauration.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule, 
    MatDialogModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GestionRestaurationComponent implements OnInit, OnDestroy {
  consommations: Consommation[] = [];
  fichesClients: FicheClient[] = [];
  produits: Produit[] = [];
  ficheSelectionneeId: number | null = null;
  ficheSelectionnee: FicheClient | null = null;


  formConsommation!: FormGroup; // ✅ Ajout du ! pour indiquer l'initialisation différée
  consommationDetaillee: Consommation | null = null;
  currentConsommationId: number | null = null;
  totalVentes: number = 0;
  stockAlerts: string[] = [];
  serviceStats: { service: string; total: number }[] = [];

  loading = false;
  isEditMode = false;

  clientFilterTerm = '';
  private clientFilterSubject = new BehaviorSubject<string>('');
  private subscriptions = new Subscription();

  @ViewChild('modalAjout') modalAjout!: TemplateRef<any>;
  @ViewChild('modalDetailsConsommation') modalDetailsConsommation!: TemplateRef<any>;
  @ViewChild('modalConfirmationSuppression') modalConfirmationSuppression!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private consommationService: ConsommationService,
    private produitService: ProduitService,
    private ficheClientService: FicheClientService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef // ✅ Ajout du ChangeDetectorRef
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.chargerProduits();
    this.chargerFichesClients();
    
    // ✅ Correction de la subscription pour le filtre client
    this.subscriptions.add(
      this.clientFilterSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(term => {
        this.clientFilterTerm = term.toLowerCase();
        this.cdr.markForCheck(); // ✅ Trigger change detection
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // ✅ Correction complète de l'initialisation du formulaire
  private initForm(): void {
    this.formConsommation = this.fb.group({
      description: [''],
      articles: this.fb.array([], Validators.required) // ✅ Ajout validation requise
    });

    // ✅ Correction de la subscription pour les changements d'articles
    this.subscriptions.add(
      this.formConsommation.get('articles')?.valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged()
      ).subscribe(() => {
        this.cdr.markForCheck(); // ✅ Déclencher la détection des changements
      })
    );
  }

  get articlesFormArray(): FormArray {
    return this.formConsommation.get('articles') as FormArray;
  }

  // ✅ Correction de l'ajout de ligne d'article
  ajouterLigneArticle(): void {
    const articleForm = this.fb.group({
      produitId: [null, Validators.required],
      quantite: [1, [Validators.required, Validators.min(1), Validators.max(999)]]
    });

    // ✅ Ajout de subscription pour chaque article
    this.subscriptions.add(
      articleForm.valueChanges.pipe(
        debounceTime(100)
      ).subscribe(() => {
        this.cdr.markForCheck(); // ✅ Mettre à jour l'affichage
      })
    );

    this.articlesFormArray.push(articleForm);
    this.cdr.markForCheck(); // ✅ Force la mise à jour
  }

  supprimerLigneArticle(index: number): void {
    this.articlesFormArray.removeAt(index);
    this.cdr.markForCheck(); // ✅ Force la mise à jour
  }

  // ✅ Correction du calcul des totaux
  articleTotal(article: FormGroup): number {
    const produitId = article.get('produitId')?.value;
    const quantite = article.get('quantite')?.value || 0;
    
    if (!produitId || quantite <= 0) {
      return 0;
    }
    
    const produit = this.produits.find(p => p.id === Number(produitId));
    return produit ? (produit.prixUnitaire * quantite) : 0;
  }

  // ✅ Correction du total global
  get consommationTotal(): number {
    if (!this.articlesFormArray || this.articlesFormArray.length === 0) {
      return 0;
    }
    
    return this.articlesFormArray.controls
      .map(ctrl => this.articleTotal(ctrl as FormGroup))
      .reduce((acc, val) => acc + val, 0);
  }

  // ✅ Correction du chargement des données
  chargerProduits(): void {
    this.loading = true;
    this.produitService.getAll().subscribe({
      next: (data: Produit[]) => {
        this.produits = data;
        this.cdr.markForCheck();
        this.loading = false;
      },
      error: (err: unknown) => {
        console.error('Erreur chargement produits', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  chargerFichesClients(): void {
    this.ficheClientService.getAll().subscribe({
      next: (data: FicheClient[]) => {
        this.fichesClients = data.filter(f => f.statut === 'En cours');
        this.cdr.markForCheck();
      },
      error: (err: unknown) => console.error('Erreur chargement fiches clients', err)
    });
  }

  chargerConsommations(): void {
    if (!this.ficheSelectionneeId) return;
    this.ficheSelectionnee = this.fichesClients.find(f => f.id === this.ficheSelectionneeId) || null;

    this.loading = true;
    
    this.consommationService.getByFicheSejourId(this.ficheSelectionneeId).subscribe({
      next: (data: Consommation[]) => {
        this.consommations = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        console.error('Erreur chargement consommations', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // ✅ Correction de la création de FormGroup pour les articles
  private createArticleFormGroup(article?: Article): FormGroup {
    const produitId = article?.id || null;
    const quantite = article?.quantite || 1;
    
    const formGroup = this.fb.group({
      produitId: [produitId, Validators.required],
      quantite: [quantite, [
        Validators.required, 
        Validators.min(1),
        Validators.max(100)
      ]]
    });

    // ✅ Ajout de la subscription pour les changements
    this.subscriptions.add(
      formGroup.valueChanges.subscribe(() => {
        this.cdr.markForCheck();
      })
    );

    return formGroup;
  }

  // Recherche - pas de changement nécessaire
  onFilterChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.clientFilterSubject.next(value);
  }

  get fichesClientsFiltrees(): FicheClient[] {
    if (!this.clientFilterTerm) return this.fichesClients;
    return this.fichesClients.filter(
      c =>
        c.reservation.client.nom.toLowerCase().includes(this.clientFilterTerm) ||
        c.reservation.client.prenom.toLowerCase().includes(this.clientFilterTerm)||
        c.reservation.chambre.numero
    );
  }

  // ✅ Correction des modales
  ouvrirModalAjout(): void {
    this.isEditMode = false;
    this.currentConsommationId = null;
    
    // ✅ Reset complet du formulaire
    this.formConsommation.reset();
    this.articlesFormArray.clear();
    
    // ✅ Ajout d'une ligne par défaut
    this.ajouterLigneArticle();
    
    this.dialog.open(this.modalAjout, { width: '700px', maxHeight: '90vh' });
  }

  ouvrirModalDetails(c: Consommation): void {
    this.consommationDetaillee = c;
    this.dialog.open(this.modalDetailsConsommation, { width: '700px' });
  }

  fermerModalDetails(): void {
    this.dialog.closeAll();
  }

  // ✅ Correction de la modification
  modifierConsommation(c: Consommation): void {
    this.isEditMode = true;
    this.currentConsommationId = c.id || null;
    
    // ✅ Reset et configuration du formulaire
    this.formConsommation.patchValue({
      description: c.description || ''
    });

    // ✅ Clear et reconstruction des articles
    this.articlesFormArray.clear();
    
    if (c.articles && c.articles.length > 0) {
      c.articles.forEach((article: Article) => {
        const articleFormGroup = this.createArticleFormGroup(article);
        this.articlesFormArray.push(articleFormGroup);
      });
    } else {
      // ✅ Si pas d'articles, en ajouter un par défaut
      this.ajouterLigneArticle();
    }

    this.cdr.markForCheck();
    this.dialog.open(this.modalAjout, { width: '700px', maxHeight: '90vh' });
  }

  confirmerSuppression(id: number): void {
    this.currentConsommationId = id;
    this.dialog.open(this.modalConfirmationSuppression, { width: '400px' });
  }

  supprimerConsommation(): void {
    if (!this.currentConsommationId) return;
    
    this.loading = true;
    this.consommationService
      .supprimer(this.currentConsommationId)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
          this.dialog.closeAll();
          this.chargerConsommations();
        })
      )
      .subscribe();
  }

  // ✅ CORRECTION MAJEURE: Gestion complète de la soumission avec diagnostic approfondi
  gererConsommation(): void {
    console.log('🔍 === DÉBUT DIAGNOSTIC SOUMISSION ===');
    
    // 1️⃣ Diagnostic complet de l'état du formulaire
    console.log('📋 Formulaire principal:', {
      valid: this.formConsommation.valid,
      invalid: this.formConsommation.invalid,
      value: this.formConsommation.value,
      errors: this.formConsommation.errors,
      status: this.formConsommation.status
    });

    // 2️⃣ Diagnostic du FormArray articles
    console.log('📦 Articles FormArray:', {
      length: this.articlesFormArray.length,
      valid: this.articlesFormArray.valid,
      value: this.articlesFormArray.value,
      controls: this.articlesFormArray.controls.map((ctrl, index) => ({
        index,
        valid: ctrl.valid,
        value: ctrl.value,
        errors: ctrl.errors,
        status: ctrl.status
      }))
    });

    // 3️⃣ Diagnostic des produits disponibles
    console.log('🛍️ Produits chargés:', this.produits.length, this.produits.map(p => ({ id: p.id, nom: p.nom, prix: p.prixUnitaire })));

    // 4️⃣ Diagnostic de la fiche sélectionnée
    console.log('👤 Fiche sélectionnée:', this.ficheSelectionneeId);

    // ✅ Validation améliorée avec détails
    if (this.formConsommation.invalid) {
      console.error('❌ FORMULAIRE INVALIDE - Détails:');
      console.error('Erreurs formulaire principal:', this.formConsommation.errors);
      
      this.articlesFormArray.controls.forEach((ctrl, index) => {
        if (ctrl.invalid) {
          console.error(`Erreurs article ${index}:`, ctrl.errors);
          Object.keys(ctrl.events).forEach(key => {
            const control = ctrl.get(key);
            if (control?.invalid) {
              console.error(`  - ${key}:`, control.errors, 'valeur:', control.value);
            }
          });
        }
      });
      
      this.formConsommation.markAllAsTouched();
      this.articlesFormArray.controls.forEach(ctrl => ctrl.markAllAsTouched());
      return;
    }

    if (!this.ficheSelectionneeId) {
      console.error('❌ Pas de fiche client sélectionnée');
      return;
    }

    // ✅ Validation des articles avec détails
    if (this.articlesFormArray.length === 0) {
      console.error('❌ Aucun article dans le formulaire');
      return;
    }

    this.loading = true;
    this.cdr.markForCheck();

    const formValue = this.formConsommation.value;
    console.log('📄 Valeurs extraites du formulaire:', formValue);
    
    let action$;
    if (this.isEditMode && this.currentConsommationId) {
      // ✅ Mode modification avec validation renforcée
      console.log('🔄 MODE MODIFICATION');
      
      const articlesValides = formValue.articles.filter((a: any) => a.produitId && a.quantite > 0);
      console.log('📦 Articles valides pour modification:', articlesValides);
      
      const consommationAModifier: Consommation = {
        id: this.currentConsommationId,
        type:'RESTAURATION',
        date: new Date().toISOString(),
        description: formValue.description || '',
        articles: articlesValides.map((formArticle: any, index: number) => {
          console.log(`🔍 Traitement article ${index}:`, formArticle);
          
          const produitId = Number(formArticle.produitId);
          const quantite = Number(formArticle.quantite);
          
          const produit = this.produits.find(p => p.id === produitId);
          if (!produit) {
            console.error(`❌ Produit introuvable pour l'ID: ${produitId}`);
            throw new Error(`Produit introuvable pour l'ID: ${produitId}`);
          }
          
          const article = {
            nom:produit.nom,
            prixUnitaire: produit.prixUnitaire,
            type: produit.type,
            quantite: quantite,
            prixTotal: produit.prixUnitaire * quantite
          } as Article;
          
          console.log(`✅ Article ${index} créé:`, article);
          return article;
        }),
        montantTotal: this.consommationTotal
      };
      
      console.log('📋 Consommation finale à modifier:', consommationAModifier);
      action$ = this.consommationService.modifier(this.currentConsommationId, consommationAModifier);
      
    } else {
      // ✅ Mode création avec DTO corrigé selon le backend
      console.log('➕ MODE CRÉATION');
      
      // Filtrer et valider les articles
      const articlesValides = formValue.articles.filter((a: any) => {
        const isValid = a.produitId && a.quantite > 0;
        if (!isValid) {
          console.warn('⚠️ Article invalide ignoré:', a);
        }
        return isValid;
      });
      
      console.log('📦 Articles valides pour création:', articlesValides);
      
      if (articlesValides.length === 0) {
        console.error('❌ Aucun article valide trouvé');
        this.loading = false;
        this.cdr.markForCheck();
        return;
      }
      
      // ✅ DTO corrigé pour correspondre au backend
      const dto: CreateConsommationDto = {
        ficheId: this.ficheSelectionneeId,
        type: 'RESTAURATION', // ✅ Ajout du type requis
        description: formValue.description || '',
        articles: articlesValides.map((a: any, index: number) => {
          console.log(`🔍 Traitement article création ${index}:`, a);
          
          const produitId = Number(a.produitId);
          const quantite = Number(a.quantite);
          
          // Trouver le produit pour récupérer nom et prix
          const produit = this.produits.find(p => p.id === produitId);
          if (!produit) {
            console.error(`❌ Produit inexistant pour ID: ${produitId}`);
            throw new Error(`Produit inexistant pour ID: ${produitId}`);
          }
          
          // ✅ Article DTO avec les champs requis par le backend
          const articleDto = {
            nom: produit.nom,           // ✅ Nom du produit
            quantite: quantite,
            prixUnitaire: produit.prixUnitaire  // ✅ Prix unitaire
          };
          
          console.log(`✅ Article DTO ${index}:`, articleDto);
          return articleDto;
        })
      };
      
      console.log('📋 DTO final pour création:', dto);
      action$ = this.consommationService.ajouter(dto);
    }
    
    // ✅ Exécution de l'action avec logs détaillés
    console.log('🚀 Lancement de la requête...');
    
    action$.pipe(
      tap((result) => {
        console.log('✅ Réponse du service:', result);
      }),
      switchMap((result) => {
        console.log('🔄 Rechargement des consommations...');
        return this.consommationService.getByFicheSejourId(this.ficheSelectionneeId!);
      }),
      tap((consommations) => {
        console.log('✅ Consommations rechargées:', consommations);
        this.consommations = consommations;
        this.dialog.closeAll();
        this.cdr.markForCheck();
      }),
      catchError(error => {
        console.error('❌ ERREUR DÉTAILLÉE:', {
          message: error.message,
          stack: error.stack,
          error: error
        });
        return of([]);
      }),
      finalize(() => {
        console.log('🏁 Fin de l\'opération');
        this.loading = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (result) => console.log('📈 Observable next:', result),
      error: (error) => console.error('📉 Observable error:', error),
      complete: () => console.log('🎯 Observable complete')
    });
    
    console.log('🔍 === FIN DIAGNOSTIC SOUMISSION ===');
  }

  // ✅ Méthode helper corrigée
  getArticleTotal(article: AbstractControl): number {
    return this.articleTotal(article as FormGroup);
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  // ✅ Méthode de débogage - à supprimer après résolution
  debugFormulaire(): void {
    console.log('=== DEBUG COMPLET FORMULAIRE ===');
    console.log('FormConsommation valid:', this.formConsommation.valid);
    console.log('FormConsommation value:', this.formConsommation.value);
    console.log('FormConsommation getRawValue:', this.formConsommation.getRawValue());
    
    console.log('Articles FormArray length:', this.articlesFormArray.length);
    console.log('Articles FormArray valid:', this.articlesFormArray.valid);
    console.log('Articles FormArray value:', this.articlesFormArray.value);
    console.log('Articles FormArray getRawValue:', this.articlesFormArray.getRawValue());
    
    this.articlesFormArray.controls.forEach((ctrl, index) => {
      const formGroup = ctrl as FormGroup;
      console.log(`Article ${index}:`, {
        valid: formGroup.valid,
        value: formGroup.value,
        rawValue: formGroup.getRawValue(),
        produitId: formGroup.get('produitId')?.value,
        quantite: formGroup.get('quantite')?.value
      });
    });
  }
}