import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { Button, buttonVariants } from "../ui/button";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "../ui/separator";
import { useQuery } from "@tanstack/react-query";
import useCartAPI from "@/lib/api/cartAPI";
import { MainCartSchema } from "@/lib/schemas/cartSchema";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

type MainCartType = z.infer<typeof MainCartSchema>;

type SheetModalProps = {
  children?: React.ReactNode;
};

const CartPanel: React.FC<SheetModalProps> = () => {
  const { user } = useAuth();
  const cartAPI = useCartAPI(); // Initialize the cart API
  const { isOpen: isCartOpen, setIsOpen: setIsCartOpen } = useCart();

  // Fetch cart data using React Query
  const { data: cartData, refetch } = useQuery<MainCartType>({
    queryKey: ["cart", "getCartInfo"],
    queryFn: async () => await cartAPI.getCart(),
    enabled: !!user && isCartOpen,
    suspense: false,
  });

  // Automatically refetch when the cart panel is opened or user changes
  useEffect(() => {
    if (isCartOpen && user) {
      refetch();
    }
  }, [isCartOpen, user, refetch]);

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="flex h-screen flex-col">
          {user ? (
            <>
              <SheetHeader className="flex-none">
                <SheetTitle className="capitalize">
                  {user.firstname}'s Cart
                </SheetTitle>
                <SheetDescription>Items added to the cart.</SheetDescription>
              </SheetHeader>
              {cartData && (
                <section className="mt-8 flex h-auto grow flex-col overflow-y-scroll px-2">
                  <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {cartData.items.map((item) => (
                      <li key={item._id} className="flex py-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                          <img
                            src={item.productId.coverImageURL}
                            alt={item.productId.title}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between font-medium text-primary">
                              <h3>
                                <Link to={`/products/${item.productId._id}`}>
                                  {item.productId.title}
                                </Link>
                              </h3>
                              <p className="ml-4">
                                {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency:
                                    item.currency !== undefined
                                      ? item.currency
                                      : "USD",
                                }).format(
                                  item.productId.variantConfig[0].price.amount
                                )}
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.productId.variantConfig[0].name}
                            </p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <p className="text-muted-foreground">
                              Qty {item.quantity}
                            </p>
                            <div className="flex">
                              <Button
                                variant="ghost"
                                type="button"
                                size="sm"
                                className="duration-200 hover:bg-red-200">
                                <Trash2
                                  size="20"
                                  className="text-destructive"
                                />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              <Separator />
              <SheetFooter className="flex-none !flex-col-reverse">
                {cartData && (
                  <div className="mt-4">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>${cartData.totalPrice.toFixed(2)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Shipping and taxes calculated at checkout.
                    </p>
                    <div className="mt-6 flex flex-col items-center justify-center gap-2">
                      <Link
                        onClick={() => setIsCartOpen(false)}
                        to="/checkout"
                        className={buttonVariants({
                          variant: "default",
                          size: "wide",
                        })}>
                        Checkout
                      </Link>
                      <span>or</span>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setIsCartOpen(false)}>
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </Button>
                    </div>
                  </div>
                )}
              </SheetFooter>
            </>
          ) : (
            <section className="flex h-full w-full flex-col items-center justify-center overflow-y-scroll px-2">
              <h2 className="font-abeezee text-lg tracking-wide">
                Please <span className="font-calsans text-xl">LogIN</span> or{" "}
                <span className="font-calsans text-xl">SignUP</span>
              </h2>
              <Separator className="my-5 h-[2px] w-3/4 bg-black" />
              <div className="flex gap-3 p-4">
                <Link to="/auth?type=login">
                  <Button
                    variant="secondary"
                    onClick={() => setIsCartOpen(!isCartOpen)}>
                    LogIN.
                  </Button>
                </Link>
                <Link to="/auth?type=signup">
                  <Button
                    variant="secondary"
                    onClick={() => setIsCartOpen(!isCartOpen)}>
                    SignUP.
                  </Button>
                </Link>
              </div>
            </section>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CartPanel;
