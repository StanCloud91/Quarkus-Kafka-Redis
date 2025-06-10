import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="login-container">
      <p-toast></p-toast>
      <p-card header="Iniciar Sesión" styleClass="login-card">
        <div class="p-fluid">
          <div class="field">
            <label for="username">Usuario</label>
            <input pInputText id="username" [(ngModel)]="username" />
          </div>
          <div class="field">
            <label for="password">Contraseña</label>
            <p-password id="password" [(ngModel)]="password" [toggleMask]="true"></p-password>
          </div>
          <p-button label="Iniciar Sesión" (onClick)="onLogin()" [loading]="loading"></p-button>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: var(--surface-ground);
    }
    .login-card {
      width: 100%;
      max-width: 30rem;
    }
    .field {
      margin-bottom: 1.5rem;
    }
  `]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  onLogin(): void {
    if (!this.username || !this.password) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor ingrese usuario y contraseña'
      });
      return;
    }

    this.loading = true;
    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Inicio de sesión exitoso'
          });
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Credenciales inválidas'
          });
          this.loading = false;
        }
      });
  }
} 