import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { Producto } from '../../interfaces/producto.interface';
import { Categoria } from '../../interfaces/categoria.interface';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Select } from 'primeng/select';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [FormsModule, ProgressSpinnerModule, Select, ProductCardComponent, SearchBarComponent],
  templateUrl: './product-list.html',
})
export class ProductListPage {
  private readonly productsService = inject(ProductService);
  private readonly categoriesService = inject(CategoriesService);

  categorias = signal<Categoria[]>([]);
  products = signal<Producto[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  categoriaId = signal<number | null>(null);
  nombre = signal<string>('');

  constructor() {
    this.categoriesService.getCategorias().subscribe({
      next: (cats) => this.categorias.set(cats),
    });

    // Se ejecuta cada vez que categoriaId o nombre cambian,
    // haciendo una sola llamada HTTP con ambos filtros aplicados.
    effect(() => {
      this.cargarProductos(this.categoriaId(), this.nombre());
    });
  }

  cargarProductos(categoriaId: number | null, nombre: string) {
    this.loading.set(true);
    this.error.set(null);

    this.productsService.getProducts({
      categoriaId: categoriaId ?? undefined,
      nombre: nombre || undefined,
    }).subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
