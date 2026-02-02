# Deploying to Coolify

This guide explains how to deploy your Next.js application to Coolify with SQLite persistence.

## 1. Add Repository in Coolify

1. Go to your Project in Coolify environment.
2. Click **+ New** -> **Git Repository** (GitHub).
3. Select your repository: `Kuribo50/intranetCAR`.
4. Branch: `main`.
5. Build Pack: **Docker Compose** (Coolify might auto-detect Dockerfile, but verify).

## 2. Configuration (Before Deploying)

Before you click deploy, go to the **Configuration** tab of your service in Coolify.

### Environment Variables (.env)

Add the following stored secrets:

- `DATABASE_URL="file:/app/prisma/dev.db"`
- `NEXTAUTH_SECRET` (Generate one: `openssl rand -base64 32`)
- `NEXTAUTH_URL` (Your full Coolify domain, e.g., `https://intranet.tu-dominio.com`)

### Persistent Storage (Crucial for SQLite)

To prevent your database from being deleted every time you deploy, you MUST map a volume.

1. Go to **Storage**.
2. Add a new Persistent Volume:
   - **Source Path**: (Leave empty for auto-generated, or specify a path on the host like `/data/coolify/applications/intranet-car/db`)
   - **Destination Path**: `/app/prisma`
3. Save.

## 3. Deploy

Click **Deploy**.

The Dockerfile is configured to automatically run `npx prisma migrate deploy` on startup, so your database schema will be applied automatically.
