import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BaseListComponent } from '../base-list/base-list.component';
import { User } from '../../interfaces/user.interface';
import { Rol } from '../../interfaces/rol.interface';
import { UserService } from '../../services/user.service';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    DropdownModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="card">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="header-container">
        <h1>Gestionar Usuarios</h1>
        <div class="button-container">
          <p-button label="Nuevo" icon="pi pi-plus" (onClick)="showDialog()"></p-button>
          <p-button label="Eliminar" icon="pi pi-trash" [disabled]="!selectedItems?.length" 
                    severity="danger" (onClick)="confirmDeleteSelected()"></p-button>
        </div>
      </div>

      <p-table 
        [value]="items" 
        [paginator]="true" 
        [rows]="10"
        [responsive]="true"
        [(selection)]="selectedItems"
        [rowHover]="true"
        dataKey="id"
        [globalFilterFields]="['username', 'rol.name']"
      >
        <ng-template pTemplate="caption">
          <div class="table-header">
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <input pInputText type="text" (input)="onGlobalFilter($event)" placeholder="Buscar..." />
            </span>
          </div>
        </ng-template>
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 4rem">
              <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
            </th>
            <th pSortableColumn="username">Usuario <p-sortIcon field="username"></p-sortIcon></th>
            <th pSortableColumn="rol.name">Rol <p-sortIcon field="rol.name"></p-sortIcon></th>
            <th style="width: 8rem"></th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-item>
          <tr>
            <td>
              <p-tableCheckbox [value]="item"></p-tableCheckbox>
            </td>
            <td>{{item.username}}</td>
            <td>{{item.rol?.name || 'Sin rol'}}</td>
            <td>
              <div class="action-buttons">
                <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2" 
                        (click)="editItem(item)"></button>
                <button pButton icon="pi pi-trash" class="p-button-rounded p-button-danger" 
                        (click)="confirmDelete(item)"></button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <p-dialog [(visible)]="dialogVisible" [header]="editMode ? 'Editar Usuario' : 'Nuevo Usuario'" 
                [modal]="true" [style]="{width: '450px'}" (onShow)="onDialogShow()">
        <div class="p-fluid">
          <div class="field">
            <label for="username">Usuario</label>
            <input pInputText id="username" [(ngModel)]="selectedItem.username" required />
          </div>
          <div class="field" *ngIf="!editMode">
            <label for="password">Contraseña</label>
            <input pInputText id="password" type="password" [(ngModel)]="selectedItem.password" required />
          </div>
          <div class="field">
            <label for="rol">Rol</label>
            <p-dropdown id="rol" 
                       [options]="roles" 
                       [(ngModel)]="selectedItem.rol" 
                       optionLabel="name"
                       [filter]="true" 
                       filterBy="name" 
                       placeholder="Seleccione un rol"
                       [showClear]="true"
                       [style]="{'width':'100%'}"
                       required></p-dropdown>
          </div>
        </div>
        <ng-template pTemplate="footer">
          <button pButton label="Cancelar" icon="pi pi-times" class="p-button-text" 
                  (click)="hideDialog()"></button>
          <button pButton label="Guardar" icon="pi pi-check" (click)="saveItem()"></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .button-container {
      display: flex;
      gap: 0.5rem;
    }
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
    }
    .action-buttons {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }
    .field {
      margin-bottom: 1.5rem;
    }
  `]
})
export class UserListComponent extends BaseListComponent implements OnInit {
  override items: User[] = [];
  override selectedItems: User[] = [];
  override selectedItem: User = {
    username: '',
    password: '',
    rol: undefined
  };
  roles: Rol[] = [];

  constructor(
    messageService: MessageService,
    confirmationService: ConfirmationService,
    private userService: UserService,
    private rolService: RolService
  ) {
    super(messageService, confirmationService);
  }

  override ngOnInit(): void {
    this.loadItems();
    this.loadRoles();
  }

  onDialogShow(): void {
    // Recargamos los roles cada vez que se abre el diálogo
    this.loadRoles();
  }

  override loadItems(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.items = users;
        console.log('Usuarios cargados:', this.items);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los usuarios'
        });
      }
    });
  }

  loadRoles(): void {
    this.rolService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        console.log('Roles cargados:', this.roles);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los roles'
        });
      }
    });
  }

  override showDialog(): void {
    this.selectedItem = {
      username: '',
      password: '',
      rol: undefined
    };
    this.editMode = false;
    this.dialogVisible = true;
  }

  override hideDialog(): void {
    this.dialogVisible = false;
  }

  override editItem(item: User): void {
    console.log('Item a editar:', item);
    // Aseguramos que los roles estén cargados
    this.loadRoles();
    
    // Hacemos una copia segura del item
    this.selectedItem = { 
      ...item,
      rol: undefined // Inicialmente limpiamos el rol
    };

    // Una vez que tenemos los roles, buscamos el correspondiente
    if (item.rol && this.roles.length > 0) {
      const rolCompleto = this.roles.find(r => 
        (item.rol && r.id === item.rol.id) || 
        (item.rol && r.name === item.rol.name)
      );
      
      if (rolCompleto) {
        this.selectedItem.rol = rolCompleto;
      }
    }

    this.editMode = true;
    this.dialogVisible = true;
    console.log('Item seleccionado:', this.selectedItem);
    console.log('Rol seleccionado:', this.selectedItem.rol);
  }

  override confirmDeleteSelected(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar los usuarios seleccionados?',
      accept: () => {
        const ids = this.selectedItems.map(user => user.id!);
        this.userService.deleteUsers(ids).subscribe({
          next: () => {
            this.loadItems();
            this.selectedItems = [];
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Usuarios eliminados'
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar los usuarios'
            });
          }
        });
      }
    });
  }

  override saveItem(): void {
    if (!this.selectedItem.rol) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe seleccionar un rol'
      });
      return;
    }

    if (this.editMode) {
      this.userService.updateUser(this.selectedItem.id!, this.selectedItem).subscribe({
        next: (user) => {
          this.loadItems();
          this.hideDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Usuario actualizado'
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el usuario'
          });
        }
      });
    } else {
      this.userService.createUser(this.selectedItem).subscribe({
        next: (user) => {
          this.loadItems();
          this.hideDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Usuario creado'
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el usuario'
          });
        }
      });
    }
  }

  override confirmDelete(item: User): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar este usuario?',
      accept: () => {
        this.userService.deleteUser(item.id!).subscribe({
          next: () => {
            this.loadItems();
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Usuario eliminado'
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el usuario'
            });
          }
        });
      }
    });
  }

  onGlobalFilter(event: Event): void {
    const table = document.querySelector('p-table');
    if (table) {
      const filterValue = (event.target as HTMLInputElement).value;
      (table as any).filterGlobal(filterValue, 'contains');
    }
  }
} 