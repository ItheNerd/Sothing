import z from "zod";

const VariantCombinationSchema = z.object({
  variantType: z.string(),
  variantValue: z.string(),
  _id: z.string(),
});

const PriceSchema = z.object({
  amount: z.number(),
  unit: z.string(),
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

const InfoTitleSchema = z.object({
  _id: z.string(),
  title: z.string(),
});

const VariantTableSchema = z.object({
  variantType: z.string(),
  variantValues: z.array(z.string()),
  _id: z.string(),
});

const ProductSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  variantConfig: z.array(VariantConfigSchema),
  company: InfoTitleSchema,
  brand: InfoTitleSchema,
  category: InfoTitleSchema,
  coverImageURL: z.string(),
  tags: z.array(z.string()),
  rating: z.number(),
  variantTable: z.array(VariantTableSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const GetProductListSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalProducts: z.number(),
  totalPages: z.number(),
  products: z.array(ProductSchema),
});

const ProductRecommendationSchema = z.object({
  _id: z.string(),
  title: z.string(),
  coverImageURL: z.string(),
  tags: z.array(z.string()),
});

export {
  GetProductListSchema,
  ProductRecommendationSchema,
  ProductSchema,
  InfoTitleSchema,
  VariantConfigSchema,
  PriceSchema,
  VariantCombinationSchema,
  VariantTableSchema,
};
