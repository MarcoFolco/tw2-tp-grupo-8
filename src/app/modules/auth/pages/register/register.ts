import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register.html',
  imports: [ReactiveFormsModule, RouterLink, Card, InputText, Password, Button, Message],
})
export class RegisterPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  registerForm = this.fb.group(
    {
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required]],
      password: ['', [Validators.required, this.passwordComplexityValidator()]],
      confirmarPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator() },
  );

  errorMessage = signal<string | null>(null);
  loading = signal(false);

  get passwordErrors(): string | null {
    const errors = this.registerForm.get('password')?.errors;
    if (!errors) return null;
    return typeof errors['complexity'] === 'string' ? errors['complexity'] : null;
  }

  get passwordMismatch(): boolean {
    return (
      this.registerForm.hasError('mismatch') &&
      (this.registerForm.get('confirmarPassword')?.touched ?? false)
    );
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const { confirmarPassword: _c, ...formData } = this.registerForm.value;
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService
      .register({
        nombre: formData.nombre!,
        apellido: formData.apellido!,
        email: formData.email!,
        direccion: formData.direccion!,
        password: formData.password!,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => void this.router.navigate(['/auth/email-enviado']),
        error: (err: HttpErrorResponse) => {
          const msg =
            typeof err.error?.error === 'string'
              ? err.error.error
              : 'Error al registrarse. Intentá de nuevo.';
          this.errorMessage.set(msg);
          this.loading.set(false);
        },
      });
  }

  private passwordComplexityValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value as string;
      if (!value) return null;
      const missing: string[] = [];
      if (value.length < 8) missing.push('mínimo 8 caracteres');
      if (!/[A-Z]/.test(value)) missing.push('una mayúscula');
      if (!/[a-z]/.test(value)) missing.push('una minúscula');
      if (!/[0-9]/.test(value)) missing.push('un número');
      return missing.length ? { complexity: 'Requerido: ' + missing.join(', ') } : null;
    };
  }

  private passwordMatchValidator(): ValidatorFn {
    return (group: AbstractControl) => {
      const password = group.get('password')?.value as string;
      const confirm = group.get('confirmarPassword')?.value as string;
      return password === confirm ? null : { mismatch: true };
    };
  }
}
