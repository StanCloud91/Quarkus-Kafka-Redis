import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permiso } from '../interfaces/permiso.interface';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {
  private apiUrl = 'http://localhost:8080/permisos';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getPermiso(id: number): Observable<Permiso> {
    return this.http.get<Permiso>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createPermiso(permiso: Permiso): Observable<Permiso> {
    return this.http.post<Permiso>(this.apiUrl, permiso, { headers: this.getHeaders() });
  }

  updatePermiso(id: number, permiso: Permiso): Observable<Permiso> {
    return this.http.put<Permiso>(`${this.apiUrl}/${id}`, permiso, { headers: this.getHeaders() });
  }

  deletePermiso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  deletePermisos(ids: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/delete`, ids, { headers: this.getHeaders() });
  }
} 