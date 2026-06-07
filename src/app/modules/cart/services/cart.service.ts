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
}
