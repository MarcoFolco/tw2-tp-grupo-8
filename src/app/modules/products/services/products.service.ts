import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/producto.interface';
import { environment } from '../../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private readonly http = inject(HttpClient);

  getProducts(categoria?: string): Observable<Producto[]> {

    let params = new HttpParams();

    if (categoria) {
      params = params.set('categoria', categoria);
    }

    return this.http.get<Producto[]>(`${environment.apiUrl}/productos`, { params });
  }

  buscarProductosPorNombre(nombre: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${environment.apiUrl}/productos`, {
      params: { nombre: nombre }
    });
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