import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MenubarModule,
    SidebarModule,
    ButtonModule,
    PanelMenuModule
  ],
  template: `
    <div class="layout-wrapper" *ngIf="authService.isLoggedIn()">
      <div class="layout-sidebar">
        <div class="sidebar-header">
          <h2>Poseidon</h2>
        </div>
        <p-panelMenu [model]="menuItems" [style]="{'width':'100%', 'border': 'none'}"></p-panelMenu>
      </div>

      <div class="layout-main">
        <div class="layout-topbar">
          <button pButton icon="pi pi-user" label="Cerrar Sesión" 
                  class="p-button-text" (click)="logout()">
          </button>
        </div>
        <div class="layout-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>

    <router-outlet *ngIf="!authService.isLoggedIn()"></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
    }
    .layout-wrapper {
      display: flex;
      min-height: 100vh;
    }
    .layout-sidebar {
      width: 250px;
      background-color: var(--surface-overlay);
      border-right: 1px solid var(--surface-border);
      display: flex;
      flex-direction: column;
    }
    .sidebar-header {
      padding: 1rem;
      border-bottom: 1px solid var(--surface-border);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sidebar-header h2 {
      margin: 0;
      color: var(--primary-color);
    }
    .layout-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .layout-topbar {
      background-color: var(--surface-overlay);
      padding: 0.5rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      border-bottom: 1px solid var(--surface-border);
    }
    .layout-content {
      flex: 1;
      padding: 2rem;
      background-color: var(--surface-ground);
    }
    :host ::ng-deep {
      .p-panelmenu {
        .p-panelmenu-header-link {
          padding: 1rem;
          &:focus {
            box-shadow: none;
          }
        }
        .p-menuitem-link {
          padding: 0.75rem 1rem;
        }
      }
    }
  `]
})
export class AppComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Menú',
      items: [
        {
          label: 'Productos',
          icon: 'pi pi-box',
          routerLink: '/products'
        },
        {
          label: 'Usuarios',
          icon: 'pi pi-users',
          routerLink: '/users'
        },
        {
          label: 'Roles',
          icon: 'pi pi-id-card',
          routerLink: '/roles'
        },
        {
          label: 'Permisos',
          icon: 'pi pi-lock',
          routerLink: '/permissions'
        },
        {
          label: 'Endpoints',
          icon: 'pi pi-link',
          routerLink: '/endpoints'
        }
      ]
    }
  ];

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
