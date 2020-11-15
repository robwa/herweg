CREATE TABLE surveys (
	id INTEGER PRIMARY KEY NOT NULL,
	uuid TEXT NOT NULL,
	deleted_at REAL
);
CREATE TABLE categories (
	id INTEGER PRIMARY KEY NOT NULL,
	survey_id INTEGER NOT NULL,
	name TEXT NOT NULL,
	deleted_at REAL,
	FOREIGN KEY (survey_id) REFERENCES surveys(id)
);
CREATE TABLE IF NOT EXISTS "assignments" (
	"id" INTEGER PRIMARY KEY NOT NULL,
	"category_id" INTEGER NOT NULL,
	"julian_day" REAL NOT NULL,
	"assignee" TEXT NOT NULL,
	deleted_at REAL,
	FOREIGN KEY (category_id) REFERENCES categories(id)
);
CREATE INDEX "index_assignments_on_category_and_day_and_deleted_at" ON "assignments" ("category_id", "julian_day", "deleted_at");