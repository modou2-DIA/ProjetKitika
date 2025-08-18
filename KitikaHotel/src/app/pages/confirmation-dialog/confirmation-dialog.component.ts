// confirm-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
interface DialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  showCancel?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  imports:[CommonModule,MatIconModule,MatButtonModule  ],
  template: `
    <div mat-dialog-content>
      <h2 mat-dialog-title>
        <mat-icon [color]="getIconColor()">{{ getIcon() }}</mat-icon>
        {{ data.title }}
      </h2>
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions align="end">
      <button 
        mat-button 
        (click)="onCancel()" 
        *ngIf="data.showCancel !== false">
        {{ data.cancelText || 'Annuler' }}
      </button>
      <button 
        mat-raised-button 
        [color]="getButtonColor()" 
        (click)="onConfirm()">
        {{ data.confirmText }}
      </button>
    </div>
  `,
  styles: [`
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px 0;
    }
    mat-icon {
      margin-right: 8px;
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getIcon(): string {
    switch (this.data.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'help';
    }
  }

  getIconColor(): string {
    switch (this.data.type) {
      case 'success': return 'primary';
      case 'error': return 'warn';
      case 'warning': return 'accent';
      default: return 'primary';
    }
  }

  getButtonColor(): string {
    switch (this.data.type) {
      case 'error': return 'warn';
      case 'success': return 'primary';
      default: return 'primary';
    }
  }
}