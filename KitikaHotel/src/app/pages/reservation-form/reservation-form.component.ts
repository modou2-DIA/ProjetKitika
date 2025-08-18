import { Component, Inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReservationService } from '../../services/reservation.service';
import { ClientService,  } from '../../services/client.service';
import {  ChambreService } from '../../services/chambre.service';
import { DialogFeedbackComponent } from '../dialog-feedback/dialog-feedback.component';
import { Client } from '../../models/client.model';
import { Chambre } from '../../models/chambre.model';

export interface ReservationSmartPayload {
  chambreId: number;
  dateDebut: string;
  dateFin: string;
  // Soit clientId, soit les infos client
  clientId?: number;
  nom?: string;
  prenom?: string;
  telephone?: string;
  email?: string;
  nationalite?: string;
  numeroPieceIdentite?: string;
}

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  standalone: true
})
export class ReservationFormComponent implements OnInit {
  reservationForm!: FormGroup;
  chambresDispo: Chambre[] = [];
  clients: Client[] = [];

  // état local (standalone, simple et efficace)
  matchedClient = signal<Client | null>(null);
  isExistingClient = computed(() => this.matchedClient() !== null);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReservationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { chambre?: Chambre } | null,
    private reservationService: ReservationService,
    private clientService: ClientService,
    private chambreService: ChambreService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
  this.reservationForm = this.fb.group({
    chambreId: [this.data?.chambre?.id ?? '', Validators.required],
    dateDebut: ['', Validators.required],
    dateFin: ['', Validators.required],

    clientId: [null],

    nom: [''],
    prenom: [''],
    telephone: [''],
    email: [''],
    nationalite: [''],
    numeroPieceIdentite: ['']
  });

  this.loadChambres();
  this.loadClients();
  this.setupClientAutoMatch();

  // 👉 ajuste validators selon le client choisi
  this.reservationForm.get('clientId')?.valueChanges.subscribe(() => {
    this.updateValidators();
  });
  this.updateValidators();
}

private updateValidators() {
  const isExisting = !!this.reservationForm.get('clientId')?.value;

  if (isExisting) {
    this.reservationForm.get('nom')?.clearValidators();
    this.reservationForm.get('telephone')?.clearValidators();
    this.reservationForm.get('email')?.clearValidators();
  } else {
    this.reservationForm.get('nom')?.setValidators([Validators.required]);
    this.reservationForm.get('telephone')?.setValidators([Validators.required]);
    this.reservationForm.get('email')?.setValidators([Validators.required, Validators.email]);
  }

  // ⚠️ Important : éviter le loop avec emitEvent: false
  ['nom', 'telephone', 'email'].forEach(f => {
    this.reservationForm.get(f)?.updateValueAndValidity({ emitEvent: false });
  });
}


  private loadChambres() {
    this.chambreService.getChambresLibres().subscribe(data => {
      this.chambresDispo = data;
      // Si le dialog a été ouvert depuis une chambre précise, on la force si dispo
      if (this.data?.chambre?.id) {
        const stillThere = this.chambresDispo.some(c => c.id === this.data!.chambre!.id);
        if (!stillThere) {
          this.reservationForm.get('chambreId')?.setValue('');
        }
      }
    });
  }

  private loadClients() {
    // suffisant pour commencer ; si volumétrie => implémenter recherche serveur
    this.clientService.getAll().subscribe(data => (this.clients = data));
  }

  // Auto-match local : téléphone / email / N° pièce
  private setupClientAutoMatch() {
    const watchKeys = ['telephone', 'email', 'numeroPieceIdentite'] as const;
    watchKeys.forEach(key => {
      this.reservationForm.get(key)?.valueChanges.subscribe(() => this.tryMatchClient());
    });
  }

  private tryMatchClient() {
    const tel = (this.reservationForm.get('telephone')?.value || '').trim();
    const mail = (this.reservationForm.get('email')?.value || '').trim().toLowerCase();
    const npi = (this.reservationForm.get('numeroPieceIdentite')?.value || '').trim();

    if (!tel && !mail && !npi) {
      this.clearMatchedClient();
      return;
    }

    const found =
      this.clients.find(c =>
        (tel && c.telephone === tel) ||
        (mail && (c.email || '').toLowerCase() === mail) ||
        (npi && c.numeroPieceIdentite === npi)
      ) || null;

    if (found) {
      this.matchedClient.set(found);
      this.reservationForm.patchValue({
        clientId: found.id,
        nom: found.nom,
        prenom: found.prenom,
        telephone: found.telephone,
        email: found.email,
        nationalite: found.nationalite,
        numeroPieceIdentite: found.numeroPieceIdentite
      });
    } else {
      this.clearMatchedClient(false);
    }
  }

  chooseExisting(clientId: number) {
    const c = this.clients.find(cl => cl.id === +clientId) || null;
    if (c) {
      this.matchedClient.set(c);
      this.reservationForm.patchValue({
        clientId: c.id,
        nom: c.nom,
        prenom: c.prenom,
        telephone: c.telephone,
        email: c.email,
        nationalite: c.nationalite,
        numeroPieceIdentite: c.numeroPieceIdentite
      });
    }
  }

  clearMatchedClient(resetFields: boolean = true) {
    this.matchedClient.set(null);
    this.reservationForm.get('clientId')?.setValue(null);
    if (resetFields) {
      this.reservationForm.patchValue({
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        nationalite: '',
        numeroPieceIdentite: ''
      });
    }
  }

  submitReservation() {
    if (this.reservationForm.invalid) return;

    const v = this.reservationForm.value;
    const payload: ReservationSmartPayload = {
      chambreId: +v.chambreId,
      dateDebut: v.dateDebut,
      dateFin: v.dateFin,
    };

    if (v.clientId) {
      payload.clientId = +v.clientId;
    } else {
      payload.nom = v.nom;
      payload.prenom = v.prenom;
      payload.telephone = v.telephone;
      payload.email = v.email;
      payload.nationalite = v.nationalite;
      payload.numeroPieceIdentite = v.numeroPieceIdentite;
    }
    console.log("Payload envoyé :", payload);


    this.reservationService.creerReservationSmart(payload).subscribe({
      next: (created) => {
        this.dialog.open(DialogFeedbackComponent, {
          data: {
            titre: '✅ Réservation réussie',
            message: 'La réservation a été enregistrée avec succès.'
          }
        });
        // 👉 on renvoie la réservation créée au parent pour MAJ instantanée
        this.dialogRef.close(created);
      },
      error: (err) => {
        this.dialog.open(DialogFeedbackComponent, {
          data: {
            titre: '❌ Échec de la réservation',
            message: err?.error?.message || 'Une erreur est survenue lors de la réservation.'
          }
        });
      }
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
