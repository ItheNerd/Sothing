import useAxios from "../hooks/useAxios";
import { z } from "zod";
import {
  GetProductListSchema,
  ProductRecommendationSchema,
  ProductSchema,
} from "../schemas/productSchema";

// Define the types using the Zod schemas
type ProductType = z.infer<typeof ProductSchema>;
type GetProductListType = z.infer<typeof GetProductListSchema>;
type ProductRecommendationType = z.infer<typeof ProductRecommendationSchema>;

// Custom hook for product API
const useProductAPI = () => {
  const { api: productAPI } = useAxios({ subURL: "product" });

  const getRecommendedProducts = async (
    id: string,
    limit: number = 5
  ): Promise<ProductRecommendationType[]> => {
    try {
      const response = await productAPI.get("/recommendations", {
        params: { id, limit },
      });
      const products: ProductRecommendationType[] = response.data.map(
        (product: ProductRecommendationType) => ProductRecommendationSchema.parse(product)
      );
      return products;
    } catch (error) {
      throw new Error(`Something went wrong in the products' API: ${error}`);
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
      throw new Error(`Something went wrong in the products' API: ${error}`);
    }
  };

  const getProductById = async (productId: string): Promise<ProductType> => {
    try {
      const response = await productAPI.get(`/listings/${productId}`);
      const product = ProductSchema.parse(response.data);
      return product;
    } catch (error) {
      throw new Error(`Something went wrong in the products' API: ${error}`);
    }
  };

  const createProduct = async (product: ProductType): Promise<ProductType> => {
    try {
      const response = await productAPI.post("/", product);
      const createdProduct = ProductSchema.parse(response.data);
      return createdProduct;
    } catch (error) {
      throw new Error(`Something went wrong in the products' API: ${error}`);
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
      throw new Error(`Something went wrong in the products' API: ${error}`);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await productAPI.delete(`/${productId}`);
    } catch (error) {
      throw new Error(`Something went wrong in the products' API: ${error}`);
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
      throw new Error(`Something went wrong in the products' API: ${error}`);
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
