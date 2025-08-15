import { Component } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login-required-dialog',
  template: `
    <h2 mat-dialog-title>Accès restreint</h2>
    <mat-dialog-content>
      <p>Vous devez être connecté pour accéder à cette page. Veuillez vous connecter pour continuer.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button color="primary" [mat-dialog-close]="true">Se connecter</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ]
})
export class LoginRequiredDialogComponent {
  constructor(public dialogRef: MatDialogRef<LoginRequiredDialogComponent>) {}
}
