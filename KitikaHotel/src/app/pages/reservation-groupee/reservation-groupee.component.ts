import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ChambreService } from '../../services/chambre.service';
import { ReservationGroupeeService, ReservationGroupee } from '../../services/reservation-groupee.service';
import { Client, ClientService } from '../../services/client.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs'; // Ajout de forkJoin et of
import { switchMap, catchError, tap } from 'rxjs/operators'; // Ajout des opérateurs pour une logique puissante
import { ReservationService } from '../../services/reservation.service';
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
    private reservationGroupeeService: ReservationGroupeeService, // Nom du service mis à jour pour plus de clarté
    private clientService: ClientService, // <-- Ajoute ce service
    private reservationService: ReservationService // <-- Ajoute ce service pour les réservations
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nomGroupe: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      societe: this.fb.group({
        nom: ['', Validators.required],
        telephone: ['', Validators.required],
        email: ['', Validators.required],
        adresse: [''],
        societe: [''],
        nationalite: [''],
        numeroPieceIdentite: [''],
        type: ['societe']
      }),
      reservations: this.fb.array([], Validators.required), // Le FormArray est maintenant pour les réservations, pas les clients
    });

    this.ajouterReservation(); // Init 1 reservation par défaut
    this.chargerChambres();
    this.chargerSocietes();
  }

  get reservations(): FormArray {
    return this.form.get('reservations') as FormArray;
  }
    
  chargerSocietes() {
    this.clientService.getSocietes().subscribe(data => {
      this.societesExistantes = data;
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

  ajouterReservation() {
    this.reservations.push(this.fb.group({
      client: this.fb.group({
        nom: ['', Validators.required],
        prenom: [''],
        telephone: ['', Validators.required],
        email: ['', Validators.required],
        societe: [''],
        adresse: [''],
        nationalite: [''],
        numeroPieceIdentite: [''],
        type: ['particulier']
      }),
      chambreId: ['', Validators.required]
    }));
  }

  supprimerReservation(index: number) {
    this.reservations.removeAt(index);
  }

  chargerChambres() {
    this.chambreService.getChambresLibres().subscribe(data => {
      this.chambresDisponibles = data;
    });
  }

  soumettre() {
    if (this.form.valid) {
      // 1. Gérer la société
      let societePayload = this.form.value.societe;
      if (this.societeSelectionnee) {
        societePayload = { id: this.societeSelectionnee.id };
      }

      // 2. Créer la réservation groupée
      this.reservationGroupeeService.creerReservationGroupee({
        nomGroupe: this.form.value.nomGroupe,
        dateDebut: this.form.value.dateDebut,
        dateFin: this.form.value.dateFin,
        societe: societePayload,
        reservations: [] // La liste est vide pour le moment
      }).pipe(
        // 3. Traiter chaque réservation une par une
        switchMap((groupeCree: ReservationGroupee) => {
          if (!groupeCree || !groupeCree.id) {
            throw new Error("Impossible de créer le groupe de réservation.");
          }
          const reservationObservables = this.form.value.reservations.map((resData: any) => {
            const clientData = resData.client;
            const chambreId = resData.chambreId;

            return this.clientService.create(clientData).pipe(
              switchMap((createdClient: Client) => {
                if (!createdClient || !createdClient.id) {
                  throw new Error("Impossible de créer le client.");
                }
                
                return this.chambreService.getById(chambreId).pipe(
                  switchMap((chambre: any) => {
                    const reservationPayload = {
                      dateDebut: groupeCree.dateDebut,
                      dateFin: groupeCree.dateFin,
                      statut: 'EN_ATTENTE',
                      total: 0, // À ajuster selon votre logique métier
                      client: createdClient,
                      chambre: chambre,
                      receptionniste: null
                    };
                    return this.reservationService.create(reservationPayload).pipe(
                      switchMap((createdReservation: any) => {
                         return this.reservationGroupeeService.addReservationToGroup(groupeCree.id!, createdReservation.id)
                      })
                    );
                  })
                );
              })
            );
          });
          return forkJoin(reservationObservables);
        }),
        tap(() => {
          alert('Réservation de groupe et clients enregistrés avec succès.');
          this.form.reset();
          this.reservations.clear();
          this.ajouterReservation();
          this.chargerChambres();
        }),
        catchError((err) => {
          alert("Une erreur est survenue lors de l'enregistrement de la réservation.");
          console.error("Erreur lors de la création de la réservation groupée", err);
          return of(null);
        })
      ).subscribe();

    } else {
      alert("Formulaire incomplet !");
    }
  }
}
