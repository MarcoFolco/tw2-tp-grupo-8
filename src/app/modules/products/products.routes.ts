import { Routes } from '@angular/router';
import { ProductListPage } from './pages/product-list/product-list';
import { ProductDetailPage } from './pages/product-detail/product-detail';

export const productsRoutes: Routes = [
  {
    path: '',
    component: ProductListPage,
  },
  {
    path: ':id',
    component: ProductDetailPage,
  },
];
