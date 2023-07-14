import useAxios from "../hooks/useAxios";
import { z } from "zod";
import {
  ImageSchema,
  GetProductListSchema,
  ProductSchema,
  RatingSchema,
} from "../schemas/productSchema";

// Define the types using the Zod schemas
type ImageType = z.infer<typeof ImageSchema>;
type RatingType = z.infer<typeof RatingSchema>;
type ProductType = z.infer<typeof ProductSchema>;
type GetProductListType = z.infer<typeof GetProductListSchema>;

// Custom hook for product API
const useProductAPI = () => {
  const { api: productAPI } = useAxios({ subURL: "product" });

  const getRecommendedProducts = async (
    id: string,
    limit: number = 5
  ): Promise<ProductType[]> => {
    try {
      const response = await productAPI.get("/recommended", {
        params: { id, limit },
      });
      const products = response.data.products.map((product: any) =>
        ProductSchema.parse(product)
      );
      return products;
    } catch (error) {
      console.log("Failed to fetch recommended products", error);
      throw new Error("Failed to fetch recommended products");
    }
  };

  const getProductList = async (
    page: number = 1,
    limit: number = 10,
    sort: string = "-createdAt",
    filters: Record<string, any> = {}
  ): Promise<GetProductListType> => {
    try {
      const queryParams = {
        page,
        limit,
        sort,
        ...filters,
      };

      const response = await productAPI.get("/listings", {
        params: queryParams,
      });

      const data = GetProductListSchema.parse(response.data);
      return data;
    } catch (error) {
      console.log("Failed to fetch product list", error);
      throw new Error("Failed to fetch product list");
    }
  };

  const getProductById = async (productId: string): Promise<ProductType> => {
    try {
      const response = await productAPI.get(`/listings/${productId}`);
      const product = ProductSchema.parse(response.data);
      return product;
    } catch (error) {
      console.log("Failed to fetch product by ID", error);
      throw new Error("Failed to fetch product by ID");
    }
  };

  const createProduct = async (product: ProductType): Promise<ProductType> => {
    try {
      const response = await productAPI.post("/", product);
      const createdProduct = ProductSchema.parse(response.data);
      return createdProduct;
    } catch (error) {
      console.log("Failed to create product", error);
      throw new Error("Failed to create product");
    }
  };

  const updateProduct = async (
    productId: string,
    product: ProductType
  ): Promise<ProductType> => {
    try {
      const response = await productAPI.put(`/${productId}`, product);
      const updatedProduct = ProductSchema.parse(response.data);
      return updatedProduct;
    } catch (error) {
      console.log("Failed to update product", error);
      throw new Error("Failed to update product");
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await productAPI.delete(`/${productId}`);
    } catch (error) {
      console.log("Failed to delete product", error);
      throw new Error("Failed to delete product");
    }
  };

  const searchProducts = async (search: string): Promise<ProductType[]> => {
    try {
      const response = await productAPI.get("/search", { params: { search } });
      const products = response.data.products.map((product: any) =>
        ProductSchema.parse(product)
      );
      return products;
    } catch (error) {
      console.log("Failed to fetch search results", error);
      throw new Error("Failed to fetch search results");
    }
  };

  return {
    getRecommendedProducts,
    getProductList,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
  };
};

export default useProductAPI;
