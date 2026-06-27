import { Categoria } from './categoria.interface';
import { Oferta } from './oferta.interface';
export interface Producto {
  id: number,
  nombre: string,
  slug: string,
  descripcion: string,
  categoria: Categoria,
  precio: number,
  stock: number,
  imagenUrl: string,
  oferta: Oferta | null
}
