BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "user" (
	"id"	INTEGER NOT NULL UNIQUE,
	"firstname"	TEXT,
	"lastname"	TEXT,
	"school"	TEXT,
	"quizJson"	TEXT,
	"readJson"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
COMMIT;
