import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/products.service';
import { Producto } from '../../interfaces/producto.interface';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductNotFound } from "../../components/product-not-found/product-not-found";
<<<<<<< HEAD
import { CartService } from '../../../cart/services/cart.service';
import { CurrencyPipe } from '@angular/common';
=======
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CartService } from '../../../cart/services/cart.service';
import { AuthService } from '../../../auth/services/auth.service';
>>>>>>> b6c5a7f926770cd859799b0ed006eba519e88c7a

@Component({
  selector: 'app-product-detail-page',
  templateUrl: './product-detail.html',
<<<<<<< HEAD
  imports: [ProgressSpinnerModule, ProductNotFound, CurrencyPipe],
=======
  imports: [ProgressSpinnerModule,
    ProductNotFound,
    Card,
    Button,
    RouterLink,
    CurrencyPipe,
    NgClass],
>>>>>>> b6c5a7f926770cd859799b0ed006eba519e88c7a
})
export class ProductDetailPage implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  private productService = inject(ProductService);
<<<<<<< HEAD
  readonly cartService = inject(CartService);
=======
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

>>>>>>> b6c5a7f926770cd859799b0ed006eba519e88c7a
  readonly product = signal<Producto | null>(null);
  readonly error = signal<HttpErrorResponse | null>(null);
  readonly loading = signal<boolean>(false);



  // Señal computada para calcular la etiqueta y los estilos del stock
  readonly stockStatus = computed(() => {
    const prod = this.product();
    if (!prod) return null;

    const stock = prod.stock;
    if (stock > 10) {
      return { classStyle: 'bg-green-700', icon: 'pi pi-check', label: 'Disponible' };
    }
    if (stock > 0) {
      return { classStyle: 'bg-yellow-500', icon: 'pi pi-clock', label: 'Últimas unidades' };
    }
    return { classStyle: 'bg-red-500', icon: 'pi pi-times', label: 'Sin stock' };
  });


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
<<<<<<< HEAD
}
=======

  // Método para agregar el producto al carrito de compras
  agregarAlCarrito(): void {
    const prod = this.product();
    if (!prod) return;

    // Si el usuario no está logueado, lo mandamos al login
    if (!this.authService.isLoggedIn()) {
      void this.router.navigate(['/auth/login']);
      return;
    }

    // Si está logueado, lo agregamos al carrito
    this.cartService.agregar(prod);
  }

}
>>>>>>> b6c5a7f926770cd859799b0ed006eba519e88c7a
