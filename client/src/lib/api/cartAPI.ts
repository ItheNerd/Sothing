import useAxios from "../hooks/useAxios";
import { z } from "zod";
import { MainCartSchema } from "../schemas/cartSchema";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const useCartAPI = () => {
  const { api: cartAPI } = useAxios({ subURL: "cart" });
  const { user } = useAuth();
  const { toast } = useToast();

  // Define the types using the Zod schemas
  type MainCartType = z.infer<typeof MainCartSchema>;

  const addToCart = async (
    productId: string,
    quantity: number,
    variantConfigId: string
  ): Promise<MainCartType> => {
    if (!user) {
      // Display a toast asking the user to sign in
      toast({
        variant: "default",
        title: "Sign In Required",
        description: "Please sign in before adding items to your cart.",
      });
      throw new Error("User not signed in.");
    }
    try {
      const response = await cartAPI.post("/", {
        productId,
        quantity,
        variantConfigId,
      });
      const cart = MainCartSchema.parse(response.data);
      return cart;
    } catch (error) {
      throw new Error("Failed to add item to cart");
    }
  };

  const getCart = async (): Promise<MainCartType> => {
    if (!user) {
      //   Display a toast asking the user to sign in
      toast({
        variant: "default",
        title: "Sign In Required",
        description: "Please sign in before adding items to your cart.",
      });
      throw new Error(`User: ${user} not signed in.`);
    }
    try {
      const response = await cartAPI.get("/");
      const cart = MainCartSchema.parse(response.data);
      return cart;
    } catch (error) {
      throw new Error("Failed to fetch cart");
    }
  };

  const updateCartItem = async (
    itemId: string,
    quantity: number
  ): Promise<MainCartType> => {
    if (!user) {
      // Display a toast asking the user to sign in
      toast({
        variant: "default",
        title: "Sign In Required",
        description: "Please sign in before adding items to your cart.",
      });
      throw new Error(`User: ${user} not signed in.`);
    }
    try {
      const response = await cartAPI.put(`/${itemId}`, { quantity });
      const cart = MainCartSchema.parse(response.data);
      return cart;
    } catch (error) {
      throw new Error("Failed to update cart item");
    }
  };

  const removeCartItem = async (itemId: string): Promise<MainCartType> => {
    if (!user) {
      // Display a toast asking the user to sign in
      toast({
        variant: "default",
        title: "Sign In Required",
        description: "Please sign in before adding items to your cart.",
      });
      throw new Error(`User: ${user} not signed in.`);
    }
    try {
      const response = await cartAPI.delete(`/${itemId}`);
      const cart = MainCartSchema.parse(response.data);
      return cart;
    } catch (error) {
      throw new Error("Failed to remove item from cart");
    }
  };

  const clearCart = async (): Promise<MainCartType> => {
    if (!user) {
      // Display a toast asking the user to sign in
      toast({
        variant: "default",
        title: "Sign In Required",
        description: "Please sign in before adding items to your cart.",
      });
      throw new Error(`User: ${user} not signed in.`);
    }
    try {
      const response = await cartAPI.delete("/");
      const cart = MainCartSchema.parse(response.data);
      return cart;
    } catch (error) {
      throw new Error("Failed to clear cart");
    }
  };

  return {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart,
  };
};

export default useCartAPI;
