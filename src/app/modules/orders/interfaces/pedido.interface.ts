import { Usuario } from '../../auth/interfaces/usuario.interface';
import { ItemPedido } from './item-pedido.interface';

export interface Pedido {
  id: number;
  usuario: Usuario;
  items: ItemPedido[];
  fecha: Date;
  total: number;
}
