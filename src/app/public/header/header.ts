import { Component, inject, computed } from '@angular/core';
<<<<<<< HEAD
import { Router, RouterLink } from '@angular/router';
=======
import { Router } from '@angular/router';
>>>>>>> 79a35bf231facb0271c0b97451b8d2ae92a3ab7e
import { Menubar } from 'primeng/menubar';
import { Button } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../modules/auth/services/auth.service';
<<<<<<< HEAD
import { CartService } from '../../modules/cart/services/cart.service';
=======
>>>>>>> 79a35bf231facb0271c0b97451b8d2ae92a3ab7e

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
<<<<<<< HEAD
  imports: [Menubar, Button, RouterLink],
})
export class HeaderComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  private router = inject(Router);

  menuItems = computed<MenuItem[]>(() => {
    const loggedIn = this.authService.isLoggedIn();
    const count = this.cartService.totalItems(); // 1. Obtener la cantidad de items

=======
  imports: [Menubar, Button],
})
export class HeaderComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  // Los ítems del menú se recalculan automáticamente cuando cambia el estado de sesión
  menuItems = computed<MenuItem[]>(() => {
    const loggedIn = this.authService.isLoggedIn();
>>>>>>> 79a35bf231facb0271c0b97451b8d2ae92a3ab7e
    return [
      {
        label: 'Productos',
        icon: 'pi pi-shopping-bag',
        routerLink: '/products',
      },
      ...(loggedIn
        ? [
<<<<<<< HEAD
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


=======
            { label: 'Carrito', icon: 'pi pi-shopping-cart', routerLink: '/cart' },
            { label: 'Mis Pedidos', icon: 'pi pi-list', routerLink: '/orders' },
          ]
        : [
            { label: 'Iniciar Sesión', icon: 'pi pi-sign-in', routerLink: '/auth/login' },
            { label: 'Registrarse', icon: 'pi pi-user-plus', routerLink: '/auth/register' },
          ]),
    ];
  });

>>>>>>> 79a35bf231facb0271c0b97451b8d2ae92a3ab7e
  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/auth/login']);
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 79a35bf231facb0271c0b97451b8d2ae92a3ab7e
