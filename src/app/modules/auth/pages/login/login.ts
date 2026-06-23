import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
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
  emailNoVerificado = signal(false);
  loading = signal(false);
  resendLoading = signal(false);
  resendSent = signal(false);

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    this.loading.set(true);
    this.errorMessage.set(null);
    this.emailNoVerificado.set(false);
    this.resendSent.set(false);

    this.authService.login(email!, password!).subscribe({
      next: () => void this.router.navigate(['/products']),
      error: (err: HttpErrorResponse) => {
        if (err.status === 403 && err.error?.error === 'EMAIL_NO_VERIFICADO') {
          this.emailNoVerificado.set(true);
        } else {
          this.errorMessage.set('Email o contraseña incorrectos.');
        }
        this.loading.set(false);
      },
    });
  }

  onResendVerification(): void {
    const email = this.loginForm.value.email;
    if (!email) return;

    this.resendLoading.set(true);
    this.authService.resendVerification(email).subscribe({
      next: () => {
        this.resendSent.set(true);
        this.resendLoading.set(false);
      },
      error: () => {
        this.resendSent.set(true);
        this.resendLoading.set(false);
      },
    });
  }
}
