# Aplicación de Gestión de Productos y Órdenes

## Descripción

Esta aplicación es un sistema de gestión diseñado para manejar productos y órdenes en un entorno de comercio electrónico. Utiliza el framework Laravel y se integra con la API de WooCommerce para facilitar la sincronización de datos entre la tienda en línea y el sistema de gestión.

## Funcionalidades

### 1. Webhooks de WooCommerce

La aplicación recibe notificaciones en tiempo real a través de webhooks de WooCommerce. Esto permite que la aplicación responda automáticamente a eventos como:

- **Creación de productos**: Al recibir un webhook de creación de producto, la aplicación procesa la información y la almacena en la base de datos.
- **Actualización de productos**: Similar a la creación, pero actualiza los productos existentes con la nueva información.
- **Creación de órdenes**: La aplicación maneja la creación de nuevas órdenes, asegurando que se registren correctamente en el sistema.

### 2. Gestión de Productos

- **Creación y actualización de productos**: La aplicación permite la creación y actualización de productos, incluyendo atributos como nombre, precio y talla.
- **Filtrado de productos**: Se pueden obtener productos destacados y en oferta a través de la API de WooCommerce.

### 3. Gestión de Órdenes

- **Sincronización de órdenes**: Las órdenes creadas en WooCommerce se sincronizan automáticamente con la base de datos de la aplicación.
- **Estado de las órdenes**: La aplicación permite el seguimiento del estado de las órdenes, asegurando que se procesen correctamente.

### 4. Interfaz de Usuario

La aplicación cuenta con una interfaz de usuario intuitiva que permite a los administradores gestionar productos y órdenes de manera eficiente. 

## Requisitos

- PHP >= 7.3
- Composer
- Laravel >= 8.x
- Acceso a la API de WooCommerce

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu_usuario/tu_repositorio.git
   ```

2. Navega al directorio del proyecto:
   ```bash
   cd tu_repositorio
   ```

3. Instala las dependencias:
   ```bash
   composer install
   ```

4. Configura el archivo `.env` con tus credenciales de base de datos y API de WooCommerce.

5. Ejecuta las migraciones:
   ```bash
   php artisan migrate
   ```

6. Inicia el servidor de desarrollo:
   ```bash
   php artisan serve
   ```

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor sigue estos pasos:

1. Haz un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz un commit (`git commit -m 'Agrega nueva funcionalidad'`).
4. Envía un pull request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Para más información, puedes contactar a [tu_email@ejemplo.com](mailto:felipe.andres.j@agileticl.com).