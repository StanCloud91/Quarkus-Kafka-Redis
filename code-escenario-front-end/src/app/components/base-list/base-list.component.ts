import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-base-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: ``,
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
export class BaseListComponent implements OnInit {
  items: any[] = [];
  selectedItems: any[] = [];
  dialogVisible: boolean = false;
  selectedItem: any = {};
  editMode: boolean = false;

  constructor(
    protected messageService: MessageService,
    protected confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    // To be implemented by child components
  }

  showDialog(): void {
    this.selectedItem = {};
    this.editMode = false;
    this.dialogVisible = true;
  }

  hideDialog(): void {
    this.dialogVisible = false;
  }

  editItem(item: any): void {
    this.selectedItem = { ...item };
    this.editMode = true;
    this.dialogVisible = true;
  }

  confirmDeleteSelected(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected items?',
      accept: () => {
        // To be implemented by child components
        this.selectedItems = [];
      }
    });
  }

  confirmDelete(item: any): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this item?',
      accept: () => {
        // To be implemented by child components
      }
    });
  }

  saveItem(): void {
    // To be implemented by child components
  }
} 