import { z } from "zod";

const CATEGORIES = ["clothes", "gym-equipment", "home-appliances", "pc-setup", "furniture"];

export const productSchema = z
  .object({
    slug: z.string().trim().min(1, "Slug is required").toLowerCase(),
    name: z.string().trim().min(1, "Name is required"),
    category: z.enum(CATEGORIES, { message: "Pick a category" }),
    brand: z.string().trim().optional(),
    price: z.coerce.number().min(0, "Price must be 0 or more"),
    salePrice: z.coerce.number().min(0).optional().or(z.literal("")),
    onSale: z.boolean().optional(),
    isNewArrival: z.boolean().optional(),
    stock: z.coerce.number().min(0).default(0),
    image: z.string().trim().min(1, "Main image URL is required"),
    description: z.string().trim().optional(),
  })
  .refine(
    (data) => !data.onSale || (data.salePrice !== "" && data.salePrice != null),
    { message: "Sale price is required when On Sale is checked", path: ["salePrice"] }
  )
  .refine(
    (data) => data.salePrice === "" || data.salePrice == null || data.salePrice <= data.price,
    { message: "Sale price can't exceed regular price", path: ["salePrice"] }
  );

export const CATEGORY_LIST = CATEGORIES;