import { Component } from '@angular/core';
import { CommonModule  } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

interface Client {
  nom: string;
  tel: string;
  email: string;
  type: 'particulier' | 'societe';
}

@Component({
  selector: 'app-clients',
  imports: [CommonModule,FormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  recherche: string = '';
  filtreType: string = '';

  clients: Client[] = [
    { nom: 'Jean Dupont', tel: '+221700112233', email: 'jean@gmail.com', type: 'particulier' },
    { nom: 'Société AgroTech', tel: '+221701122334', email: 'contact@agrotech.com', type: 'societe' },
    { nom: 'Fatou Diouf', tel: '+221702233445', email: 'fatou@gmail.com', type: 'particulier' },
    { nom: 'Société TransportX', tel: '+221703344556', email: 'contact@transportx.com', type: 'societe' }
  ];

  filtrerClients(): Client[] {
    return this.clients.filter(c =>
      (!this.filtreType || c.type === this.filtreType) &&
      (!this.recherche || c.nom.toLowerCase().includes(this.recherche.toLowerCase()))
    );
  }

  voirClient(client: Client): void {
    alert(`Détail client : ${client.nom}`);
  }

  supprimerClient(client: Client): void {
    this.clients = this.clients.filter(c => c !== client);
  }
}