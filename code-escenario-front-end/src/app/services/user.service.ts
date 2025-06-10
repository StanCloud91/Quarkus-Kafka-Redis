import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Rol } from '../interfaces/rol.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private transformUserResponse(user: any): User {
    if (typeof user.rol === 'string') {
      // Si el rol viene como string, creamos un objeto rol con el nombre
      return {
        ...user,
        rol: {
          id: user.rol_id, // Asumimos que el backend envía el ID del rol
          name: user.rol,
          estado: true
        } as Rol
      };
    } else if (user.rol && !user.rol.id && user.rol_id) {
      // Si el rol es un objeto pero no tiene ID y existe rol_id
      return {
        ...user,
        rol: {
          ...user.rol,
          id: user.rol_id
        }
      };
    }
    return user;
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map(users => {
          console.log('Usuarios antes de transformar:', users);
          const transformedUsers = users.map(user => this.transformUserResponse(user));
          console.log('Usuarios después de transformar:', transformedUsers);
          return transformedUsers;
        })
      );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(user => this.transformUserResponse(user))
      );
  }

  createUser(user: User): Observable<User> {
    const payload = {
      ...user,
      rol_id: user.rol?.id // Aseguramos que se envíe el ID del rol
    };
    return this.http.post<any>(this.apiUrl, payload, { headers: this.getHeaders() })
      .pipe(
        map(user => this.transformUserResponse(user))
      );
  }

  updateUser(id: number, user: User): Observable<User> {
    const payload = {
      ...user,
      rol_id: user.rol?.id // Aseguramos que se envíe el ID del rol
    };
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload, { headers: this.getHeaders() })
      .pipe(
        map(user => this.transformUserResponse(user))
      );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  deleteUsers(ids: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/delete`, ids, { headers: this.getHeaders() });
  }
} 