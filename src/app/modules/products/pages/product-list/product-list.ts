import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../../services/products.service';
import { Producto } from '../../interfaces/producto.interface';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProductCardComponent } from "../../components/product-card/product-card";

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [ProgressSpinnerModule, ProductCardComponent],
  templateUrl: './product-list.html',
})
export class ProductListPage {
  private readonly productsService = inject(ProductService);
  products = signal<Producto[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.error.set(null);

    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error.message);
        this.loading.set(false);
      }
    });
  }
}
