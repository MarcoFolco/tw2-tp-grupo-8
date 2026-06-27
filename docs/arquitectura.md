# Arquitectura del Frontend

E-commerce UNLAM — Taller Web II · Grupo 8

---

## Estructura de carpetas

```
src/app/
│
├── public/                          # Shell de la aplicación (siempre visible)
│   ├── header/
│   │   ├── header.ts
│   │   └── header.html
│   └── footer/
│       ├── footer.ts
│       └── footer.html
│
├── modules/                         # Features del e-commerce, una carpeta por dominio
│   │
│   ├── auth/
│   │   ├── interfaces/
│   │   │   └── usuario.interface.ts
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   │   ├── login.ts
│   │   │   │   └── login.html
│   │   │   └── register/
│   │   │       ├── register.ts
│   │   │       └── register.html
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   └── auth.routes.ts
│   │
│   ├── products/
│   │   ├── interfaces/
│   │   │   ├── categoria.interface.ts
│   │   │   ├── oferta.interface.ts
│   │   │   └── producto.interface.ts
│   │   ├── components/
│   │   │   └── product-card/
│   │   │       ├── product-card.ts
│   │   │       └── product-card.html
│   │   ├── pages/
│   │   │   ├── product-list/
│   │   │   │   ├── product-list.ts
│   │   │   │   └── product-list.html
│   │   │   └── product-detail/
│   │   │       ├── product-detail.ts
│   │   │       └── product-detail.html
│   │   ├── services/
│   │   │   ├── products.service.ts
│   │   │   └── categories.service.ts
│   │   └── products.routes.ts
│   │
│   ├── cart/
│   │   ├── interfaces/
│   │   │   └── item-carrito.interface.ts
│   │   ├── pages/
│   │   │   └── cart-view/
│   │   │       ├── cart-view.ts
│   │   │       └── cart-view.html
│   │   ├── services/
│   │   │   └── cart.service.ts
│   │   └── cart.routes.ts
│   │
│   └── orders/
│       ├── interfaces/
│       │   ├── item-pedido.interface.ts
│       │   └── pedido.interface.ts
│       ├── pages/
│       │   ├── order-list/
│       │   │   ├── order-list.ts
│       │   │   └── order-list.html
│       │   └── order-detail/
│       │       ├── order-detail.ts
│       │       └── order-detail.html
│       ├── services/
│       │   └── orders.service.ts
│       └── orders.routes.ts
│
├── core/                            # Infraestructura transversal
│   ├── guards/                      # authGuard, guestGuard
│   └── interceptors/                # JWT interceptor
│
└── shared/
    └── ui/                          # Componentes visuales reutilizables entre módulos
```

---

## Convenciones de nomenclatura

| Tipo              | Patrón de nombre              | Ejemplo                        |
|-------------------|-------------------------------|--------------------------------|
| Página (ruta)     | `nombre.ts`                   | `product-list.ts`              |
| Componente UI     | `nombre.ts`                   | `product-card.ts`              |
| Servicio          | `nombre.service.ts`           | `products.service.ts`          |
| Interfaz          | `nombre.interface.ts`         | `producto.interface.ts`        |
| Guard             | `nombre.guard.ts`             | `auth.guard.ts`                |
| Rutas del módulo  | `nombre.routes.ts`            | `products.routes.ts`           |

- Todos los archivos en `kebab-case`.
- Los selectores de componentes siguen el patrón `app-nombre` (ej. `app-product-card`).
- Sin sufijo `.component` en los archivos — convención del proyecto.

---

## Routing

El router usa lazy loading para todos los módulos. Cada módulo define sus propias rutas en `*.routes.ts`.

```
/                   → redirect a /products
/auth/login         → LoginPage
/auth/register      → RegisterPage
/products           → ProductListPage
/products/:id       → ProductDetailPage
/cart               → CartViewPage       [authGuard pendiente]
/orders             → OrderListPage      [authGuard pendiente]
/orders/:id         → OrderDetailPage    [authGuard pendiente]
**                  → redirect a /products
```

### Guards (a implementar en `core/guards/`)

- **`authGuard`**: redirige a `/auth/login` si el usuario no está autenticado. Protege `/cart` y `/orders`.
- **`guestGuard`**: redirige a `/products` si el usuario ya está autenticado. Protege `/auth/login` y `/auth/register`.

---

## Shell de la aplicación

`app.html` es el único layout. Header y footer son siempre visibles; la visibilidad de los links del header se controla con señales del `AuthService`.

```html
<app-header />
<main>
  <router-outlet />
</main>
<app-footer />
```

---

## Diferencia entre pages/ y components/ dentro de un módulo

- **`pages/`**: componentes que corresponden a una ruta. Se registran en `*.routes.ts`. No deben ser importados desde otros módulos.
- **`components/`**: sub-componentes reutilizables dentro del mismo módulo (ej. `ProductCardComponent` usado por `ProductListPage`).

Si un componente necesita ser reutilizado en más de un módulo, se mueve a `shared/ui/`.

---

## Dependencias entre módulos (interfaces)

Las interfaces se ubican en el módulo que "posee" esa entidad. Las referencias cruzadas son aceptables a nivel de interfaces:

```
products/interfaces/  →  sin dependencias externas
auth/interfaces/      →  sin dependencias externas
cart/interfaces/      →  importa de products/interfaces/
orders/interfaces/    →  importa de products/interfaces/ y auth/interfaces/
```
