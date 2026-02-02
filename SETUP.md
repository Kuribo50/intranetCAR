# Guía de Configuración - Intranet CESFAM

## 🚀 Instalación Rápida

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-aqui"
MAX_FILE_SIZE=10485760
UPLOAD_DIR="./public/uploads"
```

**Para generar NEXTAUTH_SECRET:**

```bash
# En Linux/Mac
openssl rand -base64 32

# En Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 3. Inicializar Base de Datos

```bash
# Generar cliente Prisma
npx prisma generate

# Crear base de datos y tablas
npx prisma db push

# Ejecutar seed (crea usuarios y migra contactos)
npm run db:seed
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

## 👤 Usuarios de Prueba

Después de ejecutar el seed, puedes usar:

- **Admin**: `admin@cesfam.cl` / `admin123`
- **Editor**: `editor@cesfam.cl` / `editor123`
- **User**: `user@cesfam.cl` / `user123`

## 📊 Datos Migrados

El seed automáticamente migra:

- ✅ 105 contactos telefónicos desde `data/contacts.ts`
- ✅ 3 usuarios de prueba
- ✅ Estructura de base de datos completa

## 🔧 Comandos Útiles

```bash
# Ver base de datos en Prisma Studio
npm run db:studio

# Generar cliente Prisma (después de cambios en schema)
npm run db:generate

# Aplicar cambios al schema
npm run db:push

# Crear migración (cuando uses PostgreSQL)
npm run db:migrate
```

## 📁 Estructura de Archivos

```
intranetCAR/
├── prisma/
│   ├── schema.prisma    # Schema de base de datos
│   └── seed.ts          # Datos iniciales
├── app/
│   ├── api/             # API Routes (CRUD)
│   ├── admin/           # Panel de administración
│   └── login/           # Página de login
├── lib/
│   ├── prisma.ts        # Cliente Prisma
│   ├── auth.ts          # Configuración NextAuth
│   └── permissions.ts  # Utilidades de permisos
└── public/uploads/      # Archivos subidos
```

## 🔐 Autenticación

El sistema usa NextAuth.js con:

- Credenciales (email + password)
- Contraseñas hasheadas con bcrypt
- Sesiones JWT
- Roles: ADMIN, EDITOR, USER

## 🗄️ Base de Datos

- **Actual**: SQLite (`prisma/dev.db`)
- **Futuro**: PostgreSQL (migración fácil)

Para migrar a PostgreSQL:

1. Cambiar `provider` en `schema.prisma` a `"postgresql"`
2. Actualizar `DATABASE_URL` en `.env`
3. Ejecutar `npx prisma migrate dev`

## ⚠️ Solución de Problemas

### Error: "@prisma/client did not initialize"

```bash
npx prisma generate
```

### Error: "DATABASE_URL not found"

Verifica que el archivo `.env` existe y tiene `DATABASE_URL`

### Error: "Module not found: next-auth/jwt"

```bash
npm install next-auth
```

## 📝 Notas Importantes

- Los archivos se guardan en `public/uploads/` (no en BD)
- Las contraseñas están hasheadas (nunca en texto plano)
- El borrado es REAL (no soft delete)
- Los contactos ya están migrados automáticamente
