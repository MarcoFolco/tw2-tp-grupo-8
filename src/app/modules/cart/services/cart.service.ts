import { Injectable, signal, computed } from '@angular/core';
import { ItemCarrito } from '../interfaces/item-carrito.interface';
import { Producto } from '../../products/interfaces/producto.interface';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<ItemCarrito[]>([]);

  readonly items = this._items.asReadonly();
  readonly totalItems = computed(() =>
    this._items().reduce((acc, item) => acc + item.cantidad, 0)
  );
  readonly totalPrice = computed(() =>
    this._items().reduce((acc, item) => {
      const precio = item.producto.oferta?.precioOferta ?? item.producto.precio;
      return acc + precio * item.cantidad;
    }, 0)
  );

  agregar(producto: Producto): void {
    const items = this._items();
    const existente = items.find(i => i.producto.id === producto.id);
    if (existente) {
      this._items.set(items.map(i =>
        i.producto.id === producto.id
          ? { ...i, cantidad: i.cantidad + 1 }
          : i
      ));
    } else {
      this._items.set([...items, { producto, cantidad: 1 }]);
    }
  }

  quitar(productoId: number): void {
    this._items.set(this._items().filter(i => i.producto.id !== productoId));
  }

  modificarCantidad(productoId: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.quitar(productoId);
      return;
    }
    this._items.set(this._items().map(i =>
      i.producto.id === productoId ? { ...i, cantidad } : i
    ));
  }

  vaciar(): void {
    this._items.set([]);
  }
}