import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/products.service';
import { Producto } from '../../interfaces/producto.interface';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductNotFound } from "../../components/product-not-found/product-not-found";
import { CartService } from '../../../cart/services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-detail-page',
  templateUrl: './product-detail.html',
  imports: [ProgressSpinnerModule, ProductNotFound, CurrencyPipe],
})
export class ProductDetailPage implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  private productService = inject(ProductService);
  readonly cartService = inject(CartService);
  readonly product = signal<Producto | null>(null);
  readonly error = signal<HttpErrorResponse | null>(null);
  readonly loading = signal<boolean>(false);

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const slug = params['slug'];
      if (!slug) return;
      this.loadProductBySlug(slug);
    })
  }

  private loadProductBySlug(slug: string) {
    this.error.set(null);
    this.loading.set(true);

    this.productService.getProductBySlug(slug).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(error);
        this.loading.set(false);
      },
    });
  }
}