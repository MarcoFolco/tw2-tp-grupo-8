import { Component, inject, signal, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';


@Component({
  selector: 'app-order-detail-page',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './order-detail.html',
})
export class OrderDetailPage implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly route = inject(ActivatedRoute);

  detalle = signal<any>(null);

  ngOnInit() {
   
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.ordersService.obtenerDetallePedido(id).subscribe({
        next: (datos) => this.detalle.set(datos),
        error: (err) => console.error("Error al traer detalle:", err)
      });
    }
  }
}