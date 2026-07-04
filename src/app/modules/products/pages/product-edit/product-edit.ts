import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { ProductService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { Producto } from '../../interfaces/producto.interface';
import { Categoria } from '../../interfaces/categoria.interface';
import { ProductFormComponent, ProductoFormData } from '../../components/product-form/product-form';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [RouterLink, Button, ProductFormComponent],
  templateUrl: './product-edit.html',
})
export class ProductEditPage implements OnInit {
  private productService = inject(ProductService);
  private categoriesService = inject(CategoriesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  producto = signal<Producto | undefined>(undefined);
  categorias = signal<Categoria[]>([]);

  ngOnInit() {
    this.categoriesService.getCategorias()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (cats) => this.categorias.set(cats) });

    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) return;

    this.productService.getProductBySlug(slug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (p) => this.producto.set(p),
        error: (err) => console.error('Error al cargar producto', err),
      });
  }

  actualizarProducto(data: ProductoFormData) {
    const id = this.producto()?.id;
    if (!id) return;

    this.productService.actualizarProducto(id, data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => void this.router.navigate(['/products/admin']),
        error: (err) => console.error('Error al actualizar producto', err),
      });
  }
}
