import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-feedback',
  template: `
    <div class="p-4 text-center">
      <h2 class="text-xl font-semibold mb-2">{{ data.titre }}</h2>
      <p class="text-gray-600 mb-4">{{ data.message }}</p>
      <button mat-button color="primary" (click)="fermer()">Fermer</button>
    </div>
  `
})
export class DialogFeedbackComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { titre: string; message: string },
    private dialogRef: MatDialogRef<DialogFeedbackComponent>
  ) {}

  fermer() {
    this.dialogRef.close();
  }
}
