import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Endpoint } from '../../interfaces/endpoint.interface';
import { EndpointService } from '../../services/endpoint.service';

@Component({
  selector: 'app-endpoint-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="card">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="header-container">
        <h1>Gestionar Endpoints</h1>
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
        [globalFilterFields]="['name', 'path', 'descripcion']"
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
            <th pSortableColumn="path">Ruta <p-sortIcon field="path"></p-sortIcon></th>
            <th pSortableColumn="descripcion">Descripción <p-sortIcon field="descripcion"></p-sortIcon></th>
            <th style="width: 8rem"></th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-item>
          <tr>
            <td>
              <p-tableCheckbox [value]="item"></p-tableCheckbox>
            </td>
            <td>{{item.name}}</td>
            <td>{{item.path}}</td>
            <td>{{item.descripcion}}</td>
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

      <p-dialog [(visible)]="dialogVisible" [header]="editMode ? 'Editar Endpoint' : 'Nuevo Endpoint'" 
                [modal]="true" [style]="{width: '450px'}">
        <div class="p-fluid">
          <div class="field">
            <label for="name">Nombre</label>
            <input pInputText id="name" [(ngModel)]="selectedItem.name" required />
          </div>
          <div class="field">
            <label for="path">Ruta</label>
            <input pInputText id="path" [(ngModel)]="selectedItem.path" required />
          </div>
          <div class="field">
            <label for="descripcion">Descripción</label>
            <textarea pInputTextarea id="descripcion" [(ngModel)]="selectedItem.descripcion" 
                      rows="3" required></textarea>
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
export class EndpointListComponent implements OnInit {
  items: Endpoint[] = [];
  selectedItems: Endpoint[] = [];
  selectedItem: Endpoint = {
    name: '',
    path: '',
    descripcion: ''
  };
  dialogVisible: boolean = false;
  editMode: boolean = false;

  constructor(
    private endpointService: EndpointService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.endpointService.getAllEndpoints().subscribe({
      next: (endpoints) => {
        this.items = endpoints;
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
      name: '',
      path: '',
      descripcion: ''
    };
    this.editMode = false;
    this.dialogVisible = true;
  }

  hideDialog(): void {
    this.dialogVisible = false;
  }

  editItem(item: Endpoint): void {
    this.selectedItem = { ...item };
    this.editMode = true;
    this.dialogVisible = true;
  }

  confirmDeleteSelected(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar los endpoints seleccionados?',
      accept: () => {
        const ids = this.selectedItems.map(endpoint => endpoint.id!);
        this.endpointService.deleteEndpoints(ids).subscribe({
          next: () => {
            this.loadItems();
            this.selectedItems = [];
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Endpoints eliminados'
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar los endpoints'
            });
          }
        });
      }
    });
  }

  saveItem(): void {
    if (this.editMode) {
      this.endpointService.updateEndpoint(this.selectedItem.id!, this.selectedItem).subscribe({
        next: (endpoint) => {
          this.loadItems();
          this.hideDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Endpoint actualizado'
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el endpoint'
          });
        }
      });
    } else {
      this.endpointService.createEndpoint(this.selectedItem).subscribe({
        next: (endpoint) => {
          this.loadItems();
          this.hideDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Endpoint creado'
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el endpoint'
          });
        }
      });
    }
  }

  confirmDelete(item: Endpoint): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar este endpoint?',
      accept: () => {
        this.endpointService.deleteEndpoint(item.id!).subscribe({
          next: () => {
            this.loadItems();
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Endpoint eliminado'
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el endpoint'
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