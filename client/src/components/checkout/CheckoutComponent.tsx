import { ReactNode} from "react";
import { Button } from "../ui/button";
import { Trash2, WalletIcon } from "lucide-react";
import { Link } from "react-router-dom";
import useCartAPI from "@/lib/api/cartAPI";
import { useQuery } from "@tanstack/react-query";
import { MainCartSchema } from "@/lib/schemas/cartSchema";
import { z } from "zod";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "../ui/badge";

type Props = { wrapped?: boolean } & {
  checkoutOrderSummary: ReactNode;
  checkoutForm: ReactNode;
};

type MainCartType = z.infer<typeof MainCartSchema>;

const CheckoutComponent = (props: Props) => {
  const { checkoutOrderSummary, checkoutForm } = props;
  return (
    <section className="flex flex-wrap-reverse items-center justify-center lg:gap-16">
      <div className="min-w-full sm:min-w-fit">{checkoutForm}</div>
      <Separator orientation="vertical" className="h-full" />
      <div className="min-w-full sm:min-w-fit">{checkoutOrderSummary}</div>
    </section>
  );
};

export const CheckoutOrderSummary = () => {
  const cartAPI = useCartAPI();
  const { data: cartData } = useQuery<MainCartType>({
    queryKey: ["cart", "getCartInfo"],
    queryFn: async () => await cartAPI.getCart(),
    suspense: false,
  });

  return (
    <section className="flex h-auto flex-col rounded-2xl bg-muted p-10">
      <header className="flex-none">
        <div className="text-2xl capitalize">Your Cart</div>
        <div className="">What you buy daa~~~</div>
      </header>
      <Separator className="mt-2 h-[2px] bg-muted" />
      <div className="mt-8 flex h-auto grow flex-col overflow-y-scroll px-2">
        <ul role="list" className="-my-6 max-h-[60vh] divide-y divide-border">
          {cartData?.items.map((item) => (
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
                          item.currency !== undefined ? item.currency : "USD",
                      }).format(item.productId.variantConfig[0].price.amount)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.productId.variantConfig[0].name}
                  </p>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                  <p className="text-muted-foreground">Qty {item.quantity}</p>
                  <div className="flex">
                    <Button
                      variant="ghost"
                      type="button"
                      size="sm"
                      className="duration-200 hover:bg-red-200">
                      <Trash2 size="20" className="text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
        <div className="w-screen max-w-lg space-y-4">
          <dl className="space-y-0.5 text-sm text-gray-700">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>${cartData?.totalPrice.toFixed(2)}</dd>
            </div>

            <div className="flex justify-between">
              <dt>VAT</dt>
              <dd>£25</dd>
            </div>

            <div className="flex justify-between">
              <dt>Discount</dt>
              <dd>-£20</dd>
            </div>

            <div className="flex justify-between !text-base font-medium">
              <dt>Total</dt>
              <dd>£200</dd>
            </div>
          </dl>

          <div className="flex justify-end">
            <Badge className="whitespace-nowrap text-xs">
              <WalletIcon size={15} className="mr-2" /> 2 Discounts Applied
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

const FormSchema = z.object({
  email: z.string({
    required_error: "Please select an email to display.",
  }),
  phoneNumber: z.string(),
  cardName: z.string(),
  cardNumber: z.string(),
  expiration: z.string(),
  cvc: z.string(),
  address: z.object({
    country: z.string(),
    zipCode: z.string(),
    address: z.string(),
  }),
});

const countrys = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

type FormValues = z.infer<typeof FormSchema>;

export const CheckoutForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      phoneNumber: "",
      cardNumber: "",
    },
    mode: "onChange",
  });
  const { toast } = useToast();

  function onSubmit(data: FormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 p-8">
        <Button>
          <div>
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.9099 4.27692C9.6499 4.27692 9.1174 4.87817 8.2399 4.87817C7.34021 4.87817 6.65396 4.28129 5.56208 4.28129C4.49333 4.28129 3.35365 4.93379 2.6299 6.04535C1.61365 7.61285 1.78615 10.565 3.43208 13.08C4.02083 13.9804 4.80708 14.99 5.83833 15.001H5.85708C6.75333 15.001 7.01958 14.4141 8.25302 14.4072H8.27177C9.48677 14.4072 9.73052 14.9975 10.623 14.9975H10.6418C11.673 14.9866 12.5015 13.8679 13.0902 12.971C13.514 12.326 13.6715 12.0022 13.9965 11.2725C11.6155 10.3688 11.233 6.99348 13.5877 5.69942C12.869 4.79942 11.859 4.27817 10.9068 4.27817L10.9099 4.27692Z"
                fill="currentColor"
              />
              <path
                d="M10.6338 1C9.88379 1.05094 9.00879 1.52844 8.49629 2.15188C8.03129 2.71688 7.64879 3.555 7.79879 4.36781H7.85879C8.65754 4.36781 9.47504 3.88688 9.95254 3.27063C10.4125 2.68406 10.7613 1.85281 10.6338 1V1Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div>
            <p className="text-base leading-4">Pay</p>
          </div>
        </Button>
        <div className="mt-6 flex flex-row items-center justify-center">
          <hr className="w-full border" />
          <p className="flex flex-shrink-0 px-4 text-base leading-4 text-gray-600 dark:text-white">
            or pay with card
          </p>
          <hr className="w-full border" />
        </div>
        <div className="mt-2 flex flex-col gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@mail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator className="mt-6 h-[2px]" />
          <FormField
            control={form.control}
            name="cardName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Jhon Doe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="0000 0000 0000 0000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-2">
            <FormField
              control={form.control}
              name="expiration"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="MM/YY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cvc"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="CVC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator className="mt-6 h-[2px]" />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={() => (
            <>
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="address.country"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Country</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] translate-y-[5px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}>
                              {field.value
                                ? countrys.find(
                                    (country) => country.value === field.value
                                  )?.label
                                : "Select language"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search country..." />
                            <CommandEmpty>
                              No such country found OR we don't deliver there.
                            </CommandEmpty>
                            <CommandGroup>
                              {countrys.map((country) => (
                                <CommandItem
                                  value={country.label}
                                  key={country.value}
                                  onSelect={() => {
                                    form.setValue(
                                      "address.country",
                                      country.value
                                    );
                                  }}>
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      country.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {country.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZipCode</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        />

        <Button type="submit" className="mt-4">
          Continue Checkout...
        </Button>
      </form>
    </Form>
  );
};

export default CheckoutComponent;
