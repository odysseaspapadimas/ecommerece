"use server";

import { db } from "@/db";
import {
  addCategorySchema,
  addProductSchema,
  categories,
  products,
} from "@/db/schema";
import { createServerAction } from "zsa";
import { NeonHttpQueryResult } from "drizzle-orm/neon-http";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export const createProduct = createServerAction()
  .input(addProductSchema)
  .handler(async ({ input }) => {
    console.log(input, "input");
    const res = await db.insert(products).values({
      title: input.title,
      price: input.price,
      categoryId: input.categoryId,
      description: input.description,
    });
    console.log(res, "res");

    revalidatePath("/dashboard");
    return res;
  });

export const deleteProduct = createServerAction()
  .input(addProductSchema.pick({ id: true }))
  .handler(async ({ input }) => {
    if (!input.id) {
      throw new Error("No id provided");
    }
    const res = await db.delete(products).where(eq(products.id, input.id));

    revalidatePath("/dashboard");
    return res;
  });

export const createCategory = createServerAction()
  .input(addCategorySchema)
  .handler(async ({ input }) => {
    const res = await db.insert(categories).values({
      ...input,
    });

    revalidatePath("/dashboard");
    return res;
  });
