import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  real,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { createInsertSchema } from "drizzle-zod";
import * as z from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  isAdmin: boolean("isAdmin").default(false),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const categories = pgTable("category", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  parentId: text("parentId").references((): AnyPgColumn => categories.id),
});

export type Category = typeof categories.$inferSelect;
export const addCategorySchema = createInsertSchema(categories, {
  name: z.string().min(3),
});

export type AddCategory = z.infer<typeof addCategorySchema>;

export const products = pgTable("product", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  categoryId: text("categoryId")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
});

export type Product = typeof products.$inferSelect;

export const addProductSchema = createInsertSchema(products, {
  title: z.string().min(3),
  price: z
    .number({ message: "Value must be a number" })
    .min(0, { message: "Price must be greater than 0" }),
  categoryId: z.string().min(3),
});

export type AddProduct = z.infer<typeof addProductSchema>;

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  products: many(products),
  parentCategory: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
}));

// Variants Table
export const variants = pgTable("variant", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sku: text("sku").notNull().unique(),
  price: real("price").notNull(),
  stockQuantity: integer("stockQuantity").notNull(),
});

// Attributes Table
export const attributes = pgTable("attribute", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
});

// ProductAttributes Table
export const productAttributes = pgTable("productAttribute", {
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  attributeId: text("attributeId")
    .notNull()
    .references(() => attributes.id, { onDelete: "cascade" }),
  value: text("value").notNull(),
});

// VariantAttributes Table
export const variantAttributes = pgTable("variantAttribute", {
  variantId: text("variantId")
    .notNull()
    .references(() => variants.id, { onDelete: "cascade" }),
  attributeId: text("attributeId")
    .notNull()
    .references(() => attributes.id, { onDelete: "cascade" }),
  value: text("value").notNull(),
});

// Inventory Table
export const inventory = pgTable("inventory", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  variantId: text("variantId")
    .notNull()
    .references(() => variants.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  location: text("location"),
});

// Orders Table
export const orders = pgTable("order", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  orderStatus: text("orderStatus").notNull(),
  totalAmount: real("totalAmount").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

// OrderItems Table
export const orderItems = pgTable("orderItem", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  variantId: text("variantId")
    .notNull()
    .references(() => variants.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
});

// Relations

// Users relations
export const usersRelations = relations(users, ({ one, many }) => ({
  orders: many(orders),
}));

// Products relations
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(variants),
  attributes: many(productAttributes),
}));

// Variants relations
export const variantsRelations = relations(variants, ({ one, many }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
  variantAttributes: many(variantAttributes),
}));

// Attributes relations
export const attributesRelations = relations(attributes, ({ many }) => ({
  productAttributes: many(productAttributes),
  variantAttributes: many(variantAttributes),
}));

// ProductAttributes relations
export const productAttributesRelations = relations(
  productAttributes,
  ({ one }) => ({
    product: one(products, {
      fields: [productAttributes.productId],
      references: [products.id],
    }),
    attribute: one(attributes, {
      fields: [productAttributes.attributeId],
      references: [attributes.id],
    }),
  })
);

// VariantAttributes relations
export const variantAttributesRelations = relations(
  variantAttributes,
  ({ one }) => ({
    variant: one(variants, {
      fields: [variantAttributes.variantId],
      references: [variants.id],
    }),
    attribute: one(attributes, {
      fields: [variantAttributes.attributeId],
      references: [attributes.id],
    }),
  })
);

// Inventory relations
export const inventoryRelations = relations(inventory, ({ one }) => ({
  variant: one(variants, {
    fields: [inventory.variantId],
    references: [variants.id],
  }),
}));

// Orders relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

// OrderItems relations
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(variants, {
    fields: [orderItems.variantId],
    references: [variants.id],
  }),
}));
