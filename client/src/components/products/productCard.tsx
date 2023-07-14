import { ReactNode, forwardRef, Ref, HTMLAttributes, Fragment } from "react";
import { Button, ButtonProps } from "../ui/button";
import cn from "classnames";
import { Heart, ShoppingCart } from "lucide-react";
import { Link, LinkProps } from "react-router-dom";

type DivProps = HTMLAttributes<HTMLDivElement>;

type ProductCardProps = DivProps & {
  image?: ReactNode;
  info?: ReactNode;
  action?: ReactNode;
};

export const ProductCard = forwardRef(function ProductCard(
  { image, info, action, className, ...props }: ProductCardProps & LinkProps,
  ref: Ref<HTMLAnchorElement>
) {
  return (
    <Link
      ref={ref}
      className={cn("group block overflow-hidden rounded-lg border", className)}
      {...props}>
      {image}
      <div className="flex items-center justify-between p-2">
        {info}
        {action}
      </div>
    </Link>
  );
});

type ProductImageProps = DivProps & {
  imageURL?: string;
};

export const ProductImage = forwardRef(function ProductImage(
  { imageURL, className, ...props }: ProductImageProps,
  ref: Ref<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className={cn("overflow-hidden rounded-t-lg", className)}
      {...props}>
      <img
        src={imageURL}
        alt=""
        className="h-96 w-full scale-105 object-cover transition duration-700 group-hover:scale-100"
      />
    </div>
  );
});

type ProductInfoProps = DivProps & {
  children: ReactNode;
};
export const ProductInfo = forwardRef(function ProductInfo(
  { children, className, ...props }: ProductInfoProps,
  ref: Ref<HTMLDivElement>
) {
  return (
    <div ref={ref} className={cn("flex flex-col", className)} {...props}>
      {children}
    </div>
  );
});

type ProductTitleProps = DivProps & {
  title?: string;
};
export const ProductTitle = forwardRef(function ProductTitle(
  { title, className, ...props }: ProductTitleProps,
  ref: Ref<HTMLDivElement>
) {
  return (
    <span
      ref={ref}
      className={cn(
        "text-sm capitalize text-gray-700 group-hover:underline group-hover:underline-offset-4",
        className
      )}
      {...props}>
      {title}
    </span>
  );
});

type ProductCategoryProps = DivProps & {
  category?: string;
};
export const ProductCategory = forwardRef(function ProductCategory(
  { category, className, ...props }: ProductCategoryProps,
  ref: Ref<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className={cn("font-medium capitalize", className)}
      {...props}>
      {category}
    </div>
  );
});

type ProductRatingProps = DivProps & {
  stars?: number;
};

export const ProductRating = forwardRef(function ProductRating(
  { stars, className, ...props }: ProductRatingProps,
  ref: Ref<HTMLDivElement>
) {
  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Fragment key={i}>{i <= (stars ?? 0) ? "★" : "☆"}</Fragment>
      ))}
    </div>
  );
});

type ProductPriceProps = DivProps & {
  currency?: string;
  price?: number;
};

export const ProductPrice = forwardRef(function ProductPrice(
  { currency = "INR", price = 0, className, ...props }: ProductPriceProps,
  ref: Ref<HTMLDivElement>
) {
  const formattedPrice = price !== undefined ? price : "";

  return (
    <div
      ref={ref}
      className={cn("tracking-wider text-gray-900", className)}
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

type ProductButtonProps = ButtonProps & DivProps;
export const ProductButton = forwardRef(function ProductButton(
  { className, ...props }: ProductButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  return (
    <div className="flex flex-col">
      <Button
        variant="ghost"
        type="button"
        ref={ref}
        className={cn("", className)}
        {...props}>
        <ShoppingCart />
      </Button>
      <Button
        variant="ghost"
        type="button"
        ref={ref}
        className={cn("", className)}
        {...props}>
        <Heart />
      </Button>
    </div>
  );
});
