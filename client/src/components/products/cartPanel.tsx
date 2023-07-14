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
import { z } from "zod";
import { ProductElementSchema } from "@/lib/schemas/cartSchema";

type ProductElement = z.infer<typeof ProductElementSchema>;

const products: ProductElement[] = [
  {
    _id: "64afaa0054ca59665341012d",
    product: {
      _id: "64ad99621b0a42ee9005ae5a",
      title: "Realme X50",
      price: 1990.99,
    },
    quantity: 2,
    variant: "512GB",
    image:
      "https://images.unsplash.com/photo-1674751869744-27eddb18e4a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
  },
];
type SheetModalProps = {
  children?: React.ReactNode;
};

const CartPanel: React.FC<SheetModalProps> = ({ children }) => {
  const { isOpen, setIsOpen } = useCart();

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="flex h-screen flex-col">
          <SheetHeader className="flex-none">
            <SheetTitle>Cart</SheetTitle>
            <SheetDescription>Item added to the cart.</SheetDescription>
          </SheetHeader>
          <section className="mt-8 flex h-auto grow flex-col overflow-y-scroll px-2">
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {products.map((product) => (
                <li key={product._id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={product.image}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <Link to="products/product.product._id">
                            {product.product.title}
                          </Link>
                        </h3>
                        <p className="ml-4">{product.product.price}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.variant}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">Qty {product.quantity}</p>

                      <div className="flex">
                        <Button
                          variant="ghost"
                          type="button"
                          size="sm"
                          className="duration-200 hover:bg-red-100">
                          <Trash2 size="20" color="red" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <Separator />
          <SheetFooter className="flex-none !flex-col-reverse">
            <div className="mt-4">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>$262.00</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-2">
                <Link
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
                  onClick={() => setIsOpen(false)}>
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </Button>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CartPanel;
