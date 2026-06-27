import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-view-page',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart-view.html',
})
export class CartViewPage {
  readonly cartService = inject(CartService);
}