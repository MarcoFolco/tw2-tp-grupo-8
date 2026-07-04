import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { ProductService } from '../../services/products.service';
import { ProductFormComponent, ProductoFormData } from '../../components/product-form/product-form';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [RouterLink, Button, ProductFormComponent],
  templateUrl: './product-create.html',
})
export class ProductCreatePage {
  private productService = inject(ProductService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  crearProducto(data: ProductoFormData) {
    this.productService.crearProducto(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => void this.router.navigate(['/products/admin']),
        error: (err) => console.error('Error al crear producto', err),
      });
  }
}
