import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ChambreService } from '../../services/chambre.service';
import { ReservationGroupeeService ,ReservationGroupee } from '../../services/reservation-groupee.service';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservation-groupee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './reservation-groupee.component.html',
  styleUrls: ['./reservation-groupee.component.scss']
})
export class ReservationGroupeeComponent implements OnInit {
  form!: FormGroup;
  chambresDisponibles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private chambreService: ChambreService,
    private reservationService: ReservationGroupeeService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nomGroupe: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      societe: this.fb.group({
        id: [null, Validators.required],
        nom: ['', Validators.required],
        telephone: ['', Validators.required],
        email: ['', Validators.required],
        adresse: [''],
        societe: [''],
        nationalite: [''],
        numeroPieceIdentite: [''],
        type: ['societe']
      }),
      clients: this.fb.array([]),
      chambres: [[], Validators.required] // sélection multiple
    });

    this.ajouterClient(); // Init 1 client par défaut
    this.chargerChambres();
  }

  get clients(): FormArray {
    return this.form.get('clients') as FormArray;
  }

  ajouterClient() {
    this.clients.push(this.fb.group({
      nom: ['', Validators.required],
      prenom: [''],
      telephone: ['', Validators.required],
      email: ['', Validators.required],
      societe: [''],
      adresse: [''],
      nationalite: [''],
      numeroPieceIdentite: [''],
      type: ['particulier']
    }));
  }

  supprimerClient(index: number) {
    this.clients.removeAt(index);
  }

  chargerChambres() {
    this.chambreService.getChambresLibres().subscribe(data => {
      this.chambresDisponibles = data;
    });
  }

  onChambreToggle(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const chambres = this.form.value.chambres as number[];
    if (checked) {
      this.form.get('chambres')?.setValue([...chambres, id]);
    } else {
      this.form.get('chambres')?.setValue(chambres.filter(chambreId => chambreId !== id));
    }
    this.form.get('chambres')?.markAsDirty();
  }

  soumettre() {
    if (this.form.valid) {
      const payload: ReservationGroupee = this.form.value;

      this.reservationService.creerReservationGroupee(payload).subscribe(() => {
        alert('Réservation de groupe enregistrée avec succès.');
        this.form.reset();
        this.clients.clear();
        this.ajouterClient();
        this.chargerChambres();
      });
    } else {
      alert("Formulaire incomplet !");
    }
  }
}
