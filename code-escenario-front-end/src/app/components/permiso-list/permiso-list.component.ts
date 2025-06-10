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
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BaseListComponent } from '../base-list/base-list.component';
import { Permiso } from '../../interfaces/permiso.interface';
import { Rol } from '../../interfaces/rol.interface';
import { Endpoint } from '../../interfaces/endpoint.interface';
import { PermisoService } from '../../services/permiso.service';
import { RolService } from '../../services/rol.service';
import { EndpointService } from '../../services/endpoint.service';

@Component({
  selector: 'app-permiso-list',
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
    DropdownModule,
    CheckboxModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="card">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="header-container">
        <h1>Gestionar Permisos</h1>
        <div class="button-container">
          <p-button label="Nuevo" icon="pi pi-plus" styleClass="p-button-sm" (onClick)="showDialog()"></p-button>
          <p-button label="Eliminar" icon="pi pi-trash" [disabled]="!selectedItems?.length" 
                    severity="danger" styleClass="p-button-sm" (onClick)="confirmDeleteSelected()"></p-button>
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
        [globalFilterFields]="['rol.name', 'endpoint.name']"
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
            <th pSortableColumn="rol.name">Rol <p-sortIcon field="rol.name"></p-sortIcon></th>
            <th pSortableColumn="endpoint.name">Endpoint <p-sortIcon field="endpoint.name"></p-sortIcon></th>
            <th>Permisos</th>
            <th style="width: 8rem"></th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-item>
          <tr>
            <td>
              <p-tableCheckbox [value]="item"></p-tableCheckbox>
            </td>
            <td>{{item.rol.name}}</td>
            <td>{{item.endpoint.name}}</td>
            <td>
              <div class="permissions-container">
                <span class="permission-badge" [class.active]="item.crear">Crear</span>
                <span class="permission-badge" [class.active]="item.listar">Listar</span>
                <span class="permission-badge" [class.active]="item.actualizar">Actualizar</span>
                <span class="permission-badge" [class.active]="item.eliminar">Eliminar</span>
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-info p-button-sm mr-2" 
                        (click)="editItem(item)"></button>
                <button pButton icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-sm" 
                        (click)="confirmDelete(item)"></button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <p-dialog [(visible)]="dialogVisible" [header]="editMode ? 'Editar Permiso' : 'Nuevo Permiso'" 
                [modal]="true" [style]="{width: '450px'}">
        <div class="p-fluid">
          <div class="field">
            <label for="rol">Rol</label>
            <p-dropdown id="rol" [options]="roles" [(ngModel)]="selectedItem.rol" 
                       optionLabel="name" [filter]="true" filterBy="name" required></p-dropdown>
          </div>
          <div class="field">
            <label for="endpoint">Endpoint</label>
            <p-dropdown id="endpoint" [options]="endpoints" [(ngModel)]="selectedItem.endpoint" 
                       optionLabel="name" [filter]="true" filterBy="name" required></p-dropdown>
          </div>
          <div class="field">
            <label class="block">Permisos</label>
            <div class="permissions-grid">
              <div class="permission-item">
                <p-checkbox [(ngModel)]="selectedItem.crear" [binary]="true" inputId="crear"></p-checkbox>
                <label for="crear" class="ml-2">Crear</label>
              </div>
              <div class="permission-item">
                <p-checkbox [(ngModel)]="selectedItem.listar" [binary]="true" inputId="listar"></p-checkbox>
                <label for="listar" class="ml-2">Listar</label>
              </div>
              <div class="permission-item">
                <p-checkbox [(ngModel)]="selectedItem.actualizar" [binary]="true" inputId="actualizar"></p-checkbox>
                <label for="actualizar" class="ml-2">Actualizar</label>
              </div>
              <div class="permission-item">
                <p-checkbox [(ngModel)]="selectedItem.eliminar" [binary]="true" inputId="eliminar"></p-checkbox>
                <label for="eliminar" class="ml-2">Eliminar</label>
              </div>
            </div>
          </div>
        </div>
        <ng-template pTemplate="footer">
          <button pButton label="Cancelar" icon="pi pi-times" class="p-button-text p-button-sm" 
                  (click)="hideDialog()"></button>
          <button pButton label="Guardar" icon="pi pi-check" class="p-button-sm" (click)="saveItem()"></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .permissions-container {
      display: flex;
      gap: 0.5rem;
    }
    .permission-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      background-color: var(--surface-200);
      color: var(--surface-700);
    }
    .permission-badge.active {
      background-color: var(--primary-100);
      color: var(--primary-700);
    }
    .permissions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-top: 0.5rem;
    }
    .permission-item {
      display: flex;
      align-items: center;
    }
  `]
})
export class PermisoListComponent implements OnInit {
  items: Permiso[] = [];
  selectedItems: Permiso[] = [];
  selectedItem: Permiso = {
    rol: {} as Rol,
    endpoint: {} as Endpoint,
    crear: false,
    listar: false,
    actualizar: false,
    eliminar: false
  };
  dialogVisible: boolean = false;
  editMode: boolean = false;

  roles: Rol[] = [];
  endpoints: Endpoint[] = [];

  constructor(
    private permisoService: PermisoService,
    private rolService: RolService,
    private endpointService: EndpointService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadItems();
    this.loadRoles();
    this.loadEndpoints();
  }

  loadItems(): void {
    this.permisoService.getAllPermisos().subscribe({
      next: (permisos) => {
        this.items = permisos;
        console.log('Permisos cargados:', this.items);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los permisos'
        });
      }
    });
  }

  loadRoles(): void {
    this.rolService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
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

  loadEndpoints(): void {
    this.endpointService.getAllEndpoints().subscribe({
      next: (endpoints) => {
        this.endpoints = endpoints;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los endpoints'
        });
      }
    });
  }

  showDialog(): void {
    this.selectedItem = {
      rol: {} as Rol,
      endpoint: {} as Endpoint,
      crear: false,
      listar: false,
      actualizar: false,
      eliminar: false
    };
    this.editMode = false;
    this.dialogVisible = true;
  }

  hideDialog(): void {
    this.dialogVisible = false;
  }

  editItem(item: Permiso): void {
    this.selectedItem = { ...item };
    this.editMode = true;
    this.dialogVisible = true;
    console.log('Item seleccionado:', this.selectedItem);
  }

  confirmDeleteSelected(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar los permisos seleccionados?',
      accept: () => {
        const ids = this.selectedItems.map(permiso => permiso.id!);
        this.permisoService.deletePermisos(ids).subscribe({
          next: () => {
            this.loadItems();
            this.selectedItems = [];
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Permisos eliminados'
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar los permisos'
            });
          }
        });
      }
    });
  }

  saveItem(): void {
    if (this.editMode) {
      this.permisoService.updatePermiso(this.selectedItem.id!, this.selectedItem).subscribe({
        next: (permiso) => {
          this.loadItems();
          this.hideDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Permiso actualizado'
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el permiso'
          });
        }
      });
    } else {
      this.permisoService.createPermiso(this.selectedItem).subscribe({
        next: (permiso) => {
          this.loadItems();
          this.hideDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Permiso creado'
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el permiso'
          });
        }
      });
    }
  }

  confirmDelete(item: Permiso): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar este permiso?',
      accept: () => {
        this.permisoService.deletePermiso(item.id!).subscribe({
          next: () => {
            this.loadItems();
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Permiso eliminado'
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el permiso'
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