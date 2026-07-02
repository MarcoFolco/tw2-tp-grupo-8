import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

type Estado = 'cargando' | 'ok' | 'expirado' | 'invalido';

@Component({
  selector: 'app-verificar-email-page',
  templateUrl: './verificar-email.html',
  imports: [RouterLink, Card, Button, ProgressSpinner],
})
export class VerificarEmailPage implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  estado = signal<Estado>('cargando');

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.estado.set('invalido');
      return;
    }

    this.authService.verifyEmail(token).subscribe({
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
