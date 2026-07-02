import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ProductAdminPage } from './modules/products/pages/product-admin/product-admin';
import { ProductFormPage } from './modules/products/pages/product-admin/product-form';
import { adminGuard } from './core/guards/admin.guards';

export const routes: Routes = [

  {
    path: 'admin/products',
    component: ProductAdminPage,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/products/new',
    component: ProductFormPage,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/products/edit/:id',
    component: ProductFormPage,
    canActivate: [adminGuard]
  },

  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./modules/products/products.routes').then(
        (m) => m.productsRoutes
      ),
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/cart/cart.routes').then((m) => m.cartRoutes),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/orders/orders.routes').then((m) => m.ordersRoutes),
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
