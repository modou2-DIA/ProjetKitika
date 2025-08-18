import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {  ChambreService } from '../../services/chambre.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Chambre } from '../../models/chambre.model';
@Component({
  selector: 'app-gestion-chambres',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './gestion-chambres.component.html',
  styleUrls: ['./gestion-chambres.component.scss']
})
export class GestionChambresComponent implements OnInit {
  chambres: Chambre[] = [];
  chambresFiltrees: Chambre[] = [];
  searchTerm: string = '';
  filtreType: string = '';
  isEditing: boolean = false;

  chambreForm!: FormGroup;
  chambreEnCours?: Chambre;

  @ViewChild('modalChambre') modalChambreRef!: TemplateRef<any>;

  constructor(
    private chambreService: ChambreService,
    private fb: FormBuilder,
    private dialog: MatDialog,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.chargerChambres();
  }

  initForm(): void {
    this.chambreForm = this.fb.group({
      numero: ['', Validators.required],
      type: ['', Validators.required],
      prixParNuit: [0, [Validators.required, Validators.min(0)]],
      statut: ['Libre', Validators.required],
      horsService: [false]
    });
  }

  chargerChambres(): void {
    this.chambreService.getAll().subscribe(data => {
      this.chambres = data;
      this.filtrerChambres();
    });
  }

  filtrerChambres(): void {
    const terme = this.searchTerm.toLowerCase();

    this.chambresFiltrees = this.chambres.filter(c => {
      const matchSearch =
        c.numero.toLowerCase().includes(terme) ||
        c.type.toLowerCase().includes(terme);

      const matchType = !this.filtreType || c.type === this.filtreType;

      return matchSearch && matchType;
    });
  }

  openModalAjout(): void {
    this.isEditing = false;
    this.chambreEnCours = undefined;
    this.chambreForm.reset({ statut: 'Libre', horsService: false });
    this.dialog.open(this.modalChambreRef, { width: '500px' });
  }

  openModalEdition(chambre: Chambre): void {
    this.isEditing = true;
    this.chambreEnCours = chambre;

    this.chambreForm.patchValue({
      numero: chambre.numero,
      type: chambre.type,
      prixParNuit: chambre.prixParNuit,
      statut: chambre.statut,
      horsService: chambre.horsService
    });

    this.dialog.open(this.modalChambreRef, { width: '500px' });
  }

  soumettreChambre(): void {
    if (this.chambreForm.invalid) return;

    const chambre: Chambre = {
      ...this.chambreEnCours,
      ...this.chambreForm.value
    };

    if (this.isEditing) {
      this.chambreService.update( chambre).subscribe(() => {
        this.dialog.closeAll();
        this.chargerChambres();
      });
    } else {
      this.chambreService.create(chambre).subscribe(() => {
        this.dialog.closeAll();
        this.chargerChambres();
      });
    }
  }

  annuler(): void {
    this.dialog.closeAll();
  }
  fermerModal(): void {
  this.annuler();
}
retour() {
  this.router.navigate(['../hebergement']); // ou remplace par la route exacte du composant précédent
}
}
