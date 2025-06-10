import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
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
        <h1>Gestionar Productos</h1>
        <div class="button-container">
          <p-button label="Nuevo" icon="pi pi-plus" (onClick)="showDialog()"></p-button>
          <p-button label="Eliminar" icon="pi pi-trash" [disabled]="!selectedProducts?.length" 
                    severity="danger" (onClick)="confirmDeleteSelected()"></p-button>
        </div>
      </div>

      <p-table 
        [value]="products" 
        [paginator]="true" 
        [rows]="10"
        [responsive]="true"
        [(selection)]="selectedProducts"
        [rowHover]="true"
        dataKey="id"
        [globalFilterFields]="['name', 'description', 'price']"
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
            <th pSortableColumn="description">Descripción <p-sortIcon field="description"></p-sortIcon></th>
            <th pSortableColumn="price">Precio <p-sortIcon field="price"></p-sortIcon></th>
            <th pSortableColumn="stock">Stock <p-sortIcon field="stock"></p-sortIcon></th>
            <th style="width: 8rem"></th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-product>
          <tr>
            <td>
              <p-tableCheckbox [value]="product"></p-tableCheckbox>
            </td>
            <td>{{product.name}}</td>
            <td>{{product.description}}</td>
            <td>{{product.price | currency:'USD'}}</td>
            <td>{{product.stock}}</td>
            <td>
              <div class="action-buttons">
                <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2" 
                        (click)="editProduct(product)"></button>
                <button pButton icon="pi pi-trash" class="p-button-rounded p-button-danger" 
                        (click)="confirmDelete(product)"></button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <p-dialog [(visible)]="dialogVisible" [header]="editMode ? 'Editar Producto' : 'Nuevo Producto'" 
                [modal]="true" [style]="{width: '450px'}">
        <div class="p-fluid">
          <div class="field">
            <label for="name">Nombre</label>
            <input pInputText id="name" [(ngModel)]="selectedProduct.name" required />
          </div>
          <div class="field">
            <label for="description">Descripción</label>
            <textarea pInputTextarea id="description" [(ngModel)]="selectedProduct.description" 
                      rows="3" required></textarea>
          </div>
          <div class="field">
            <label for="price">Precio</label>
            <p-inputNumber id="price" [(ngModel)]="selectedProduct.price" mode="currency" 
                          currency="USD" required></p-inputNumber>
          </div>
          <div class="field">
            <label for="stock">Stock</label>
            <p-inputNumber id="stock" [(ngModel)]="selectedProduct.stock" required></p-inputNumber>
          </div>
        </div>
        <ng-template pTemplate="footer">
          <button pButton label="Cancelar" icon="pi pi-times" class="p-button-text" 
                  (click)="hideDialog()"></button>
          <button pButton label="Guardar" icon="pi pi-check" (click)="saveProduct()"></button>
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
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  dialogVisible: boolean = false;
  selectedProduct: Product = this.getEmptyProduct();
  editMode: boolean = false;
  selectedProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los productos'
        });
      }
    });
  }

  showDialog(): void {
    this.selectedProduct = this.getEmptyProduct();
    this.editMode = false;
    this.dialogVisible = true;
  }

  hideDialog(): void {
    this.dialogVisible = false;
  }

  editProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.editMode = true;
    this.dialogVisible = true;
  }

  confirmDeleteSelected(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar los productos seleccionados?',
      accept: () => {
        // Implementar eliminación múltiple
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Productos eliminados'
        });
        this.selectedProducts = [];
      }
    });
  }

  saveProduct(): void {
    if (this.editMode) {
      this.productService.updateProduct(this.selectedProduct.id!, this.selectedProduct).subscribe({
        next: (product) => {
          this.loadProducts();
          this.hideDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Producto actualizado'
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el producto'
          });
        }
      });
    } else {
      this.productService.createProduct(this.selectedProduct).subscribe({
        next: (product) => {
          this.loadProducts();
          this.hideDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Producto creado'
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el producto'
          });
        }
      });
    }
  }

  confirmDelete(product: Product): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar este producto?',
      accept: () => {
        this.productService.deleteProduct(product.id!).subscribe({
          next: () => {
            this.loadProducts();
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Producto eliminado'
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el producto'
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

  private getEmptyProduct(): Product {
    return {
      name: '',
      description: '',
      price: 0,
      stock: 0
    };
  }
} 