import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-view-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, Card, Button, Divider],
  templateUrl: './cart-view.html',
})
export class CartViewPage {
  readonly cartService = inject(CartService);
}
