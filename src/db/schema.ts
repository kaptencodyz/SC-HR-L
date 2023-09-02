import { mysqlTable,
    serial,
    varchar,
    text,
    decimal
} from "drizzle-orm/mysql-core";

export const products = mysqlTable("products", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 191 }).notNull(),
    description: text("description"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
});
