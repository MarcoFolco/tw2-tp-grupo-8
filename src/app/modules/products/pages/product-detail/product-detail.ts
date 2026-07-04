import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from '../../services/products.service';
import { Producto } from '../../interfaces/producto.interface';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProductNotFound } from '../../components/product-not-found/product-not-found';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CartService } from '../../../cart/services/cart.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-product-detail-page',
  templateUrl: './product-detail.html',
  standalone: true,
  imports: [ProgressSpinnerModule, ProductNotFound, Card, Button, RouterLink, CurrencyPipe, NgClass],
})
export class ProductDetailPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);
  readonly cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly product = signal<Producto | null>(null);
  readonly error = signal<HttpErrorResponse | null>(null);
  readonly loading = signal<boolean>(false);

  readonly stockStatus = computed(() => {
    const prod = this.product();
    if (!prod) return null;
    const stock = prod.stock;
    if (stock > 10) return { classStyle: 'bg-green-700', icon: 'pi pi-check', label: 'Disponible' };
    if (stock > 0) return { classStyle: 'bg-yellow-500', icon: 'pi pi-clock', label: 'Últimas unidades' };
    return { classStyle: 'bg-red-500', icon: 'pi pi-times', label: 'Sin stock' };
  });

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const slug = params['slug'];
        if (!slug) return;
        this.loadProductBySlug(slug);
      });
  }

  private loadProductBySlug(slug: string) {
    this.error.set(null);
    this.loading.set(true);

    this.productService.getProductBySlug(slug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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

  agregarAlCarrito(): void {
    const prod = this.product();
    if (!prod) return;
    if (!this.authService.isLoggedIn()) {
      void this.router.navigate(['/auth/login']);
      return;
    }
    this.cartService.agregar(prod);
  }
}
