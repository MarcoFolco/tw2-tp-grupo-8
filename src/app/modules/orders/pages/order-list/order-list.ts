import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-list-page',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './order-list.html',
})
export class OrderListPage implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  pedidos = signal<any[]>([]);

  ngOnInit() {
    this.cargarMisPedidos();
  }

  cargarMisPedidos() {
    const usuarioId = this.authService.currentUser()!.id;

    this.ordersService.obtenerMisPedidos(usuarioId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (datos) => this.pedidos.set(datos),
        error: (error) => console.error('Error al cargar los pedidos', error),
      });
  }
}
