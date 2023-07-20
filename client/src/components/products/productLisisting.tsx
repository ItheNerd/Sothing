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
import { Heart, ShoppingCart } from "lucide-react";
import { ProductSchema } from "@/lib/schemas/productSchema";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

type ProductType = z.infer<typeof ProductSchema>;

type ProductPriceProps = HTMLAttributes<HTMLDivElement> & {
  currency?: string;
  price?: number;
};

type ProductListingImageType = {
  images?: any[];
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

function ProductFAQ() {
  return (
    <section className="my-8">
      <header className="w-max px-2 py-4 font-semibold  hover:underline">
        FAQ Section
      </header>
      <Accordion type="single" collapsible className="w-full px-4">
        <Separator />
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

function ProductRating({ rating }: { rating: number }) {
  const maxRating = 5; // Maximum number of stars

  return (
    <div className="rating rating-sm">
      {Array.from({ length: maxRating }).map((_, index) => (
        <input
          key={index}
          name="rating-5"
          className={cn(
            "form-radio mask mask-star-2 pointer-events-none border border-gray-200",
            rating >= index + 1 ? "bg-gray-700" : "bg-gray-200"
          )}
        />
      ))}
    </div>
  );
}

const ProductPrice = forwardRef(function ProductPrice(
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

function ProductDescription({ description }: { description: string }) {
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
    <fieldset className="mt-4 flex items-center gap-4">
      <span className="mb-1 inline-flex h-8 items-center justify-center rounded-lg border bg-gray-200 p-4 text-sm font-medium">
        <legend>{legend}</legend>
      </span>
      <Separator orientation="vertical" className="h-5 bg-black" />
      <div className="flex flex-wrap gap-2">
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
            <span className="group inline-flex h-8 w-full min-w-[2rem] items-center justify-center rounded-lg border p-4 text-xs font-medium peer-checked:bg-black peer-checked:text-white">
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};

function ProductQuantityInput() {
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
  images = ["yo"],
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
            src="image"
            className="aspect-square w-full rounded-xl object-cover"
          />
        ))}
      </div>
    </div>
  );
}

const ProductTags = ({ tags }: { tags: string[] }) => {
  return (
    <div>
      {tags.map((tag) => (
        <Badge variant="outline" className="capitalize mr-1" >
          {tag}
        </Badge>
      ))}
    </div>
  );
};

function ProductVariantForm({ product }: { product: ProductType }) {
  const { variantTable, variantConfig } = product;
  const [variantOption, setVariantOption] = useState("");
  const form = useForm<ProductType>({
    resolver: zodResolver(ProductSchema),
  });
  const onSubmit = (data: ProductType) => {
    console.log(data);
  };

  const handleVariantChange = (option: string) => {
    setVariantOption(option);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {variantTable.map((variant) => (
          <FormField
            key={variant.variantType}
            name={variant.variantType}
            render={() => (
              <FormItem>
                <FormControl>
                  <SelectInput
                    legend={variant.variantType}
                    options={variant.variantValues}
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
        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-4">
            <ProductQuantityInput />
            <CartButton>
              <ShoppingCart className="mr-4" size="20" />
              Add to Cart
            </CartButton>
          </div>
          <Button variant="secondary" className="group hover:bg-rose-200">
            <Heart className="duration-75 ease-in group-hover:text-rose-500" />
          </Button>
        </div>
        <ProductFAQ />
      </form>
    </Form>
  );
}

function ProductDetail({ product }: ProductDetailProps) {
  const { title, description, coverImageURL, tags } = product;

  return (
    <section>
      <div className="relative mx-auto max-w-screen-xl px-4 py-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          <ProductListingImage coverImageURL={coverImageURL} />
          <div className="sticky top-0">
            <ProductTags tags={tags} />
            <div className="mt-8 flex justify-between">
              <div className="max-w-[35ch] space-y-2">
                <h1 className="text-xl sm:text-2xl">{title}</h1>
                <ProductRating rating={3} />
              </div>
              <ProductPrice price={20} />
            </div>
            <ProductDescription description={description} />
            <ProductVariantForm product={product} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
