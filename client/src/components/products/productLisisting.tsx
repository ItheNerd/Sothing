import { z } from "zod";
import { HTMLAttributes, Ref, forwardRef, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "../ui/input";
import CartButton from "./cartButton";
import { Heart, ShoppingCart } from "lucide-react";
import {
  ProductSchema,
  VariantConfigSchema,
} from "@/lib/schemas/productSchema";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type ProductType = z.infer<typeof ProductSchema>;
type VariantConfigType = z.infer<typeof VariantConfigSchema>;

type ProductPriceProps = HTMLAttributes<HTMLDivElement> & {
  currency?: string;
  price?: number;
};

type ProductListingImageType = {
  images?: any[];
  coverImageURL: string;
};

interface ProductDetailProps {
  product: ProductType;
}

interface ProductVariantFormProps {
  product: ProductType;
  onVariantSelect: (variantId: string | null) => void;
}

function getVariantCombinationString(variantConfig: VariantConfigType): string {
  return variantConfig.variantCombination
    .map((variant) => `${variant.variantType}: ${variant.variantValue}`)
    .join(", ");
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
          <AccordionTrigger className="font-notosans">
            Is it accessible?
          </AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="font-notosans">
            Is it styled?
          </AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other
            components&apos; aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="font-notosans">
            Is it animated?
          </AccordionTrigger>
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
        {images.map((image, index) => (
          <img
            key={index}
            alt={`Image ${index + 1}`}
            src={image}
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
      {tags.map((tag, index) => (
        <Badge key={index} variant="outline" className="mr-1 capitalize">
          {tag}
        </Badge>
      ))}
    </div>
  );
};

function ProductVariantSelector({
  product,
  onVariantSelect,
}: ProductVariantFormProps) {
  const { variantConfig } = product;
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    variantConfig[0]._id
  );

  const handleVariantChange = (selectedVariantId: string) => {
    setSelectedVariant(selectedVariantId);
    onVariantSelect(selectedVariantId); // Send selected variant ID back to ProductDetail
  };

  useEffect(() => {
    handleVariantChange(variantConfig[0]._id);
  }, []);

  return (
    <TooltipProvider>
      <div className="mt-4 flex gap-4 ">
        {variantConfig.map((variant) => (
          <Tooltip key={variant._id}>
            <TooltipTrigger
              key={variant._id}
              onClick={() => handleVariantChange(variant._id)}
              className={cn(
                "group relative inline-flex h-16 min-w-[2rem] max-w-fit items-center justify-center overflow-hidden rounded-lg border-2 text-xs font-medium",
                variant.quantity === 0 &&
                  "border-red-500 before:absolute before:-inset-1 before:bg-red-400 before:bg-opacity-30"
              )}>
              <input
                type="radio"
                name="variant"
                id={`option_${variant._id}`}
                className="peer sr-only"
                checked={selectedVariant === variant._id}
                readOnly
              />
              <img
                src={variant.images[0]}
                alt={`Image for ${variant.name}`}
                className="max-h-full"
              />
              <p className="flex h-full w-full items-center justify-center px-4 peer-checked:bg-black peer-checked:text-white">
                {variant.name}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getVariantCombinationString(variant)}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

function ProductCartandWishList({
  productId,
  variantConfigId,
}: {
  productId: string;
  variantConfigId: string;
}) {
  const [quantity, setQuantity] = useState<number>(1);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Get the value from the input and parse it as a number
    const newQuantity = parseInt(event.target.value);

    // Check if the value is a valid number and greater than 0
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setQuantity(newQuantity);
    } else {
      setQuantity(1);
    }
  };

  return (
    <div className="mt-8 flex items-center justify-between">
      <div className="flex gap-4">
        <div>
          <label className="sr-only">Qty</label>
          <Input
            type="number"
            id="quantity"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="input w-12 rounded border-gray-200 py-3 text-center text-xs [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
        <CartButton
          productId={productId}
          variantConfigId={variantConfigId}
          quantity={quantity}>
          <ShoppingCart className="mr-4" size="20" />
          Add to Cart
        </CartButton>
      </div>
      <Button variant="secondary" className="group hover:bg-rose-200">
        <Heart className="duration-75 ease-in group-hover:text-rose-500" />
      </Button>
    </div>
  );
}

function ProductDetail({ product }: ProductDetailProps) {
  const { title, description, coverImageURL, tags, _id } = product;
  const [selectedVariant, setSelectedVariant] =
    useState<VariantConfigType | null>(null);
  const handleVariantSelect = (variantId: string | null) => {
    const selectedConfig = product.variantConfig.find(
      (config) => config._id === variantId
    );
    setSelectedVariant(selectedConfig || null);
  };

  return (
    <section>
      <div className="relative mx-auto max-w-screen-xl px-4 py-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          <ProductListingImage
            coverImageURL={coverImageURL}
            images={selectedVariant?.images}
          />
          <div className="sticky top-0">
            <ProductTags tags={tags} />
            <div className="mt-8 flex justify-between">
              <div className="max-w-[35ch] space-y-2">
                <h1 className="text-xl sm:text-2xl">{title}</h1>
                <h3>{selectedVariant?.name}</h3>
                <ProductRating rating={selectedVariant?.rating || 0} />
              </div>
              <ProductPrice
                price={selectedVariant?.price.amount || 0}
                currency={selectedVariant?.price.unit || "INR"}
              />
            </div>
            <ProductDescription description={description} />
            <ProductVariantSelector
              product={product}
              onVariantSelect={handleVariantSelect}
            />
            <ProductCartandWishList
              productId={_id}
              variantConfigId={selectedVariant?._id || ""}
            />
            <ProductFAQ />
          </div>
        </div>
      </div>
      <Separator className="mt-4" />
    </section>
  );
}

export default ProductDetail;
