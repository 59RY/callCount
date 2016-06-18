CREATE TABLE `user` (
	`ID`
		INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`count`
		INTEGER NOT NULL DEFAULT 0,
	`userAgent`
		TEXT,
	`date_1st`
		TEXT NOT NULL,
	`date_1st_int`
		TEXT,
	`date_final`
		TEXT NOT NULL,
	`date_final_int`
		TEXT,
	`date_datasend`
		TEXT,
	`date_datasend_int`
		TEXT
);

CREATE TABLE `call` (
	`ID`
		INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`userID`
		INTEGER DEFAULT -1,
	`date`
		TEXT NOT NULL,
	`date_int`
		TEXT,
	`connect`
		INTEGER DEFAULT 0
);
