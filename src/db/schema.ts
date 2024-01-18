// import { relations } from "drizzle-orm";
import { relations } from "c:/Users/Emil/sc-hr-l/node_modules/drizzle-orm/index";
import {
  mysqlTable,
  serial,
  varchar,
  text,
  int,
  boolean,
  datetime,
  timestamp,
} from "drizzle-orm/mysql-core";
import type { AdapterAccount } from "@auth/core/adapters";

// This segment contains all the primary tables that holds the information data of the website
// ###############################################################################################

// ---
// This table contain all the data for every user of the application
// ---
/* export const credentialsUsers = mysqlTable("crendential_users", {
  id: serial("id").primaryKey(),
  handle: varchar("handle", { length: 50 }).notNull(),
  status: int("status"),
  email: varchar("email", { length: 100 }).notNull(),
  password: varchar("password", { length: 100 }).notNull(),
}); */

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }),
  image: varchar("image", { length: 255 }),
  password: varchar("password", { length: 255 }),
  handle: varchar("handle", { length: 50 }),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false),
});

export const twoFactorToken = mysqlTable("twoFactorToken", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const passwordResetToken = mysqlTable("passwordResetToken", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const twoFactorConfirmation = mysqlTable("TwoFactorConfirmation", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  userId: varchar("user", { length: 255 }).notNull(),
});

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 2048 }),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: (account.provider, account.providerAccountId),
  })
);

export const sessions = mysqlTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationToken = mysqlTable("verificationToken", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// ---
// This table contain all the data for every job posted on the application
// ---
export const jobs = mysqlTable("jobs", {
    id: serial("id").primaryKey(),
    description: text("description"),
    org_id: int("org_id")
        .notNull()
        .references(() => orgs.id),
    landing_zone: int("landing_zone")
        .notNull()
        .references(() => landing_zones.id),
    avalible_positions: int("avalible_positions").notNull(),
    creator_id: int("creater_id")
        .notNull()
        .references(() => users.id),
    created: datetime("created"),
    start_time: datetime("start_time"),
    end_time: datetime("end_time"),
    event: boolean("event"),
    server_id: int("server_id")
        .notNull()
        .references(() => servers.id),
    job_type: int("job_type")
        .notNull()
        .references(() => job_types.id),
});

// ---
// This table contain every org that is registered on the site
// ---
export const orgs = mysqlTable("orgs", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
});

// ---
// This table contain every server locations star citizen operates
// ---
export const servers = mysqlTable("servers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
});

// ---
// This table contain every type of job that can be listed. For example mining or salvage
// ---
export const job_types = mysqlTable("job_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
});

// ---
// This table contain every type of position a job can have, for example turret operator or mining beam operator
// ---
export const job_positions = mysqlTable("job_positions", {
  id: serial("id").primaryKey(),
  position_title: varchar("position_title", { length: 50 }).notNull(),
});

// ---
// This table contains all the flyable ships in star citizen
// ---
export const ships = mysqlTable("ships", {
  id: serial("id").primaryKey(),
  model: varchar("model", { length: 50 }).notNull(),
  manufacturer_id: int("manufacturer_id").notNull(),
  /*     .references(() => manufacturers.id),
   */
});

// ---
// This table contain every ship manufacturer in star citizen
// ---
export const manufacturers = mysqlTable("manufacturers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
});

// ---
// This table contain every landing_zone in star citizen
// ---
export const landing_zones = mysqlTable("landing_zones", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    planet_id: int("planet_id")
        .notNull()
        .references(() => planets.id),
    moon_id: int("moon_id")
        .references(() => moons.id)
});

// ---
// This table contain every planet in star citizen
// ---
export const planets = mysqlTable("planets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
});

// ---
// This table contain every moon in star citizen
// ---
export const moons = mysqlTable("moons", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    planet_id: int("planet_id")
        .notNull()
        .references(() => planets.id)
});

// ###############################################################################################

// This segment contains all the helper tables to handale relations between two primary tables
// ###############################################################################################

// ---
// This helper connects the tables "users" to "jobs"
// ---
export const workers = mysqlTable("workers", {
    id: serial("id").primaryKey(),
    user_id: int("user_id")
        .notNull()
        .references(() => users.id),
    job_id: int("job_id")
        .notNull()
        .references(() => jobs.id),
    work_position_id: int("work_position_id")
        .notNull()
        .references(() => work_positions.id),
});

// ---
// This helper connects the tables "users" to "orgs"
// ---
export const org_members = mysqlTable("org_members", {
    id: serial("id").primaryKey(),
    user_id: int("user_id")
        .notNull()
        .references(() => users.id),
    org_id: int("org_id")
        .notNull()
        .references(() => orgs.id),
    org_confermation: boolean("org_confermation"),
    org_status: int("org_status"),
});

// ---
// This helper connects the tables "job_positions" to "jobs"
// ---
export const work_positions = mysqlTable("work_positions", {
    id: serial("id").primaryKey(),
    position_id: int("position_id")
        .notNull()
        .references(() => job_positions.id),
    job_id: int("job_id"),
    number_of_positions: int("number_of_positions")
});

// ---
// This helper connects the tables "ships" to "jobs"
// ---
export const job_ships = mysqlTable("job_ships", {
    id: serial("id").primaryKey(),
    ship_id: int("ship_id")
        .notNull()
        .references(() => ships.id),
    job_id: int("job_id")
        .notNull()
        .references(() => jobs.id)
});

// ###############################################################################################

// This segment contains all (One to Many) database relations
// ###############################################################################################

// Job related relations
// ###############################################################################################

// ---
// jobs relations
// ---
export const rel_jobs = relations(jobs, ({ one, many }) => ({
    creator: one(users, {
        fields: [jobs.creator_id],
        references: [users.id]
    }),
    org: one(orgs, {
        fields: [jobs.org_id],
        references: [orgs.id]
    }),
    landing_zone: one(landing_zones, {
        fields: [jobs.landing_zone],
        references: [landing_zones.id]
    }),
    server: one(servers, {
        fields: [jobs.server_id],
        references: [servers.id]
    }),
    job_type: one(job_types, {
        fields: [jobs.job_type],
        references: [job_types.id]
    }),
    workers: many(workers),
    work_positions: many(work_positions),
    ships: many(job_ships)
}))


// ---
// workers relations
// ---
export const rel_workers = relations(workers, ({ one }) => ({
    user: one(users, {
        fields: [workers.user_id],
        references: [users.id]
    }),
    work_position: one(work_positions, {
        fields: [workers.work_position_id],
        references: [work_positions.id]
    }),
    job: one(jobs, {
        fields: [workers.job_id],
        references: [jobs.id]
    })
}))

// ---
// work_positions relations
// ---
export const rel_work_positions = relations(work_positions, ({ one, many }) => ({
    job: one(jobs, {
        fields: [work_positions.job_id],
        references: [jobs.id]
    }),
    position: one(job_positions, {
        fields: [work_positions.position_id],
        references: [job_positions.id]
    }),
    workers: many(workers)
}))

// ---
// job_positions relations
// ---
export const rel_job_positions = relations(job_positions, ({ many }) => ({
    work_positions: many(work_positions)
}));

// ---
// servers relations
// ---
export const rel_servers = relations(servers, ({ many }) => ({
    server: many(jobs), 
}));

// ---
// job_types relations
// ---
export const rel_job_types = relations(job_types, ({ many }) => ({
    job: many(jobs),
}));


// User related relations
// ###############################################################################################

// ---
// users relations
// ---
export const rel_users = relations(users, ({ many }) => ({
    worker: many(workers),
    creator: many(jobs)
}));

// ---
// orgs relations
// ---
export const rel_orgs = relations(orgs, ({ many }) => ({
    members: many(org_members),
    org_jobs: many(jobs)
}));

// ---
// org_members relations
// ---
export const rel_org_members = relations(org_members, ({ one }) => ({
    user: one(users, {
        fields: [org_members.user_id],
        references: [users.id]
    }),
    org: one(orgs, {
        fields: [org_members.org_id],
        references: [orgs.id]
    })
}));


// Ship related relations
// ###############################################################################################

// ---
// job_ships relations
// ---
export const rel_job_ships = relations(job_ships, ({ one }) => ({
    job: one(jobs, {
        fields: [job_ships.job_id],
        references: [jobs.id]
    }),
    ship: one(ships, {
        fields: [job_ships.ship_id],
        references: [ships.id]
    })
}));

// ---
// manufacturers relations
// ---
export const rel_manufacturers = relations(manufacturers, ({ many }) => ({
  manufacturer: many(ships),
}));

// ---
// ships relations
// ---
export const rel_ships = relations(ships, ({ one }) => ({
    manufacturer: one(manufacturers, {
        fields: [ships.manufacturer_id],
        references: [manufacturers.id]
    }),
}));


// Landing zone related relations
// ###############################################################################################

// ---
// landing_zones relations
// ---
export const rel_landing_zones = relations(landing_zones, ({ one, many }) => ({
    planet: one(planets, {
        fields: [landing_zones.planet_id],
        references: [planets.id]
    }),
    moon: one(moons, {
        fields: [landing_zones.moon_id],
        references: [moons.id]
    }),
    jobs: many(jobs),
}));

// ---
// landing_zones relations
// ---
export const rel_planets = relations(planets, ({ many }) => ({
    moons: many(moons),
    landing_zones: many(landing_zones)
}));

// ---
// landing_zones relations
// ---
export const rel_moons = relations(moons, ({ one, many }) => ({
    planet: one(planets, {
        fields: [moons.planet_id],
        references: [planets.id]
    }),
    landing_zone: many(landing_zones)
}));

// ###############################################################################################
