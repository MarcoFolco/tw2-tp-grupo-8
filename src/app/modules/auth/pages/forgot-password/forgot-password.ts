import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password.html',
  imports: [ReactiveFormsModule, RouterLink, Card, InputText, Button],
})
export class ForgotPasswordPage {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  loading = signal(false);
  enviado = signal(false);

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.authService.requestPasswordReset(this.form.value.email!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
