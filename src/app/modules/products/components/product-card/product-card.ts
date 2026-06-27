<<<<<<< HEAD
import { Component, computed, input, inject } from '@angular/core';
=======
import { Component, computed, input, OnInit } from '@angular/core';
>>>>>>> 79a35bf231facb0271c0b97451b8d2ae92a3ab7e
import { CurrencyPipe, NgClass } from '@angular/common';
import { Producto } from '../../interfaces/producto.interface';
import { CardModule } from "primeng/card";
import { RouterLink } from "@angular/router";
import { CardStock } from '../../interfaces/stock.interface';
<<<<<<< HEAD
import { CartService } from '../../../cart/services/cart.service';

=======
>>>>>>> 79a35bf231facb0271c0b97451b8d2ae92a3ab7e
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  standalone: true,
  imports: [CurrencyPipe, CardModule, RouterLink, NgClass]
})
export class ProductCardComponent {
<<<<<<< HEAD
  producto = input.required<Producto>();
  cartService = inject(CartService);

  readonly stockStatus = computed<CardStock>(() => {
    const stock = this.producto().stock;
    if (stock > 10) return { classStyle: "bg-green-700", icon: "pi pi-check", label: "Disponible" }
    if (stock > 0) return { classStyle: "bg-yellow-500", icon: "pi pi-clock", label: "Ultimas unidades" }
    return { classStyle: "bg-red-500", icon: "pi pi-times", label: "Sin stock" }
  })
}
=======

  producto = input.required<Producto>();

  readonly stockStatus = computed<CardStock>(() => {
    const stock = this.producto().stock;

    if (stock > 10) {
      return {
        classStyle: "bg-green-700",
        icon: "pi pi-check",
        label: "Disponible"
      }
    }
    if (stock > 0) {
      return {
        classStyle: "bg-yellow-500",
        icon: "pi pi-clock",
        label: "Ultimas unidades"
      }
    }
    return {
      classStyle: "bg-red-500",
      icon: "pi pi-times",
      label: "Sin stock"
    }
  })
}
>>>>>>> 79a35bf231facb0271c0b97451b8d2ae92a3ab7e
