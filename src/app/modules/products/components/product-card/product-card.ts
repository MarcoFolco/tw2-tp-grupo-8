import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Producto } from '../../interfaces/producto.interface';
import { CardModule } from "primeng/card";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  standalone: true,
  imports: [CurrencyPipe, CardModule, RouterLink]
})
export class ProductCardComponent {
  producto = input.required<Producto>();
}
