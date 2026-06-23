import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/products.service';
import { Producto } from '../../interfaces/producto.interface';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-product-detail-page',
  templateUrl: './product-detail.html',
  imports: [ProgressSpinnerModule],
})
export class ProductDetailPage implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  private productService = inject(ProductService);
  readonly product = signal<Producto | null>(null);
  readonly error = signal<string | null>(null);
  readonly loading = signal<boolean>(false);

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const slug = params['slug'];
      if (!slug) return;
      this.loadProductBySlug(slug);
    })
  }

  private loadProductBySlug(slug: string) {
    this.error.set(null);
    this.loading.set(true);

    this.productService.getProductBySlug(slug).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error);
        this.loading.set(false);
      },
    });
  }
}
