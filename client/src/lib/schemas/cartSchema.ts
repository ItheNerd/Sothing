import { z } from "zod";

const ProductProductSchema = z.object({
  _id: z.string(),
  title: z.string(),
  price: z.number(),
});

const ProductElementSchema = z.object({
  product: ProductProductSchema,
  quantity: z.number(),
  variant: z.string(),
  _id: z.string(),
  image: z.string(),
});

const CartSchema = z.object({
  _id: z.string(),
  user: z.string(),
  total: z.number(),
  products: z.array(ProductElementSchema),
  __v: z.number(),
});

const MainSchema = z.object({
  cart: CartSchema,
});

export { MainSchema, CartSchema, ProductElementSchema, ProductProductSchema };
