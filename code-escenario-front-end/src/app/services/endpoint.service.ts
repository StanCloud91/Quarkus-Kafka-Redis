import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Endpoint } from '../interfaces/endpoint.interface';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  private apiUrl = 'http://localhost:8080/endpoints';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllEndpoints(): Observable<Endpoint[]> {
    return this.http.get<Endpoint[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getEndpoint(id: number): Observable<Endpoint> {
    return this.http.get<Endpoint>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createEndpoint(endpoint: Endpoint): Observable<Endpoint> {
    return this.http.post<Endpoint>(this.apiUrl, endpoint, { headers: this.getHeaders() });
  }

  updateEndpoint(id: number, endpoint: Endpoint): Observable<Endpoint> {
    return this.http.put<Endpoint>(`${this.apiUrl}/${id}`, endpoint, { headers: this.getHeaders() });
  }

  deleteEndpoint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  deleteEndpoints(ids: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/delete`, ids, { headers: this.getHeaders() });
  }
} 