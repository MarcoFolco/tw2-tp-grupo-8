import { Component, computed, inject, signal } from '@angular/core';
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
  searchText = signal('');

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

  filterProducts = computed(() => {
    const query = this.searchText().toLowerCase().trim();
    if (!query) return this.products();
    return this.products().filter(p => p.nombre.toLowerCase().includes(query))
  })

  updateText(event: Event): void {
    const text = event.target as HTMLInputElement;
    this.searchText.set(text.value);
  }
}
