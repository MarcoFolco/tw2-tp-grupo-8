import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/products.service';
import { CurrencyPipe } from '@angular/common';
import { Producto } from '../../interfaces/producto.interface';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-product-admin',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, TableModule, Button, Tag],
  templateUrl: './product-admin.html',
})
export class ProductAdminPage implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  productos = signal<Producto[]>([]);

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productService.getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (datos) => this.productos.set(datos),
        error: (err) => console.error(err),
      });
  }

  borrarProducto(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productService.eliminarProducto(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            alert('Producto eliminado con éxito');
            this.productos.set(this.productos().filter(p => p.id !== id));
          },
          error: () => alert('Hubo un error al borrar el producto'),
        });
    }
  }
}
