import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-extra-charge-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './extra-charge-form.component.html',
  styleUrl: './extra-charge-form.component.scss'
})
export class ExtraChargeFormComponent {
  charge = { type: '', description: '', montant: 0 };

  constructor(
    public dialogRef: MatDialogRef<ExtraChargeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reservationId: number }
  ) {}

  save() {
    if (!this.charge.type || this.charge.montant <= 0) return;
    this.dialogRef.close(this.charge);
  }

  close() {
    this.dialogRef.close();
  }

}
