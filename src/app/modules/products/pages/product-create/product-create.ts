import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { ProductService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { Categoria } from '../../interfaces/categoria.interface';
import { ProductFormComponent, ProductoFormData } from '../../components/product-form/product-form';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [RouterLink, Button, ProductFormComponent],
  templateUrl: './product-create.html',
})
export class ProductCreatePage implements OnInit {
  private productService = inject(ProductService);
  private categoriesService = inject(CategoriesService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  categorias = signal<Categoria[]>([]);

  ngOnInit() {
    this.categoriesService.getCategorias()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (cats) => this.categorias.set(cats) });
  }

  crearProducto(data: ProductoFormData) {
    this.productService.crearProducto(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => void this.router.navigate(['/products/admin']),
        error: (err) => console.error('Error al crear producto', err),
      });
  }
}
