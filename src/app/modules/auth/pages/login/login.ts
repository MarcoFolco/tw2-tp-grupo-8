import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.html',
  imports: [ReactiveFormsModule, RouterLink, Card, InputText, Password, Button, Message],
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  errorMessage = signal<string | null>(null);
  loading = signal(false);

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.login(email!, password!).subscribe({
      next: () => void this.router.navigate(['/products']),
      error: () => {
        this.errorMessage.set('Email o contraseña incorrectos.');
        this.loading.set(false);
      },
    });
  }
}
