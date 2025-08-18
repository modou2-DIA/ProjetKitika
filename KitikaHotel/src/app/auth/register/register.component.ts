import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { API } from '../../services/api';
@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  f!: FormGroup;
  private apiUrl = 'http://localhost:8080/api/auth/register';
  // Utilisez l'API constante pour la version distante
  //private apiUrl = API + 'auth/register';
   ngOnInit() {
     this.f = this.fb.group({
    nom: ['', Validators.required],
    prenom: [''],
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', Validators.required],
    role: ['']
  });
  }

  constructor(private fb: FormBuilder, private http: HttpClient) {}
  submit() {
    if (this.f.invalid) return;
    this.http.post(this.apiUrl, this.f.value).subscribe({
      next: () => alert('Compte créé'),
      error: () => alert('Erreur')
    });
  }
}
