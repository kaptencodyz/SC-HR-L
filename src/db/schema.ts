import { relations } from "drizzle-orm";
import { mysqlTable,
    serial,
    varchar,
    text,
    int,
    boolean,
    datetime
} from "drizzle-orm/mysql-core";


// This segment contains all the primary tables that holds the information data of the website
// ###############################################################################################

// ---
// This table contain all the data for every user of the application
// ---
export const users = mysqlTable("users", {
    id: serial("id").primaryKey(),
    handle: varchar("handle", { length: 50 }).notNull(),
    status: int("status"),
    email: varchar("email", { length: 100 }).notNull(),
    password: varchar("password", { length: 100 }).notNull(),
});

// ---
// This table contain all the data for every job posted on the application
// ---
export const jobs = mysqlTable("jobs", {
    id: serial("id").primaryKey(),
    description: text("description"),
    org_id: int("org_id"),
    landing_zone: int("landing_zone"),
    avalible_positions: int("avalible_positions").notNull(),
    creater_id: int("creater_id"),
    created: datetime("created"),
    start_time: datetime("start_time"),
    end_time: datetime("end_time"),
    event: boolean("event"),
    server_id: int("server_id"),
    job_type: int("job_type"),
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
    manufacturer_id: int("manufacturer_id")
        .notNull()
        .references(() => manufacturers.id)
});

// ---
// This table contain every ship manufacturer in star citizen
// ---
export const manufacturers = mysqlTable("manufacturers", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull()
});

// ---
// This table contain every landing_zone in star citizen
// ---
export const landing_zones = mysqlTable("landing_zones", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    planet_id: int("planet_id"),
    moon_id: int("moon_id")
});

// ---
// This table contain every planet in star citizen
// ---
export const planets = mysqlTable("planets", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull()
});

// ---
// This table contain every moon in star citizen
// ---
export const moons = mysqlTable("moons", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    planet_id: int("planet_id")
});

// ###############################################################################################


// This segment contains all the helper tables to handale relations between two primary tables
// ###############################################################################################

// ---
// This helper connects the tables "users" to "jobs"
// ---
export const workers = mysqlTable("workers", {
    id: serial("id").primaryKey(),
    user_id: int("user_id"),
    job_id: int("job_id"),
    workposition_id: int("workposition_id"),
});

// ---
// This helper connects the tables "users" to "orgs"
// ---
export const org_members = mysqlTable("org_members", {
    id: serial("id").primaryKey(),
    user_id: int("user_id"),
    org_id: int("org_id"),
    org_confermation: boolean("org_confermation"),
    org_status: int("org_status"),
});

// ---
// This helper connects the tables "job_positions" to "jobs" 
// ---
export const work_positions = mysqlTable("work_positions", {
    id: serial("id").primaryKey(),
    user_id: int("user_id"),
    org_id: int("org_id"),
    org_confermation: boolean("org_confermation"),
    org_status: int("org_status"),
});

// ---
// This helper connects the tables "ships" to "jobs"
// ---
export const job_ships = mysqlTable("job_ships", {
    id: serial("id").primaryKey(),
    ship_id: int("ship_id"),
    job_id: int("job_id")
});

// ###############################################################################################


// This segment contains all (One to Many) database relations
// ###############################################################################################


// ---
// This relation connects the tables "manufacturers" to "ships"
// ---
export const rel_manufacturers = relations(manufacturers, ({ many }) => ({
    manufacturer: many(ships),
}));

// ---
// This relation connects the tables "manufacturers" to "ships"
// ---
    export const rel_ships = relations(ships, ({ one }) => ({
        manufacturer: one(manufacturers, {
            fields: [ships.manufacturer_id],
            references: [manufacturers.id],
        }),
    }));


// ###############################################################################################
