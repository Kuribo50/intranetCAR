# Arquitectura del Sistema - Intranet CESFAM

## 📋 Resumen Ejecutivo

Sistema de intranet institucional construido con Next.js 14 (App Router), Prisma ORM y SQLite, diseñado para uso interno de CESFAM con autenticación real, roles de usuario y gestión completa de contenido.

## 🏗️ Arquitectura General

### Stack Tecnológico

- **Framework**: Next.js 14.1.0 (App Router)
- **Lenguaje**: TypeScript 5
- **ORM**: Prisma 5.9.1
- **Base de Datos**: SQLite (migrable a PostgreSQL)
- **Autenticación**: NextAuth.js 4.24.5
- **Encriptación**: bcryptjs 2.4.3
- **UI**: Tailwind CSS + Radix UI

### Estructura de Carpetas

```
intranetCAR/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/            # NextAuth endpoints
│   │   ├── posts/           # CRUD de posts/tarjetas
│   │   ├── events/          # CRUD de eventos/cumpleaños
│   │   ├── contacts/        # CRUD de anexos telefónicos
│   │   ├── media/           # Upload/delete de archivos
│   │   └── links/           # CRUD de enlaces útiles
│   ├── admin/               # Panel de administración
│   ├── login/               # Página de login
│   ├── anexos/              # Vista pública de anexos
│   └── page.tsx             # Página principal
├── components/
│   ├── admin/               # Componentes del panel admin
│   ├── dashboard/           # Componentes del dashboard
│   ├── layout/              # Componentes de layout
│   └── ui/                  # Componentes UI reutilizables
├── lib/
│   ├── prisma.ts            # Cliente Prisma singleton
│   ├── auth.ts              # Configuración NextAuth
│   ├── permissions.ts       # Utilidades de permisos
│   └── files.ts             # Utilidades de manejo de archivos
├── prisma/
│   ├── schema.prisma        # Schema de base de datos
│   └── seed.ts              # Seed inicial de datos
├── types/
│   └── next-auth.d.ts       # Tipos extendidos de NextAuth
├── public/
│   └── uploads/             # Archivos subidos (gitignored)
└── middleware.ts            # Middleware de protección de rutas
```

## 🗄️ Modelo de Base de Datos

### Schema Prisma

El schema incluye los siguientes modelos:

1. **User**: Usuarios del sistema con roles
2. **Post**: Tarjetas/avisos/noticias
3. **Event**: Eventos, cumpleaños, recordatorios
4. **Contact**: Directorio telefónico (anexos)
5. **Media**: Archivos subidos (imágenes, videos, documentos)
6. **Link**: Enlaces útiles a sistemas externos

### Características del Schema

- ✅ UUID como ID (no autoincrement)
- ✅ Enums para tipos y estados
- ✅ Relaciones con CASCADE para borrado
- ✅ Índices para optimización
- ✅ Timestamps automáticos
- ✅ Preparado para migración a PostgreSQL

### Relaciones

- User → Posts (1:N)
- User → Events (1:N)
- User → Contacts (1:N)
- User → Media (1:N)
- User → Links (1:N)
- Media → Posts (1:N, opcional)
- Media → Events (1:N, opcional)
- Media → Links (1:N, opcional)

## 🔐 Autenticación y Seguridad

### Sistema de Autenticación

- **Provider**: Credentials (email + password)
- **Session**: JWT (stateless)
- **Encriptación**: bcryptjs (10 rounds)
- **Middleware**: Protección automática de rutas

### Roles de Usuario

1. **ADMIN**: Control total
   - Crear, editar, eliminar todo
   - Gestionar usuarios
   - Acceso completo a /admin

2. **EDITOR**: Gestión de contenido
   - Crear y editar contenido
   - No puede eliminar
   - Acceso a /admin

3. **USER**: Solo lectura
   - Ver contenido público
   - Sin acceso a /admin

### Protección de Rutas

- **Públicas**: `/login`, `/api/auth`
- **Protegidas**: Todas las demás requieren autenticación
- **Admin**: `/admin/*` requiere ADMIN o EDITOR

## 📁 Manejo de Archivos

### Almacenamiento

- **Ubicación**: `public/uploads/`
- **Nombres**: UUID + extensión original
- **Metadata**: Guardada en BD (no binarios)
- **Validación**: Tipo MIME y tamaño máximo

### Tipos Soportados

- **Imágenes**: JPEG, PNG, GIF, WebP, SVG
- **Videos**: MP4, WebM, QuickTime
- **Documentos**: PDF, Word, Excel, TXT

### Borrado

- Eliminación real del sistema de archivos
- Eliminación del registro en BD
- Verificación de uso antes de eliminar

## 🔄 Flujo de Autenticación

1. Usuario accede a `/login`
2. Ingresa email y contraseña
3. NextAuth valida credenciales contra BD
4. Compara hash con bcrypt
5. Genera JWT con rol del usuario
6. Redirige según permisos
7. Middleware valida token en cada request

## 📝 API Routes

### Estructura

Todas las rutas siguen el patrón REST:

- `GET /api/{resource}`: Listar
- `GET /api/{resource}/[id]`: Obtener uno
- `POST /api/{resource}`: Crear
- `PATCH /api/{resource}/[id]`: Actualizar
- `DELETE /api/{resource}/[id]`: Eliminar

### Validación de Permisos

- `requireAuth()`: Usuario autenticado
- `requireEditor()`: ADMIN o EDITOR
- `requireAdmin()`: Solo ADMIN
- Verificación de autoría para edición

## 🗑️ Borrado Real

### Implementación

1. **Verificación**: Comprobar existencia
2. **Relaciones**: Verificar uso en otras tablas
3. **Archivos**: Eliminar del sistema de archivos
4. **BD**: Eliminar registro (CASCADE maneja relaciones)
5. **Respuesta**: Confirmación de eliminación

### CASCADE Rules

- User eliminado → Posts, Events, Contacts, Media, Links eliminados
- Media eliminado → Referencias en Posts/Events/Links → SetNull
- Post/Event/Link eliminado → Media se mantiene (puede reutilizarse)

## 🚀 Migración a PostgreSQL

### Preparación

El schema está diseñado para migración fácil:

1. Cambiar `provider` en `schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Actualizar `DATABASE_URL` en `.env`

3. Ejecutar migración:
   ```bash
   npx prisma migrate dev --name migrate-to-postgresql
   ```

### Compatibilidad

- ✅ UUID funciona igual en ambos
- ✅ Enums son compatibles
- ✅ Relaciones funcionan igual
- ✅ Índices se migran automáticamente

## 📦 Instalación y Setup

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crear `.env`:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generar-con-openssl-rand-base64-32"
MAX_FILE_SIZE=10485760
UPLOAD_DIR="./public/uploads"
```

### 3. Inicializar Base de Datos

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Ejecutar Desarrollo

```bash
npm run dev
```

## 👥 Usuarios de Prueba

Después del seed:

- **Admin**: `admin@cesfam.cl` / `admin123`
- **Editor**: `editor@cesfam.cl` / `editor123`
- **User**: `user@cesfam.cl` / `user123`

## 🔧 Buenas Prácticas Implementadas

1. ✅ **Singleton Pattern** para Prisma Client
2. ✅ **Type Safety** completo con TypeScript
3. ✅ **Error Handling** consistente
4. ✅ **Validación** de permisos en cada operación
5. ✅ **Logging** de errores en desarrollo
6. ✅ **Código reutilizable** con utilidades
7. ✅ **Separación de concerns** (auth, files, permissions)
8. ✅ **Preparado para producción** (env vars, secrets)

## 📈 Escalabilidad

### Futuras Mejoras

- [ ] Cache con Redis
- [ ] CDN para archivos estáticos
- [ ] Background jobs para procesamiento
- [ ] Webhooks para notificaciones
- [ ] Auditoría de cambios
- [ ] Soft delete opcional
- [ ] Versionado de contenido

## 🔒 Seguridad Adicional Recomendada

1. **Rate Limiting**: Implementar en API routes
2. **CORS**: Configurar para producción
3. **HTTPS**: Obligatorio en producción
4. **Secrets**: Usar servicios de gestión (Vercel, AWS Secrets)
5. **Backups**: Automatizar backups de BD
6. **Monitoring**: Implementar logging y alertas

## 📚 Documentación Adicional

- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Next.js App Router](https://nextjs.org/docs/app)
