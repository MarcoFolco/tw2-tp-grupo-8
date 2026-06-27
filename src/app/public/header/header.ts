import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Menubar } from 'primeng/menubar';
import { Button } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../modules/auth/services/auth.service';
import { CartService } from '../../modules/cart/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [Menubar, Button, RouterLink],
})
export class HeaderComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  private router = inject(Router);

  menuItems = computed<MenuItem[]>(() => {
    const loggedIn = this.authService.isLoggedIn();
    const count = this.cartService.totalItems(); // 1. Obtener la cantidad de items

    return [
      {
        label: 'Productos',
        icon: 'pi pi-shopping-bag',
        routerLink: '/products',
      },
      ...(loggedIn
        ? [
          {
            label: 'Carrito',
            icon: 'pi pi-shopping-cart',
            routerLink: '/cart',
            // 2. Mostrar la notificación solo si hay productos agregados
            badge: count > 0 ? count.toString() : undefined,
            badgeStyleClass: 'p-badge-danger'
          },
          { label: 'Mis Pedidos', icon: 'pi pi-list', routerLink: '/orders' },
        ]
        : [
          { label: 'Iniciar Sesión', icon: 'pi pi-sign-in', routerLink: '/auth/login' },
          { label: 'Registrarse', icon: 'pi pi-user-plus', routerLink: '/auth/register' },
        ]),
    ];
  });


  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/auth/login']);
  }
}