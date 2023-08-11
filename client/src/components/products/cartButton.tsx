import { Button, ButtonProps } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import useCartAPI from "@/lib/api/cartAPI";
import { ForwardRefRenderFunction, Ref, forwardRef } from "react";
import { useMutation } from "@tanstack/react-query";

type CartButtonProps = ButtonProps & {
  type?: "button" | "submit" | "reset";
  productId: string;
  variantConfigId: string;
  quantity?: number;
};

type CartButtonRef = HTMLButtonElement;

const CartButton: ForwardRefRenderFunction<CartButtonRef, CartButtonProps> = (
  {
    onClick,
    type = "button",
    productId,
    variantConfigId,
    quantity = 1,
    ...restProps
  },
  ref: Ref<CartButtonRef>
) => {
  const { openSheet } = useCart();
  const cartAPI = useCartAPI();

  // React Query mutation to handle addToCart API call
  const addToCartMutation = useMutation(
    () => cartAPI.addToCart(productId, quantity, variantConfigId),
    {
      onSuccess: () => {
        openSheet();
      },
      onError: (error) => {
        console.log("Failed to add item to cart", error);
      },
    }
  );

  const handleClick = async () => {
    try {
      // Trigger the React Query mutation
      await addToCartMutation.mutateAsync();
    } catch (error) {
      console.log("Failed to add item to cart", error);
    }
  };

  return <Button onClick={handleClick} type={type} {...restProps} ref={ref} />;
};

export default forwardRef<CartButtonRef, CartButtonProps>(CartButton);
