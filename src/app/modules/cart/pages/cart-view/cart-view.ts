import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { CartService } from '../../services/cart.service';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-cart-view-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, Card, Button, Divider],
  templateUrl: './cart-view.html',
})
export class CartViewPage {
  
  readonly cartService = inject(CartService);

  readonly authService = inject(AuthService);

  finalizarCompra() {
    const usuarioReal = this.authService.currentUser()?.id; 

    if (!usuarioReal) {
      alert('Debes iniciar sesión para comprar');
      return;
    }

    this.cartService.checkout(usuarioReal).subscribe({
      
      next: () => { 
        alert('¡Éxito! Tu pedido fue enviado.');
        this.cartService.vaciar(); 
      },
      
      error: (error: HttpErrorResponse) => { 
        alert('Hubo un problema al crear el pedido.');
        console.error('El error del servidor es:', error.message);
      }
    });
  }
}