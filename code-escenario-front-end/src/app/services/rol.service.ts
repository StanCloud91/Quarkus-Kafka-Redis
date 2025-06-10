import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from '../interfaces/rol.interface';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private apiUrl = 'http://localhost:8080/roles';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getRol(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createRol(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(this.apiUrl, rol, { headers: this.getHeaders() });
  }

  updateRol(id: number, rol: Rol): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/${id}`, rol, { headers: this.getHeaders() });
  }

  deleteRol(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  deleteRoles(ids: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/delete`, ids, { headers: this.getHeaders() });
  }
} 