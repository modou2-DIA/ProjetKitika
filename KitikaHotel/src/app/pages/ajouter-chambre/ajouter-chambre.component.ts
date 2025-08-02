
 
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ChambreService } from '../../services/chambre.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ajouter-chambre',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ajouter-chambre.component.html',
  styleUrl: './ajouter-chambre.component.scss'
})
export class AjouterChambreComponent {
  chambreForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AjouterChambreComponent>,
    private fb: FormBuilder,
    private chambreService: ChambreService
  ) {
    this.chambreForm = this.fb.group({
      numero: ['', Validators.required],
      type: ['', Validators.required],
      prixParNuit: [0, [Validators.required, Validators.min(0)]],
      statut: ['Libre', Validators.required],
      horsService: [false]
    });
  }

  onSubmit(): void {
    if (this.chambreForm.valid) {
      this.chambreService.create(this.chambreForm.value).subscribe(() => {
        this.dialogRef.close(true); // success
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
