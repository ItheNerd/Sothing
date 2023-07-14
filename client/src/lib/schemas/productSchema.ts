import { z } from "zod";

const ImageSchema = z.object({
  public_id: z.string(),
  url: z.string(),
  _id: z.string(),
});

const RatingSchema = z.object({
  star: z.number(),
  review: z.string(),
  postedby: z.string(),
  _id: z.string(),
});

const BrandSchema = z.object({
  _id: z.string(),
  title: z.string(),
});

const CategorySchema = z.object({
  _id: z.string(),
  title: z.string(),
});

const CompanySchema = z.object({
  _id: z.string(),
  title: z.string(),
});

const VariantSchema = z.object({
  variantType: z.string(),
  variantConfigurations: z.array(z.string()),
});

const ProductSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.number(),
  category: CategorySchema,
  brand: BrandSchema,
  company: CompanySchema,
  quantity: z.number(),
  sold: z.number(),
  images: z.array(ImageSchema),
  coverImageURL: z.string(),
  variants: z.array(VariantSchema),
  tags: z.array(z.string()),
  ratings: z.array(RatingSchema),
  createdAt: z.string(), // Change to date if possible
  updatedAt: z.string(), // Change to date if possible
});

const GetProductListSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalProducts: z.number(),
  totalPages: z.number(),
  products: z.array(ProductSchema),
});

export { GetProductListSchema, ProductSchema, ImageSchema, RatingSchema };
