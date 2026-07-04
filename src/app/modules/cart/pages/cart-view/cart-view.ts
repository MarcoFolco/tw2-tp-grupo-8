import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../../auth/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cart-view-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, Card, Button, Divider],
  templateUrl: './cart-view.html',
})
export class CartViewPage {
  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  finalizarCompra() {
    const usuarioId = this.authService.currentUser()!.id;

    this.cartService.checkout(usuarioId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.cartService.vaciar();
          this.messageService.add({
            severity: 'success',
            summary: 'Pedido confirmado',
            detail: '¡Tu pedido fue enviado con éxito!',
          });
        },
        error: (error: HttpErrorResponse) => {
          const detalle = error.status === 422
            ? error.error?.error
            : 'Hubo un problema al crear el pedido.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error al confirmar',
            detail: detalle,
          });
        },
      });
  }
}
