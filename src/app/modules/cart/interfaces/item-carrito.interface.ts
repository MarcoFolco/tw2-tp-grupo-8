import { Producto } from '../../products/interfaces/producto.interface';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}
