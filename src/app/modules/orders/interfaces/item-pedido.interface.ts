import { Producto } from '../../products/interfaces/producto.interface';

export interface ItemPedido {
  id: number;
  pedidoId: number;
  producto: Producto;
  precioUnitario: number;
  cantidad: number;
}
