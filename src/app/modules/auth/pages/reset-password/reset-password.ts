import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Card } from 'primeng/card';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { AuthService } from '../../services/auth.service';

type Estado = 'formulario' | 'exito' | 'expirado' | 'invalido';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password.html',
  imports: [ReactiveFormsModule, RouterLink, Card, Password, Button, Message],
})
export class ResetPasswordPage implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  private token = '';

  form = this.fb.group(
    {
      password: ['', [Validators.required, this.passwordComplexityValidator()]],
      confirmarPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator() },
  );

  estado = signal<Estado>('formulario');
  loading = signal(false);

  get passwordErrors(): string | null {
    const errors = this.form.get('password')?.errors;
    if (!errors) return null;
    return typeof errors['complexity'] === 'string' ? errors['complexity'] : null;
  }

  get passwordMismatch(): boolean {
    return (
      this.form.hasError('mismatch') &&
      (this.form.get('confirmarPassword')?.touched ?? false)
    );
  }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.estado.set('invalido');
      return;
    }
    this.token = token;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.authService.resetPassword(this.token, this.form.value.password!).subscribe({
      next: () => {
        this.estado.set('exito');
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 410) {
          this.estado.set('expirado');
        } else {
          this.estado.set('invalido');
        }
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
