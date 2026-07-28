CREATE TABLE `contacts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`org` varchar(255) NOT NULL DEFAULT '',
	`phone` varchar(64) NOT NULL DEFAULT '',
	`email` varchar(255) NOT NULL DEFAULT '',
	`type` varchar(64) NOT NULL DEFAULT 'other',
	`message` text,
	`source` varchar(64) NOT NULL DEFAULT 'contact',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`youtube_id` varchar(32) NOT NULL,
	`title` varchar(512) NOT NULL,
	`channel_title` varchar(255) NOT NULL DEFAULT '',
	`thumbnail_url` varchar(1024) NOT NULL DEFAULT '',
	`duration_sec` int NOT NULL DEFAULT 0,
	`published_at` timestamp,
	`category` varchar(64) NOT NULL DEFAULT 'other',
	`video_url` varchar(1024) NOT NULL DEFAULT '',
	`ai_title` varchar(512) NOT NULL DEFAULT '',
	`ai_summary` text,
	`ai_content` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videos_id` PRIMARY KEY(`id`),
	CONSTRAINT `videos_youtube_id_unique` UNIQUE(`youtube_id`)
);
