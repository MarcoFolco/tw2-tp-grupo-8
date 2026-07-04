import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/products.service';
import { CurrencyPipe } from '@angular/common';
import { Producto } from '../../interfaces/producto.interface';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-admin',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, TableModule, Button, Tag, ConfirmDialog],
  templateUrl: './product-admin.html',
})
export class ProductAdminPage implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
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
    this.confirmationService.confirm({
      message: '¿Estás seguro de que querés eliminar este producto?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.productService.eliminarProducto(id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.productos.set(this.productos().filter(p => p.id !== id));
              this.messageService.add({
                severity: 'success',
                summary: 'Producto eliminado',
                detail: 'El producto fue eliminado correctamente.',
              });
            },
            error: () => this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el producto.',
            }),
          });
      },
    });
  }
}
