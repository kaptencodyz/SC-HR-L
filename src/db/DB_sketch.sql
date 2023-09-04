CREATE TABLE `users` (
  `id` integer PRIMARY KEY,
  `handle` varchar(255),
  `status` integer,
  `email` varchar(255),
  `password` varchar(255)
);

CREATE TABLE `orgs` (
  `id` integer PRIMARY KEY,
  `name` varchar(255)
);

CREATE TABLE `org_members` (
  `user_id` integer,
  `org_id` integer,
  `org_confermation` boolean,
  `org_status` integer
);

CREATE TABLE `jobs` (
  `id` integer PRIMARY KEY,
  `description` text,
  `org_id` integer,
  `landing_zone` integer,
  `avalible_positions` integer,
  `creater_id` integer,
  `created` timestamp,
  `start_time` timestamp,
  `end_time` timestamp,
  `event` boolean,
  `server_id` integer,
  `job_type` integer
);

CREATE TABLE `servers` (
  `id` integer PRIMARY KEY,
  `location` varchar(255)
);

CREATE TABLE `job_types` (
  `id` integer PRIMARY KEY,
  `title` varchar(255)
);

CREATE TABLE `workers` (
  `user_id` integer,
  `job_id` integer,
  `work_position_id` integer
);

CREATE TABLE `job_ships` (
  `job_id` integer,
  `ship_id` integer
);

CREATE TABLE `ships` (
  `id` integer PRIMARY KEY,
  `manufacturer_id` integer,
  `model` varchar(255)
);

CREATE TABLE `manufacturers` (
  `id` integer PRIMARY KEY,
  `name` varchar(255)
);

CREATE TABLE `job_positions` (
  `id` integer PRIMARY KEY,
  `position_title` varchar(255)
);

CREATE TABLE `work_positions` (
  `id` integer PRIMARY KEY,
  `position_id` integer,
  `job_id` integer,
  `nomber_of_positions` integer
);

CREATE TABLE `planets` (
  `id` integer PRIMARY KEY,
  `name` varchar(255)
);

CREATE TABLE `moons` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `planet_id` integer
);

CREATE TABLE `landing_zones` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `planet_id` integer,
  `moon_id` integer
);

ALTER TABLE `org_members` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `org_members` ADD FOREIGN KEY (`org_id`) REFERENCES `orgs` (`id`);

ALTER TABLE `jobs` ADD FOREIGN KEY (`creater_id`) REFERENCES `users` (`id`);

ALTER TABLE `jobs` ADD FOREIGN KEY (`org_id`) REFERENCES `orgs` (`id`);

ALTER TABLE `servers` ADD FOREIGN KEY (`id`) REFERENCES `jobs` (`server_id`);

ALTER TABLE `job_types` ADD FOREIGN KEY (`id`) REFERENCES `jobs` (`job_type`);

ALTER TABLE `workers` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `workers` ADD FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`);

ALTER TABLE `workers` ADD FOREIGN KEY (`work_position_id`) REFERENCES `work_positions` (`id`);

ALTER TABLE `job_ships` ADD FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`);

ALTER TABLE `job_ships` ADD FOREIGN KEY (`ship_id`) REFERENCES `ships` (`id`);

ALTER TABLE `ships` ADD FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`);

ALTER TABLE `work_positions` ADD FOREIGN KEY (`position_id`) REFERENCES `job_positions` (`id`);

ALTER TABLE `work_positions` ADD FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`);

ALTER TABLE `jobs` ADD FOREIGN KEY (`landing_zone`) REFERENCES `landing_zones` (`id`);

ALTER TABLE `moons` ADD FOREIGN KEY (`planet_id`) REFERENCES `planets` (`id`);

ALTER TABLE `landing_zones` ADD FOREIGN KEY (`planet_id`) REFERENCES `planets` (`id`);

ALTER TABLE `landing_zones` ADD FOREIGN KEY (`moon_id`) REFERENCES `moons` (`id`);
