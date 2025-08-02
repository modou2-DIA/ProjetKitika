import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClientService, Client } from '../../services/client.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  recherche: string = '';
  filtreType: string = '';
  clients: Client[] = [];
  nouveauClient: Client = this.getNewClient();
  clientSelectionne: Client | null = null;

  @ViewChild('modalAjoutClient') modalAjoutClient!: TemplateRef<any>;
  @ViewChild('modalVoirClient') modalVoirClient!: TemplateRef<any>;
  @ViewChild('modalConfirmerSuppression') modalConfirmerSuppression!: TemplateRef<any>;

  constructor(private dialog: MatDialog, private clientService: ClientService) {}

  ngOnInit(): void {
    this.chargerClients();
  }

  getNewClient(): Client {
    return {
      nom: '', telephone: '', email: '', type: 'particulier',
      prenom: '', adresse: '', societe: '', nationalite: '', numeroPieceIdentite: ''
    };
  }

  chargerClients() {
    this.clientService.getAll().subscribe(data => this.clients = data);
  }

  filtrerClients(): Client[] {
    return this.clients.filter(c =>
      (!this.filtreType || c.type === this.filtreType) &&
      (!this.recherche || c.nom.toLowerCase().includes(this.recherche.toLowerCase()))
    );
  }

  ouvrirFormulaireAjout(): void {
    this.dialog.open(this.modalAjoutClient);
  }

  voirClient(client: Client): void {
    this.clientSelectionne = client;
    this.dialog.open(this.modalVoirClient);
  }

  supprimerClient(client: Client): void {
    this.clientSelectionne = client;
    this.dialog.open(this.modalConfirmerSuppression);
  }

  confirmerSuppression(): void {
    if (!this.clientSelectionne?.id) return;
   this.clientService.delete(this.clientSelectionne.id!).pipe(
      catchError((error) => {
        alert("Erreur : impossible de supprimer ce client. Il est probablement lié à des réservations ou factures.");
        return of(null);
      })
    ).subscribe(() => {
      this.dialog.closeAll();
      this.chargerClients();
    });

  }

  fermerModal(): void {
    this.dialog.closeAll();
  }

  ajouterClient(): void {
    this.clientService.create(this.nouveauClient).subscribe(() => {
      this.chargerClients();
      this.fermerModal();
      this.nouveauClient = this.getNewClient();
    });
  }
}
