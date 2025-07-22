import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common'; 

interface StockItem {
  nom: string;
  categorie: string;
  quantite: number;
  seuilCritique: number;
}
@Component({
  selector: 'app-stock',
  imports: [CommonModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})
export class StockComponent implements OnInit {
  stock: StockItem[] = [
    { nom: 'Riz', categorie: 'Cuisine', quantite: 25, seuilCritique: 10 },
    { nom: 'Savon', categorie: 'Hébergement', quantite: 8, seuilCritique: 15 },
    { nom: 'Jus de fruit', categorie: 'Restaurant', quantite: 50, seuilCritique: 20 },
    { nom: 'Serviettes', categorie: 'Hébergement', quantite: 5, seuilCritique: 10 }
  ];

  criticalItems: StockItem[] = [];

  ngOnInit(): void {
    this.criticalItems = this.stock.filter(item => item.quantite < item.seuilCritique);
  }

  commander(item: StockItem): void {
    alert(`Commande lancée pour ${item.nom} !`);
    // TODO: Intégrer appel backend ici
  }
}