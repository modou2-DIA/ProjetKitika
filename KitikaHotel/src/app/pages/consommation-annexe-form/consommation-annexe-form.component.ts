// src/app/components/consommation-annexe-form/consommation-annexe-form.component.ts
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ArticleInput {
  nom: string;
  quantite: number;
  prixUnitaire: number;
}

@Component({
  selector: 'app-consommation-annexe-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consommation-annexe-form.component.html'
})
export class ConsommationAnnexeFormComponent {
  description = '';
  items: ArticleInput[] = [
    { nom: '', quantite: 1, prixUnitaire: 0 }
  ];

  error = '';

  presets = [
    'Piscine - Accès journalier',
    'Pressing - Lavage',
    'Pressing - Repassage',
    'Spa - Massage 30min',
    'Navette Aéroport',
    'Mini-bar',
    'Late checkout'
  ];

  constructor(
    public dialogRef: MatDialogRef<ConsommationAnnexeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ficheId: number }
  ) {}

  addItem() {
    this.items.push({ nom: '', quantite: 1, prixUnitaire: 0 });
  }

  removeItem(i: number) {
    this.items.splice(i, 1);
    if (this.items.length === 0) this.addItem();
  }

  save() {
    this.error = '';

    const invalid = this.items.some(
      it => !it.nom.trim() || it.quantite <= 0 || it.prixUnitaire <= 0
    );
    if (invalid) {
      this.error = 'Chaque article doit avoir un nom, une quantité > 0 et un prix > 0.';
      return;
    }

    const dto = {
      ficheId: this.data.ficheId,
      type: 'ANNEXE',            // 🔒 Forcé côté réception
      description: this.description?.trim() || undefined,
      articles: this.items.map(it => ({
        nom: it.nom.trim(),
        quantite: it.quantite,
        prixUnitaire: it.prixUnitaire
      }))
    };

    this.dialogRef.close(dto);
  }

  close() {
    this.dialogRef.close();
  }
}
