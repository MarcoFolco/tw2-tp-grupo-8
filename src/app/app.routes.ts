import { Routes } from '@angular/router';

export const routes: Routes = [
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
    // canActivate: [authGuard]  ← agregar cuando esté implementado
    loadChildren: () =>
      import('./modules/cart/cart.routes').then((m) => m.cartRoutes),
  },
  {
    path: 'orders',
    // canActivate: [authGuard]  ← agregar cuando esté implementado
    loadChildren: () =>
      import('./modules/orders/orders.routes').then((m) => m.ordersRoutes),
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
