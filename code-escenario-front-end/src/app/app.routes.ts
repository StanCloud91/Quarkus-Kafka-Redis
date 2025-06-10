import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { RolListComponent } from './components/rol-list/rol-list.component';
import { PermisoListComponent } from './components/permiso-list/permiso-list.component';
import { EndpointListComponent } from './components/endpoint-list/endpoint-list.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    canActivate: [authGuard],
    children: [
      { path: 'products', component: ProductListComponent },
      { path: 'users', component: UserListComponent },
      { path: 'roles', component: RolListComponent },
      { path: 'permissions', component: PermisoListComponent },
      { path: 'endpoints', component: EndpointListComponent },
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
