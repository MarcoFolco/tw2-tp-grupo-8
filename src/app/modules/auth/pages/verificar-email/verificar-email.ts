import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { AuthService } from '../../services/auth.service';

type Estado = 'cargando' | 'ok' | 'expirado' | 'invalido';

@Component({
  selector: 'app-verificar-email-page',
  templateUrl: './verificar-email.html',
  imports: [RouterLink, Card, Button, ProgressSpinner],
})
export class VerificarEmailPage implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  estado = signal<Estado>('cargando');

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.estado.set('invalido');
      return;
    }

    this.authService.verifyEmail(token)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.estado.set('ok'),
        error: (err: HttpErrorResponse) => {
          if (err.status === 410) {
            this.estado.set('expirado');
          } else {
            this.estado.set('invalido');
          }
        },
      });
  }
}
