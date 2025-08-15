import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuditLog {
  id: number;
  action: string;
  tableName: string;
  recordId: string;
  utilisateur: string;
  dateHeure: string;
  details?: string;
}

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private api = 'http://localhost:8080/api/audit';

  constructor(private http: HttpClient) {}

  search(filters: {
    from?: string;
    to?: string;
    action?: string;
    tableName?: string;
    utilisateur?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    dir?: string;
  }): Observable<any> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    });
    return this.http.get<any>(this.api, { params });
  }
}
