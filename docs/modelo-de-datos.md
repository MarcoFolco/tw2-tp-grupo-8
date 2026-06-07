# Modelo de Datos

E-commerce UNLAM — Taller Web II · Grupo 8  
Stack: Angular 21 + Node.js / Express + PrimeNG 21 + PrimeFlex 4

---

## Entidades

### Usuario

| Campo      | Tipo   | Notas                                      |
|------------|--------|--------------------------------------------|
| `id`       | number |                                            |
| `email`    | string | único, usado como identificador de login   |
| `password` | string | hasheada en backend; nunca viaja al cliente|
| `nombre`   | string |                                            |
| `apellido` | string |                                            |
| `direccion`| string |                                            |

---

### Categoria

| Campo   | Tipo   | Notas                                        |
|---------|--------|----------------------------------------------|
| `id`    | number |                                              |
| `nombre`| string |                                              |
| `icono` | string | nombre del ícono de PrimeIcons (ej. `pi-tag`)|

Se modela como entidad propia (y no como un campo string en Producto) porque la UI de categorías requiere un listado estructurado con íconos. Permite además filtrar productos por categoría sin depender de strings exactos.

---

### Producto

| Campo         | Tipo      | Notas                                            |
|---------------|-----------|--------------------------------------------------|
| `id`          | number    |                                                  |
| `nombre`      | string    |                                                  |
| `descripcion` | string    |                                                  |
| `categoria`   | Categoria | relación con la entidad Categoria                |
| `precio`      | number    | precio de lista, siempre presente                |
| `stock`       | number    | cantidad disponible en inventario                |
| `imagenUrl`   | string    | necesaria para las product cards                 |

**Lógica de disponibilidad (frontend, no un campo):**
- `stock > 10` → "Disponible"
- `1 <= stock <= 10` → "Últimas X unidades"
- `stock === 0` → "Sin stock" (deshabilitar botón "Agregar al carrito")

---

### Oferta

| Campo         | Tipo   | Notas                                                |
|---------------|--------|------------------------------------------------------|
| `id`          | number |                                                      |
| `productoId`  | number | FK hacia Producto                                    |
| `precioOferta`| number | precio especial durante el período de la oferta      |
| `fechaInicio` | Date   |                                                      |
| `fechaFin`    | Date   |                                                      |

Una sola oferta activa por producto a la vez. El backend valida esta restricción al crear una oferta nueva verificando que no haya solapamiento de fechas para ese producto.

El backend resuelve si existe oferta activa al momento de la consulta (`WHERE fechaInicio <= NOW() AND fechaFin >= NOW()`). El frontend recibe el producto con `oferta: Oferta | null` ya resuelta — no necesita conocer la lógica de fechas.

**Lógica de descuento (frontend, no un campo):**  
El porcentaje que se muestra en la card (ej. "-25%") se computa a partir de `precio` y `oferta.precioOferta`. No se persiste.

```
descuento% = Math.round((1 - oferta.precioOferta / precio) * 100)
```

---

### ItemCarrito _(estado local, no persiste en la base de datos)_

| Campo      | Tipo     | Notas                                              |
|------------|----------|----------------------------------------------------|
| `producto` | Producto | incluye `oferta` tal como fue resuelta al agregar  |
| `cantidad` | number   |                                                    |

El carrito almacena solo `producto` y `cantidad`. **No almacena precios.** El precio visible en la UI del carrito se lee en tiempo real de `producto.oferta?.precioOferta ?? producto.precio`. El precio definitivo que se cobra es resuelto por el backend al momento del checkout — ver sección [Precio al momento del checkout](#precio-al-momento-del-checkout).

El carrito es estado de sesión del cliente. Ver sección [Estrategia del carrito](#estrategia-del-carrito) para el detalle de implementación.

---

### Pedido

| Campo    | Tipo           | Notas                               |
|----------|----------------|-------------------------------------|
| `id`     | number         |                                     |
| `usuario`| Usuario        |                                     |
| `items`  | ItemPedido[]   |                                     |
| `fecha`  | Date           |                                     |
| `total`  | number         | suma computada al momento del checkout |

---

### ItemPedido

| Campo           | Tipo   | Notas                                          |
|-----------------|--------|------------------------------------------------|
| `id`            | number |                                                |
| `pedidoId`      | number | FK hacia Pedido                                |
| `productoId`    | number | FK hacia Producto                              |
| `precioUnitario`| number | **snapshot** — ver decisión de diseño abajo    |
| `cantidad`      | number |                                                |

**El nombre del producto no se desnormaliza aquí.** Se obtiene siempre a través de la relación con `Producto` (JOIN / populate). Esto asume que los productos nunca se eliminan físicamente: si un producto se discontinúa, se le reduce el stock a 0 o se lo marca como inactivo, pero el registro permanece en la base de datos para que el historial de pedidos siga siendo consultable.

**Por qué `precioUnitario` sí es un snapshot:**  
El precio de un producto puede cambiar en cualquier momento (ofertas, actualizaciones de catálogo). Si `ItemPedido` sólo guardara `productoId`, al consultar un pedido histórico el precio mostrado sería el precio *actual* del producto, no el precio que el cliente efectivamente pagó. Guardar `precioUnitario` al momento del checkout es un requisito de integridad del historial de compras. El nombre, en cambio, es estable y se puede obtener del producto sin riesgo.

---

## Precio al momento del checkout

El carrito del frontend no es fuente de verdad para los precios. El catálogo lo es.

Al hacer checkout, el frontend envía únicamente `[{ productoId, cantidad }]` — sin precios. El backend consulta el precio vigente de cada producto en ese instante (aplicando ofertas activas si las hay) y construye los `ItemPedido` con esos valores. El `total` del pedido lo calcula también el backend.

**¿Qué pasa si una oferta vence entre que el usuario agrega el producto y hace checkout?**

El usuario vio $89.99 en su carrito (precio de oferta), pero al confirmar la oferta ya expiró y el backend cobra $120 (precio de lista). El cargo es correcto — el usuario paga el precio vigente al momento de la compra.

Esta es la misma conducta de la mayoría de los e-commerce reales. La alternativa sería detectar el cambio de precio al hacer checkout y mostrar un aviso ("El precio de X cambió de $89.99 a $120 — ¿querés continuar?"), pero eso requiere que el backend devuelva los ítems con precio actualizado antes de confirmar, y que el frontend maneje ese flujo de confirmación adicional.

**¿Cómo evitar que el usuario vea un precio desactualizado?**  
Al abrir la vista del carrito, el `CartService` refresca los datos de los productos en carrito con una sola request (`GET /api/products?ids=1,2,3`). Eso actualiza la `oferta` resuelta de cada producto y la UI muestra el precio correcto antes de que el usuario confirme. El checkout en el backend es una segunda validación, pero a esa altura el usuario ya vio el precio real.

```
Usuario abre el carrito
  → CartService refresca productos del carrito (1 request)
  → oferta actualizada → precios correctos en pantalla
  → usuario confirma → POST /api/orders → backend calcula el total
```

El modelo ya está bien diseñado para soportarlo: `precioUnitario` en `ItemPedido` siempre refleja lo que efectivamente se cobró.

---

## Estrategia del carrito

### Opción A — Cliente con localStorage _(recomendada para el TP)_

El carrito vive en un servicio Angular (`CartService`) usando signals, persistido en `localStorage`.

```
Angular CartService (signals + localStorage)
    └── POST /api/orders   ← solo al hacer checkout
```

**Ventajas:**
- Sin endpoints adicionales para gestionar el carrito
- Sin estados de carga (loading) en cada interacción
- Persiste entre refreshes de página
- El backend solo recibe el pedido final, ya formado

**Desventaja:**
- El carrito no se sincroniza entre dispositivos ni entre tabs distintas

---

### Opción B — Sesión del servidor con express-session

El carrito vive en la sesión del servidor. Cada operación (agregar, modificar cantidad, eliminar) hace un request HTTP.

```
Angular CartService (HTTP)
    ├── GET    /api/cart
    ├── POST   /api/cart/items
    ├── PATCH  /api/cart/items/:productId
    ├── DELETE /api/cart/items/:productId
    └── POST   /api/orders   ← convierte la sesión en un pedido persistido
```

El servidor mantiene el carrito en `req.session.cart` usando `express-session`. Al hacer checkout, toma esos datos, crea el `Pedido` con sus `ItemPedido`, y limpia la sesión.

**Ventajas:**
- Más realista como implementación de e-commerce
- El carrito sobrevive si el usuario cierra y vuelve a abrir el browser (mientras la sesión no expire)
- El backend ya tiene el carrito validado al momento del checkout

**Desventaja:**
- Requiere implementar y mantener 4-5 endpoints adicionales
- El CartService de Angular necesita manejar estados de carga
- Requiere configurar `express-session` con un store (en memoria para el TP, Redis en producción)

**¿Cambia el modelo de datos con esta opción?**  
No. `ItemCarrito` sigue siendo una estructura temporal que nunca se persiste en la base de datos. La diferencia es *dónde* vive esa estructura temporal: en el cliente (Opción A) o en la memoria del servidor (Opción B). En ambos casos, `ItemPedido` es el registro persistido que se crea al hacer checkout.

---

## Interfaces TypeScript (Angular)

```typescript
export interface Categoria {
  id: number;
  nombre: string;
  icono: string;
}

export interface Oferta {
  id: number;
  productoId: number;
  precioOferta: number;
  fechaInicio: Date;
  fechaFin: Date;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: Categoria;
  precio: number;
  stock: number;
  imagenUrl: string;
  oferta: Oferta | null; // resuelta por el backend; null si no hay oferta activa
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export interface ItemPedido {
  id: number;
  pedidoId: number;
  producto: Producto;        // populado por el backend
  precioUnitario: number;    // snapshot del precio al momento del checkout
  cantidad: number;
}

export interface Pedido {
  id: number;
  usuario: Usuario;
  items: ItemPedido[];
  fecha: Date;
  total: number;
}

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  direccion: string;
  // password nunca forma parte de la interfaz del frontend
}
```

---

## Stack de UI

| Librería       | Versión  | Rol                                              |
|----------------|----------|--------------------------------------------------|
| PrimeNG        | ^21.1.9  | Componentes UI (forms, tablas, dialogs, drawer…) |
| PrimeIcons     | —        | Íconos (usados en Categoria.icono y navegación)  |
| PrimeFlex      | 4.x      | Grid responsive y utilidades de layout/spacing   |
| @primeuix/themes | ^2.0.3 | Sistema de theming de PrimeNG v19+               |

No se usa Bootstrap. Todo el layout macro se resuelve con PrimeFlex; los componentes UI con PrimeNG.
