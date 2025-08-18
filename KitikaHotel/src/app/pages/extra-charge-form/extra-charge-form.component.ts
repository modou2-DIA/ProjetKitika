import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Charge {
  type: string;
  description: string;
  montant: number;
}

@Component({
  selector: 'app-extra-charge-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './extra-charge-form.component.html',
  styleUrl: './extra-charge-form.component.scss'
})
export class ExtraChargeFormComponent {
  charge: Charge = { type: '', description: '', montant: 0 };

  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<ExtraChargeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reservationId: number }
  ) {}

  save() {
    this.errorMessage = '';

    if (!this.charge.type.trim()) {
      this.errorMessage = 'Le type de prestation est obligatoire.';
      return;
    }

    if (this.charge.montant <= 0) {
      this.errorMessage = 'Le montant doit être supérieur à 0.';
      return;
    }

    this.dialogRef.close(this.charge);
  }

  close() {
    this.dialogRef.close();
  }
}
