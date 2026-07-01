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

  getProductBySlug(slug: string): Observable<Producto> {
    return this.http.get<Producto>(`${environment.apiUrl}/productos/${slug}`);
  }
}