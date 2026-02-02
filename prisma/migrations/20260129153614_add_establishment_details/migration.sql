-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Establecimiento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "mediaId" TEXT,
    CONSTRAINT "Establecimiento_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Establecimiento" ("active", "createdAt", "id", "name", "order", "updatedAt") SELECT "active", "createdAt", "id", "name", "order", "updatedAt" FROM "Establecimiento";
DROP TABLE "Establecimiento";
ALTER TABLE "new_Establecimiento" RENAME TO "Establecimiento";
CREATE UNIQUE INDEX "Establecimiento_name_key" ON "Establecimiento"("name");
CREATE INDEX "Establecimiento_active_idx" ON "Establecimiento"("active");
CREATE INDEX "Establecimiento_order_idx" ON "Establecimiento"("order");
CREATE TABLE "new_Estamento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "address" TEXT,
    "mediaId" TEXT,
    CONSTRAINT "Estamento_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Estamento" ("active", "createdAt", "id", "name", "order", "updatedAt") SELECT "active", "createdAt", "id", "name", "order", "updatedAt" FROM "Estamento";
DROP TABLE "Estamento";
ALTER TABLE "new_Estamento" RENAME TO "Estamento";
CREATE UNIQUE INDEX "Estamento_name_key" ON "Estamento"("name");
CREATE INDEX "Estamento_active_idx" ON "Estamento"("active");
CREATE INDEX "Estamento_order_idx" ON "Estamento"("order");
CREATE INDEX "Estamento_mediaId_idx" ON "Estamento"("mediaId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
