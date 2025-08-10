import { Component } from '@angular/core';
import { ClientService, Client } from '../../services/client.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.scss'],
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class ClientSearchComponent {
  searchTerm = '';
  results: Client[] = [];
  private searchSubject = new Subject<string>();

  constructor(private clientService: ClientService) {
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap(term => this.clientService.searchClients(term))
    ).subscribe(data => {
      this.results = data;
    });
  }

  onSearchChange(term: string) {
    this.searchSubject.next(term);
  }
}
