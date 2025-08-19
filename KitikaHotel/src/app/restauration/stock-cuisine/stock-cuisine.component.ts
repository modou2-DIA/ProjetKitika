import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
interface StockItem {
  nom: string;
  quantite: number;
  unite: string;
}

@Component({
  selector: 'app-stock-cuisine',
  templateUrl: './stock-cuisine.component.html',
  imports:[CommonModule]
})
export class StockCuisineComponent {
  stock: StockItem[] = [
    { nom: 'Riz', quantite: 50, unite: 'kg' },
    { nom: 'Poulet', quantite: 20, unite: 'pièces' },
    { nom: 'Huile', quantite: 15, unite: 'L' },
    { nom: 'Tomates', quantite: 30, unite: 'kg' }
  ];
}
