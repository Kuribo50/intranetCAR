# Despliegue en Coolify

Esta guía explica cómo desplegar tu aplicación Next.js en Coolify con persistencia de datos SQLite.

## 1. Agregar Repositorio en Coolify

1. Ve a tu Proyecto en el entorno de Coolify.
2. Haz clic en **+ New** -> **Git Repository** (GitHub).
3. Selecciona tu repositorio: `Kuribo50/intranetCAR`.
4. Rama (Branch): `main`.
5. Build Pack: **Docker Compose** (Coolify debería detectarlo automáticamente, pero verifícalo).

## 2. Configuración (Antes de Desplegar)

Antes de hacer clic en deploy, ve a la pestaña **Configuration** de tu servicio en Coolify.

### Dominios

En el campo **Domains**, ingresa tu dominio:

- `https://albertoreyes.cl`

### Variables de Entorno (.env)

Agrega los siguientes secretos (secrets):

- `DATABASE_URL="file:/app/prisma/dev.db"`
- `NEXTAUTH_SECRET` (Genera uno: puedes ejecutar `openssl rand -base64 32` en tu terminal para obtener uno seguro)
- `NEXTAUTH_URL="https://albertoreyes.cl"`

### Almacenamiento Persistente (Crucial para SQLite)

Para evitar que tu base de datos se borre cada vez que despliegues una actualización, DEBES configurar un volumen.

1. Ve a la pestaña **Storage**.
2. Agrega un nuevo Volumen Persistente (Persistent Volume):
   - **Source Path**: (Déjalo vacío para auto-generado, o especifica una ruta en tu servidor como `/data/coolify/applications/intranet-car/db`)
   - **Destination Path**: `/app/prisma`
3. Guarda los cambios.

## 3. Desplegar

Haz clic en **Deploy**.

El `Dockerfile` está configurado para ejecutar automáticamente `npx prisma migrate deploy` al iniciar, por lo que los cambios en la estructura de tu base de datos se aplicarán automáticamente.
