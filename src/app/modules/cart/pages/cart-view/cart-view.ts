<<<<<<< HEAD
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
=======
import { Component } from '@angular/core';

@Component({
  selector: 'app-cart-view-page',
  templateUrl: './cart-view.html',
})
export class CartViewPage {}
>>>>>>> 79a35bf231facb0271c0b97451b8d2ae92a3ab7e
