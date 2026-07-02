
import { Component, inject, signal, OnInit } from '@angular/core';
import { ProductService } from '../../services/products.service';
import { CurrencyPipe } from '@angular/common';
import { Producto } from '../../interfaces/producto.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-admin',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-admin.html',
})
export class ProductAdminPage implements OnInit {
  private readonly productService = inject(ProductService);

  // Aquí guardaremos la lista de productos
  productos = signal<Producto[]>([]);

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productService.getProducts().subscribe({
      next: (datos) => this.productos.set(datos),
      error: (err) => console.error(err)
    });
  }

  borrarProducto(id: number) {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      this.productService.eliminarProducto(id).subscribe({
        next: () => {
          alert("Producto eliminado con éxito");
          this.productos.set(this.productos().filter(p => p.id !== id));
        },
        error: () => alert("Hubo un error al borrar el producto")
      });
    }
  }
}