-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MeetingRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 6,
    "amenities" TEXT NOT NULL DEFAULT '[]',
    "color" TEXT NOT NULL DEFAULT 'from-blue-500 to-blue-600',
    "icon" TEXT NOT NULL DEFAULT '🏢',
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "establecimientoId" TEXT,
    "mediaId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "estamentoId" TEXT,
    CONSTRAINT "MeetingRoom_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MeetingRoom_establecimientoId_fkey" FOREIGN KEY ("establecimientoId") REFERENCES "Establecimiento" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MeetingRoom_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MeetingRoom_estamentoId_fkey" FOREIGN KEY ("estamentoId") REFERENCES "Estamento" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_MeetingRoom" ("active", "amenities", "authorId", "capacity", "color", "createdAt", "icon", "id", "name", "order", "updatedAt") SELECT "active", "amenities", "authorId", "capacity", "color", "createdAt", "icon", "id", "name", "order", "updatedAt" FROM "MeetingRoom";
DROP TABLE "MeetingRoom";
ALTER TABLE "new_MeetingRoom" RENAME TO "MeetingRoom";
CREATE UNIQUE INDEX "MeetingRoom_name_key" ON "MeetingRoom"("name");
CREATE INDEX "MeetingRoom_active_idx" ON "MeetingRoom"("active");
CREATE INDEX "MeetingRoom_order_idx" ON "MeetingRoom"("order");
CREATE INDEX "MeetingRoom_authorId_idx" ON "MeetingRoom"("authorId");
CREATE INDEX "MeetingRoom_establecimientoId_idx" ON "MeetingRoom"("establecimientoId");
CREATE INDEX "MeetingRoom_mediaId_idx" ON "MeetingRoom"("mediaId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
