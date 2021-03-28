BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "user" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT,
	"school"	TEXT,
	"teacher"	TEXT,
	"quizData"	TEXT,
	"projectData"	TEXT,
	"lessonData"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "quiz" (
	"id"	INTEGER,
	"quizId"	INTEGER,
	"answer"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "settings" (
	"id"	INTEGER,
	"isNew"	INTEGER DEFAULT 1,
	"hasFileAccess"	INTEGER DEFAULT 0,
	PRIMARY KEY("id" AUTOINCREMENT)
);
COMMIT;
