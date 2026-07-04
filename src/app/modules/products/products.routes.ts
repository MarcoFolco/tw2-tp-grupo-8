import { Routes } from '@angular/router';
import { ProductListPage } from './pages/product-list/product-list';
import { ProductDetailPage } from './pages/product-detail/product-detail';
import { ProductAdminPage } from './pages/product-admin/product-admin';
import { ProductCreatePage } from './pages/product-create/product-create';
import { ProductEditPage } from './pages/product-edit/product-edit';
import { adminGuard } from '../../core/guards/admin.guards';

export const productsRoutes: Routes = [
  {
    path: '',
    component: ProductListPage,
  },
  {
    path: 'admin',
    component: ProductAdminPage,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/new',
    component: ProductCreatePage,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/edit/:slug',
    component: ProductEditPage,
    canActivate: [adminGuard],
  },
  {
    path: ':slug',
    component: ProductDetailPage,
  },
];
