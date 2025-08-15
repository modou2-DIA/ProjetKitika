import { Component, OnInit } from '@angular/core';
import { AuditLogService, AuditLog } from '../../services/audit-log.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss']
})
export class AuditLogComponent implements OnInit {
  logs: AuditLog[] = [];
  total = 0;
  page = 0;
  size = 20;

  from: string | null = null;
  to: string | null = null;
  action = '';
  tableName = '';
  utilisateur = '';

  sortBy = 'dateHeure';
  dir = 'DESC';

  loading = false;

  constructor(private service: AuditLogService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.service.search({
      from: this.from || '',
      to: this.to || '',
      action: this.action,
      tableName: this.tableName,
      utilisateur: this.utilisateur,
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      dir: this.dir
    }).subscribe({
      next: (res) => {
        this.logs = res.content || res;
        this.total = res.totalElements ?? this.logs.length;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  clearFilters() {
    this.from = null; this.to = null; this.action = ''; this.tableName = ''; this.utilisateur = '';
    this.page = 0;
    this.load();
  }

  prev() { if (this.page > 0) { this.page--; this.load(); } }
  next() { this.page++; this.load(); }
}
