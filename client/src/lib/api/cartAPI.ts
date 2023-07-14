import { useState, useEffect } from "react";
import useAxios from "../hooks/useAxios";
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

type ProductProduct = z.infer<typeof ProductProductSchema>;
type ProductElement = z.infer<typeof ProductElementSchema>;
type Cart = z.infer<typeof CartSchema>;
type Main = z.infer<typeof MainSchema>;

const useCart = () => {
  const { api } = useAxios({ subURL: "cart" });
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get<Main>("/");
        setCart(response.data.cart);
      } catch (error: any) {
        setError(error.response?.data?.message || "Error retrieving cart");
      }

      setIsLoading(false);
    };

    fetchCart();
  }, [api]);

  const addToCart = async (
    productId: string,
    quantity: number,
    variant: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<Main>("/", {
        productId,
        quantity,
        variant,
      });
      setCart(response.data.cart);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error adding to cart");
    }

    setIsLoading(false);
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.put<Main>(`/${productId}`, { quantity });
      setCart(response.data.cart);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error updating cart item");
    }

    setIsLoading(false);
  };

  const removeCartItem = async (productId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.delete<Main>(`/${productId}`);
      setCart(response.data.cart);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error removing cart item");
    }

    setIsLoading(false);
  };

  const clearCart = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.delete<Main>("/");
      setCart(response.data.cart);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error clearing cart");
    }

    setIsLoading(false);
  };

  const getCart = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<Main>("/");
      setCart(response.data.cart);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error retrieving cart");
    }

    setIsLoading(false);
  };

  return {
    cart,
    isLoading,
    error,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    getCart,
  };
};

export default useCart;
