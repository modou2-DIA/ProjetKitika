import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
interface Plat {
  nom: string;
  description: string;
  prix: number;
  categorie: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  imports:[CommonModule]
})
export class MenuComponent {
  plats: Plat[] = [
    { nom: 'Poulet Yassa', description: 'Poulet mariné au citron et oignons, servi avec du riz.', prix: 3500, categorie: 'Plat principal' },
    { nom: 'Salade César', description: 'Salade croquante, poulet grillé, parmesan, croûtons.', prix: 2500, categorie: 'Entrée' },
    { nom: 'Café Expresso', description: 'Petit noir serré, idéal après le repas.', prix: 500, categorie: 'Boisson' }
  ];
}
