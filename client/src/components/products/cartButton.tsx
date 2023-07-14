import { Button, ButtonProps } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import useCartAPI from "@/lib/api/cartAPI";
import { ForwardRefRenderFunction, Ref, forwardRef } from "react";

type CartButtonProps = ButtonProps & {
  type?: "button" | "submit" | "reset";
};

type CartButtonRef = HTMLButtonElement;

const CartButton: ForwardRefRenderFunction<CartButtonRef, CartButtonProps> = (
  { onClick, type = "button", ...restProps },
  ref: Ref<CartButtonRef>
) => {
  const { openSheet } = useCart();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    openSheet();
    if (onClick) {
      onClick(event);
    }
  };

  return <Button onClick={handleClick} type={type} {...restProps} ref={ref} />;
};

export default forwardRef<CartButtonRef, CartButtonProps>(CartButton);
