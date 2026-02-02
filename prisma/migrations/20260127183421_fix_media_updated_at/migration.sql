-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "alt" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Media_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Media" ("alt", "authorId", "createdAt", "filename", "height", "id", "mimeType", "originalName", "path", "size", "type", "updatedAt", "width") SELECT "alt", "authorId", "createdAt", "filename", "height", "id", "mimeType", "originalName", "path", "size", "type", "updatedAt", "width" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
CREATE INDEX "Media_type_idx" ON "Media"("type");
CREATE INDEX "Media_authorId_idx" ON "Media"("authorId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
