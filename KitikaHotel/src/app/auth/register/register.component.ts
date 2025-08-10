import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  f!: FormGroup;
   ngOnInit() {
     this.f = this.fb.group({
    nom: ['', Validators.required],
    prenom: [''],
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', Validators.required],
    role: ['RECEPTIONNISTE']
  });
  }

  constructor(private fb: FormBuilder, private http: HttpClient) {}
  submit() {
    if (this.f.invalid) return;
    this.http.post('http://localhost:8080/api/auth/register', this.f.value).subscribe({
      next: () => alert('Compte créé'),
      error: () => alert('Erreur')
    });
  }
}
