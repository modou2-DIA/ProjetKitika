import { Article } from "./article.model";
export interface Consommation {
  id?: number;
  date: string;
  type: string;            // "RESTAURATION" | "ANNEXE"
  description: string;
  articles: Article[];
  montantTotal: number;
}