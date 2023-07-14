import { z } from "zod";
import { HTMLAttributes, Ref, forwardRef, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CartButton from "./cartButton";
import { ShoppingCart } from "lucide-react";
import { ImageSchema, ProductSchema } from "@/lib/schemas/productSchema";
import { cn } from "@/lib/utils";

type ProductType = z.infer<typeof ProductSchema>;
type ImageType = z.infer<typeof ImageSchema>;

type ProductPriceProps = HTMLAttributes<HTMLDivElement> & {
  currency?: string;
  price?: number;
};

type ProductListingImageType = {
  images: ImageType[];
  coverImageURL: string;
};

interface SelectInputProps {
  legend: string;
  options: string[];
  name: string;
  selectedOption: string;
  onChange: (option: string) => void;
}

interface ProductDetailProps {
  product: ProductType;
}

function FAQAccordion() {
  return (
    <section className="my-8">
      <header className="w-max px-2 py-4 font-semibold underline">
        FAQ Section
      </header>
      <Accordion
        type="single"
        collapsible
        className="w-full rounded-lg border px-4">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other
            components&apos; aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. It&apos;s animated by default, but you can disable it if you
            prefer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}

function Rating({ rating }: { rating: number }) {
  return (
    <div className="rating">
      <input name="rating-2" className="mask mask-star-2 bg-orange-400" />
      <input name="rating-2" className="mask mask-star-2 bg-orange-400" />
      <input name="rating-2" className="mask mask-star-2 bg-orange-400" />
      <input name="rating-2" className="mask mask-star-2 bg-orange-400" />
      <input name="rating-2" className="mask mask-star-2 bg-orange-400" />
    </div>
  );
}

const Price = forwardRef(function ProductPrice(
  { currency = "INR", price = 0, className, ...props }: ProductPriceProps,
  ref: Ref<HTMLDivElement>
) {
  const formattedPrice = price !== undefined ? price : "";

  return (
    <div
      ref={ref}
      className={cn("text-lg font-semibold text-gray-900", className)}
      {...props}>
      {formattedPrice !== "" ? (
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
        }).format(formattedPrice)
      ) : (
        <span>Price not available</span>
      )}
    </div>
  );
});

function Description({ description }: { description: string }) {
  return (
    <div className="mt-4">
      <div className="prose max-w-none">
        <p>{description}</p>
      </div>

      <Button variant="link" className="underline">
        Read More
      </Button>
    </div>
  );
}

const SelectInput: React.FC<SelectInputProps> = ({
  legend,
  options,
  name,
  selectedOption,
  onChange,
}) => {
  return (
    <fieldset className="mt-4">
      <legend className="mb-1 text-sm font-medium">{legend}</legend>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => (
          <label className="cursor-pointer" key={option}>
            <input
              type="radio"
              name={name}
              id={`option_${option}`}
              className="peer sr-only"
              checked={selectedOption === option}
              onChange={() => onChange(option)}
            />
            <span className="group inline-flex h-8 w-full min-w-[2rem] items-center justify-center rounded-full border p-4 text-xs font-medium peer-checked:bg-black peer-checked:text-white">
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};

function QuantityInput() {
  const { register } = useForm();
  return (
    <div>
      <label className="sr-only">Qty</label>
      <Input
        type="number"
        id="quantity"
        min="1"
        defaultValue="1"
        className="input w-12 rounded border-gray-200 py-3 text-center text-xs [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        {...register("quantity")}
      />
    </div>
  );
}

function ProductListingImage({
  coverImageURL,
  images,
}: ProductListingImageType) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
      <img
        alt="Les Paul"
        src={coverImageURL}
        className="aspect-square w-full rounded-xl object-cover"
      />

      <div className="grid grid-cols-2 gap-4 lg:mt-4">
        {images.map((image) => (
          <img
            key={image._id}
            alt={`Image ${image.public_id}`}
            src={image.url}
            className="aspect-square w-full rounded-xl object-cover"
          />
        ))}
      </div>
    </div>
  );
}

function ProductDetail({ product }: ProductDetailProps) {
  const {
    title,
    ratings,
    price,
    description,
    coverImageURL,
    images,
    variants,
  } = product;
  const [variantOption, setVariantOption] = useState("");
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
  });
  const onSubmit = (data: z.infer<typeof ProductSchema>) => {
    console.log(data);
  };

  const handleVariantChange = (option: string) => {
    setVariantOption(option);
  };

  return (
    <section>
      <div className="relative mx-auto max-w-screen-xl px-4 py-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          <ProductListingImage coverImageURL={coverImageURL} images={images} />
          <div className="sticky top-0">
            <Badge variant="outline">Pre Order</Badge>

            <div className="mt-8 flex justify-between">
              <div className="max-w-[35ch] space-y-2">
                <h1 className="text-xl sm:text-2xl">{title}</h1>
                <Rating rating={ratings[0].star} />
              </div>

              <Price price={price} />
            </div>
            <Description description={description} />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {variants.map((variant) => (
                  <FormField
                    key={variant.variantType}
                    name="variants"
                    control={form.control}
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <SelectInput
                            legend={variant.variantType}
                            options={variant.variantConfigurations}
                            name={variant.variantType}
                            selectedOption={variantOption}
                            onChange={handleVariantChange}
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <div className="mt-8 flex gap-4">
                  <QuantityInput />
                  <CartButton>
                    <ShoppingCart className="mr-4" size="20" />
                    Add to Cart
                  </CartButton>
                </div>
                <FAQAccordion />
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
