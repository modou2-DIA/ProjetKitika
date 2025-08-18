import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  confirm(
    title: string = 'Confirmation',
    message: string = 'Êtes-vous sûr ?',
    confirmText: string = 'Confirmer',
    cancelText: string = 'Annuler'
  ): Observable<boolean> {
    const dialogRef = this.dialog.open( ConfirmationDialogComponent, {
      width: '400px',
      data: { title, message, confirmText, cancelText }
    });

    return dialogRef.afterClosed();
  }

  success(message: string, title: string = 'Succès'): void {
    this.dialog.open( ConfirmationDialogComponent, {
      width: '400px',
      data: { 
        title, 
        message, 
        type: 'success',
        confirmText: 'OK',
        showCancel: false
      }
    });
  }

  error(message: string, title: string = 'Erreur'): void {
    this.dialog.open( ConfirmationDialogComponent, {
      width: '400px',
      data: { 
        title, 
        message, 
        type: 'error',
        confirmText: 'OK',
        showCancel: false
      }
    });
  }
}