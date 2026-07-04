import { Component, computed, input, inject } from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Producto } from '../../interfaces/producto.interface';
import { CardModule } from 'primeng/card';
import { Button } from 'primeng/button';
import { CardStock } from '../../interfaces/stock.interface';
import { CartService } from '../../../cart/services/cart.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  standalone: true,
  imports: [CurrencyPipe, CardModule, RouterLink, NgClass, Button],
})
export class ProductCardComponent {
  producto = input.required<Producto>();

  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  readonly stockStatus = computed<CardStock>(() => {
    const stock = this.producto().stock;
    if (stock > 10) return { classStyle: 'bg-green-700', icon: 'pi pi-check', label: 'Disponible' };
    if (stock > 0) return { classStyle: 'bg-yellow-500', icon: 'pi pi-clock', label: 'Últimas unidades' };
    return { classStyle: 'bg-red-500', icon: 'pi pi-times', label: 'Sin stock' };
  });

  agregarAlCarrito(): void {
    if (!this.authService.isLoggedIn()) {
      void this.router.navigate(['/auth/login']);
      return;
    }
    this.cartService.agregar(this.producto());
    this.messageService.add({
      severity: 'success',
      summary: 'Agregado al carrito',
      detail: this.producto().nombre,
      life: 3000,
    });
  }
}
