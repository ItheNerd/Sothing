import { z } from "zod";

const PriceSchema = z.object({
  amount: z.number(),
  unit: z.string(),
});

const VariantCombinationSchema = z.object({
  variantType: z.string(),
  variantValue: z.string(),
  _id: z.string(),
});

const VariantConfigSchema = z.object({
  price: PriceSchema,
  name: z.string(),
  sq_id: z.string(),
  variantCombination: z.array(VariantCombinationSchema),
  quantity: z.number(),
  images: z.array(z.string()),
  rating: z.number(),
  _id: z.string(),
});

const ProductIDSchema = z.object({
  _id: z.string(),
  title: z.string(),
  variantConfig: z.array(VariantConfigSchema),
  company: z.string(),
  brand: z.string(),
  coverImageURL: z.string(),
  rating: z.number(),
});

const ItemSchema = z.object({
  productId: ProductIDSchema,
  quantity: z.number(),
  variantConfigId: z.string(),
  _id: z.string(),
});

const MainCartSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  totalPrice: z.number(),
  items: z.array(ItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number(),
  id: z.string(),
});

export {
  PriceSchema,
  VariantCombinationSchema,
  VariantConfigSchema,
  ProductIDSchema,
  ItemSchema,
  MainCartSchema,
};
