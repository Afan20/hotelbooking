-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "checkedOutAt" DATETIME,
    "guestFullName" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "guestPhone" TEXT,
    "guestType" TEXT NOT NULL DEFAULT 'pakistani',
    "guestIdCardNumber" TEXT,
    "guestNationality" TEXT,
    "guestPassportNumber" TEXT,
    "checkIn" TEXT NOT NULL,
    "checkOut" TEXT NOT NULL,
    "guests" INTEGER NOT NULL,
    "specialRequests" TEXT,
    "nights" INTEGER NOT NULL,
    "subtotal" REAL NOT NULL,
    "tax" REAL NOT NULL,
    "total" REAL NOT NULL,
    "discountPercent" REAL NOT NULL DEFAULT 0,
    "discountAmount" REAL NOT NULL DEFAULT 0,
    "roomId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("checkIn", "checkOut", "checkedOutAt", "createdAt", "discountAmount", "discountPercent", "guestEmail", "guestFullName", "guestPhone", "guests", "id", "nights", "roomId", "specialRequests", "status", "subtotal", "tax", "total") SELECT "checkIn", "checkOut", "checkedOutAt", "createdAt", "discountAmount", "discountPercent", "guestEmail", "guestFullName", "guestPhone", "guests", "id", "nights", "roomId", "specialRequests", "status", "subtotal", "tax", "total" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
