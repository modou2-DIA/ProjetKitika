import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ChambreService } from '../../services/chambre.service';
import { ReservationGroupeeService } from '../../services/reservation-groupee.service';
import { ClientService } from '../../services/client.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { ReservationService } from '../../services/reservation.service';
import { DialogService } from '../dialog.service/dialog.service.component';

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
  societesExistantes: any[] = [];
  societeSelectionnee: any = null;

  constructor(
    private fb: FormBuilder,
    private chambreService: ChambreService,
    private reservationGroupeeService: ReservationGroupeeService,
    private clientService: ClientService,
    private reservationService: ReservationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nomGroupe: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      societe: this.fb.group({
        nom: ['', Validators.required],
        telephone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        adresse: [''],
        societe: [''],
        nationalite: [''],
        numeroPieceIdentite: [''],
        type: ['societe']
      }),
      reservations: this.fb.array([])
    });

    this.ajouterReservation();
    this.chargerChambres();
    this.chargerSocietes();
  }

  get reservations(): FormArray {
    return this.form.get('reservations') as FormArray;
  }

  creerReservationFormGroup(): FormGroup {
    return this.fb.group({
      clientId: [null],
      client: this.fb.group({
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        telephone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        nationalite: ['', Validators.required],
        numeroPieceIdentite: ['', Validators.required],
      }),
      chambreId: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      payeurExtras: ['CLIENT']
    });
  }

  ajouterReservation() {
    this.reservations.push(this.creerReservationFormGroup());
  }

  supprimerReservation(index: number) {
    this.dialogService.confirm(
      'Supprimer la réservation',
      'Êtes-vous sûr de vouloir supprimer cette réservation ?',
      'Supprimer',
      'Annuler'
    ).subscribe(result => {
      if (result) {
        this.reservations.removeAt(index);
        this.dialogService.success('Réservation supprimée de la liste');
      }
    });
  }

  chargerChambres() {
    this.chambreService.getChambresLibres().subscribe({
      next: (data) => {
        this.chambresDisponibles = data;
      },
      error: (error) => {
        this.dialogService.error('Erreur lors du chargement des chambres disponibles');
      }
    });
  }

  chargerSocietes() {
    this.clientService.getSocietes().subscribe({
      next: (data) => {
        this.societesExistantes = data;
      },
      error: (error) => {
        this.dialogService.error('Erreur lors du chargement des sociétés');
      }
    });
  }

  onSocieteSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;

    if (!selectedId) {
      this.societeSelectionnee = null;
      this.form.get('societe')?.reset({
        nom: '',
        telephone: '',
        email: '',
        adresse: '',
        societe: '',
        nationalite: '',
        numeroPieceIdentite: '',
        type: 'societe'
      });
      return;
    }

    const id = parseInt(selectedId, 10);
    const societe = this.societesExistantes.find(s => s.id === id);

    if (societe) {
      this.societeSelectionnee = societe;
      this.form.get('societe')?.patchValue({
        nom: societe.nom ?? '',
        telephone: societe.telephone ?? '',
        email: societe.email ?? '',
        adresse: societe.adresse ?? '',
        societe: societe.societe ?? '',
        nationalite: societe.nationalite ?? '',
        numeroPieceIdentite: societe.numeroPieceIdentite ?? '',
        type: societe.type ?? 'societe'
      });
    }
  }

  soumettre() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.dialogService.error(
        'Veuillez remplir tous les champs obligatoires avant de soumettre.',
        'Formulaire incomplet'
      );
      return;
    }

    // Confirmer avant la soumission
    this.dialogService.confirm(
      'Confirmer la création',
      'Êtes-vous sûr de vouloir créer cette réservation groupée ?',
      'Créer',
      'Annuler'
    ).subscribe(result => {
      if (result) {
        this.creerReservationGroupee();
      }
    });
  }

  private creerReservationGroupee() {
    const groupPayload = {
      nomGroupe: this.form.value.nomGroupe,
      dateDebut: this.form.value.dateDebut,
      dateFin: this.form.value.dateFin,
      societe: this.form.value.societe
    };

    this.reservationGroupeeService.creerReservationGroupee(groupPayload).pipe(
      switchMap((groupe: any) => {
        const items = this.reservations.value.map((r: any) => ({
          clientId: r.clientId || null,
          client: r.clientId ? null : r.client,
          chambreId: +r.chambreId,
          dateDebut: r.dateDebut,
          dateFin: r.dateFin,
          notes: r.notes || null
        }));
        return this.reservationGroupeeService.addReservationsBulk(groupe.id, { reservations: items });
      })
    ).subscribe({
      next: () => {
        this.dialogService.success(
          'La réservation groupée a été enregistrée avec succès ✅',
          'Succès'
        );

        this.resetForm();
      },
      error: (e) => {
        const errorMessage = e.error?.message || 'Échec lors de l\'enregistrement des réservations ❌';
        this.dialogService.error(errorMessage, 'Erreur');
      }
    });
  }

  private resetForm() {
    this.form.reset();
    this.reservations.clear();
    this.ajouterReservation();
    this.societeSelectionnee = null;
  }

  // Méthode utilitaire pour valider les dates
  validateDates(): boolean {
    const dateDebut = this.form.get('dateDebut')?.value;
    const dateFin = this.form.get('dateFin')?.value;
    
    if (dateDebut && dateFin && new Date(dateFin) <= new Date(dateDebut)) {
      this.dialogService.error(
        'La date de fin doit être postérieure à la date de début',
        'Dates invalides'
      );
      return false;
    }
    return true;
  }

  // Méthode pour vérifier la disponibilité avant soumission
  verifierDisponibilite() {
    if (!this.validateDates()) {
      return;
    }

    // Logique de vérification de disponibilité si nécessaire
    // Puis appeler soumettre() si tout est OK
    this.soumettre();
  }
}