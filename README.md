# Casos de prueba:

- Inicio de sesión:
  [x] Poder ingresar a la app con email y contraseña.
  [x] Mensajes de error si las credenciales están mal.
  [x] Mensajes de requerido si no se completo campos.

- Registro:
  [x] Poder crear usuario.
  [x] Mensajes de error si el usuario ya existe con el email ingresado.
  [x] Mensajes de requerido si no se completo campos.

- Totales en ventas:
  [x] Faturación total.
  [x] Costo total.
  [x] Ganancia total.

- Totales en productos:
  [x] Monto total en stock.
  [x] Costo total.
  [x] Ganancia total.

- Ventas:
  [x] Ver lista de ventas.
  [x] Ver detalle de la venta.
  [x] Filtrar ventas por fecha.
  [x] Crear venta.
  [x] Editar venta.
  [x] Borrar venta pagada, debe borrar la deuda si es que habia.
  [x] Borrar venta no pagada, debe borrar la deuda si es que habia.
  [x] Cuando se crea la venta actualizar stock de los productos del detalle de venta.
  [x] Cuando se edita la venta actualizar stock de los productos del detalle de venta.
  [x] Cuando se crea la venta, si el cliente no pagó, se debe crear una deuda para esa venta.

- Deudas:
  [x] Ver lista de deudas.
  [x] Filtrar deuda por cliente.
  [x] Crear deuda a partir de la creación de la venta.
  [x] Editar deuda (solo debe dejar editar cliente y monto entregado).
  [x] Borrar deuda (debe borrar la venta relacionada).
  [x] El botón pago total debe actualizar la deuda y ponerla como pagada actualizando el monto entregado = monto total. y actualizar venta relacionada y ponerla como pagada.

- Productos:
  [x] Ver lista de productos.
  [x] Ver detalle del producto.
  [x] Filtrar producto.
  [x] Crear producto.
  [x] Editar producto.
  [x] Borrar producto.

- Categorias:
  [x] Ver lista de categorias.
  [x] Crear categoria.
  [x] Editar categoria.
  [x] Borrar categoria.

- Clientes:
  [x] Ver lista de clientes.
  [x] Crear cliente.
  [x] Editar cliente.
  [x] Borrar cliente.

- Métodos de pago:
  [x] Ver lista de métodos de pago.
  [x] Crear método de pago.
  [x] Editar método de pago.
  [x] Borrar método de pago.

- Productos vendidos histórico:
  [x] Filtrar por categoria.
  [x] Ver lista de los productos vendidos.
