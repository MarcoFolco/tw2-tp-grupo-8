import { Routes } from '@angular/router';
import { OrderListPage } from './pages/order-list/order-list';
import { OrderDetailPage } from './pages/order-detail/order-detail';

export const ordersRoutes: Routes = [
  {
    path: '',
    component: OrderListPage,
  },
  {
    path: ':id',
    component: OrderDetailPage,
  },
];
