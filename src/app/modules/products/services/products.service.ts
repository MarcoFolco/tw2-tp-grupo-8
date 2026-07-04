import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/producto.interface';
import { environment } from '../../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getProducts(filters: { nombre?: string; categoriaId?: number } = {}): Observable<Producto[]> {
    let params = new HttpParams();
    if (filters.nombre) params = params.set('nombre', filters.nombre);
    if (filters.categoriaId) params = params.set('categoria', filters.categoriaId);
    return this.http.get<Producto[]>(`${environment.apiUrl}/productos`, { params });
  }

  getProductBySlug(slug: string): Observable<Producto> {
    return this.http.get<Producto>(`${environment.apiUrl}/productos/${slug}`);
  }

  crearProducto(producto: Partial<Producto>): Observable<Producto> {
    return this.http.post<Producto>(`${environment.apiUrl}/productos`, producto);
  }

  actualizarProducto(id: number, datosNuevos: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${environment.apiUrl}/productos/${id}`, datosNuevos);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/productos/${id}`);
  }
}
