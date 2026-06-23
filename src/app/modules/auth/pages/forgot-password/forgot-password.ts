import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password.html',
  imports: [ReactiveFormsModule, RouterLink, Card, InputText, Button, Message],
})
export class ForgotPasswordPage {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  loading = signal(false);
  enviado = signal(false);

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.authService.requestPasswordReset(this.form.value.email!).subscribe({
      next: () => {
        this.enviado.set(true);
        this.loading.set(false);
      },
      error: () => {
        this.enviado.set(true);
        this.loading.set(false);
      },
    });
  }
}
