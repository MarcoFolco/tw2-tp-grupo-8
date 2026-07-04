import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/products.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './product-form.html',
})
export class ProductFormPage implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  idEditando = signal<number | null>(null);

  productoForm = {
    nombre: '',
    slug: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagenUrl: '',
    categoriaId: 1,
  };

  ngOnInit() {
    const slugUrl = this.route.snapshot.paramMap.get('id');

    if (slugUrl) {
      this.productService.getProductBySlug(slugUrl)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (prod) => {
            this.idEditando.set(prod.id);
            this.productoForm.nombre = prod.nombre;
            this.productoForm.slug = prod.slug;
            this.productoForm.descripcion = prod.descripcion;
            this.productoForm.precio = prod.precio;
            this.productoForm.stock = prod.stock;
            this.productoForm.imagenUrl = prod.imagenUrl;
            this.productoForm.categoriaId = prod.categoria.id;
          },
          error: (err) => console.error('No se pudo cargar el producto para editar', err),
        });
    }
  }

  guardar() {
    const id = this.idEditando();

    if (id) {
      this.productService.actualizarProducto(id, this.productoForm)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            alert('Producto editado con éxito');
            void this.router.navigate(['/admin/products']);
          },
        });
    } else {
      this.productService.crearProducto(this.productoForm)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            alert('Producto creado con éxito');
            void this.router.navigate(['/admin/products']);
          },
        });
    }
  }
}
