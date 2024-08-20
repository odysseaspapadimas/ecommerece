import { db } from "@/db";

export async function getProducts() {
  return await db.query.products.findMany();
}

export async function getCategories() {
  return await db.query.categories.findMany();
}