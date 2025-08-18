import { Produit } from './produit.model';

export interface Article {
  id?: number;
  quantite: number;
  nom: string;
  type: string;
  prixUnitaire: number;
  prixTotal?: number;

  
}

  

 