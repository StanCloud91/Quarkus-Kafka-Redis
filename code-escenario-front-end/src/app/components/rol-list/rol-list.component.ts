import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BaseListComponent } from '../base-list/base-list.component';
import { Rol } from '../../interfaces/rol.interface';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-rol-list',
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
    CheckboxModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="card">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="header-container">
        <h1>Gestionar Roles</h1>
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
        [globalFilterFields]="['name']"
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
            <th pSortableColumn="name">Nombre <p-sortIcon field="name"></p-sortIcon></th>
            <th pSortableColumn="estado">Estado <p-sortIcon field="estado"></p-sortIcon></th>
            <th style="width: 8rem"></th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-item>
          <tr>
            <td>
              <p-tableCheckbox [value]="item"></p-tableCheckbox>
            </td>
            <td>{{item.name}}</td>
            <td>
              <span [class]="'status-badge ' + (item.estado ? 'status-active' : 'status-inactive')">
                {{item.estado ? 'Activo' : 'Inactivo'}}
              </span>
            </td>
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

      <p-dialog [(visible)]="dialogVisible" [header]="editMode ? 'Editar Rol' : 'Nuevo Rol'" 
                [modal]="true" [style]="{width: '450px'}">
        <div class="p-fluid">
          <div class="field">
            <label for="name">Nombre</label>
            <input pInputText id="name" [(ngModel)]="selectedItem.name" required />
          </div>
          <div class="field">
            <label class="block">Estado</label>
            <p-checkbox [(ngModel)]="selectedItem.estado" [binary]="true" inputId="estado"></p-checkbox>
            <label for="estado" class="ml-2">Activo</label>
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
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }
    .status-active {
      background-color: var(--green-100);
      color: var(--green-700);
    }
    .status-inactive {
      background-color: var(--red-100);
      color: var(--red-700);
    }
  `]
})
export class RolListComponent implements OnInit {
  items: Rol[] = [];
  selectedItems: Rol[] = [];
  selectedItem: Rol = {
    name: '',
    estado: true
  };
  dialogVisible: boolean = false;
  editMode: boolean = false;

  constructor(
    private rolService: RolService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.rolService.getAllRoles().subscribe({
      next: (roles) => {
        this.items = roles;
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

  showDialog(): void {
    this.selectedItem = {
      name: '',
      estado: true
    };
    this.editMode = false;
    this.dialogVisible = true;
  }

  hideDialog(): void {
    this.dialogVisible = false;
  }

  editItem(item: Rol): void {
    this.selectedItem = { ...item };
    this.editMode = true;
    this.dialogVisible = true;
  }

  confirmDeleteSelected(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar los roles seleccionados?',
      accept: () => {
        const ids = this.selectedItems.map(rol => rol.id!);
        this.rolService.deleteRoles(ids).subscribe({
          next: () => {
            this.loadItems();
            this.selectedItems = [];
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Roles eliminados'
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar los roles'
            });
          }
        });
      }
    });
  }

  saveItem(): void {
    if (this.editMode) {
      this.rolService.updateRol(this.selectedItem.id!, this.selectedItem).subscribe({
        next: (rol) => {
          this.loadItems();
          this.hideDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Rol actualizado'
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el rol'
          });
        }
      });
    } else {
      this.rolService.createRol(this.selectedItem).subscribe({
        next: (rol) => {
          this.loadItems();
          this.hideDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Rol creado'
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el rol'
          });
        }
      });
    }
  }

  confirmDelete(item: Rol): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar este rol?',
      accept: () => {
        this.rolService.deleteRol(item.id!).subscribe({
          next: () => {
            this.loadItems();
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Rol eliminado'
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el rol'
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