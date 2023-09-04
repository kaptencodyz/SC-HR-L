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

// ###############################################################################################


// This segment contains all the helper tables to handale relations between two primary tables
// ###############################################################################################

// ---
// This helper connects a user to every job they have redgistered to
// ---
export const workers = mysqlTable("workers", {
    user_id: int("user_id"),
    job_id: int("job_id"),
    workposition_id: int("workposition_id"),
});

// ###############################################################################################