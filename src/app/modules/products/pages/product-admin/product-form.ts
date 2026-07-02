import { Component, inject, signal, OnInit } from '@angular/core';
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

  idEditando = signal<number | null>(null);
  
  productoForm = {
    nombre: '',
    slug: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagenUrl: '',
    categoriaId: 1 
  };

    ngOnInit() {
    const slugUrl = this.route.snapshot.paramMap.get('id');
    
    if (slugUrl) {
      this.productService.getProductBySlug(slugUrl).subscribe({
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
        error: (err) => {
          console.error("No se pudo cargar el producto para editar", err);
        }
      });
    }
  }

  guardar() {
    const id = this.idEditando();

    if (id) {
      this.productService.actualizarProducto(id, this.productoForm).subscribe({
        next: () => {
          alert("Producto editado con éxito");
          this.router.navigate(['/admin/products']); // Lo devolvemos a la tabla
        }
      });
    } else {
      this.productService.crearProducto(this.productoForm).subscribe({
        next: () => {
          alert("Producto creado con éxito");
          this.router.navigate(['/admin/products']); 
        }
      });
    }
  }
}