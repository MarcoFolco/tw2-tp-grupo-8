import { Component, input, output } from '@angular/core';
import { Producto } from '../../interfaces/producto.interface';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
})
export class ProductCardComponent {
  producto = input.required<Producto>();
  agregarAlCarrito = output<Producto>();
}
