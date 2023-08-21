import useProductAPI from "@/lib/api/productAPI";
import { ProductRecommendationSchema } from "@/lib/schemas/productSchema";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  ProductCard,
  ProductImage,
  ProductInfo,
  ProductTitle,
} from "./productCard";
import { Badge } from "../ui/badge";

type ProductRecommendationType = z.infer<typeof ProductRecommendationSchema>;

const ProductRecommendation = ({
  productId,
}: {
  productId: string | undefined;
}) => {
  const productAPI = useProductAPI();

  const { data: recommendedProducts } = useQuery<ProductRecommendationType[]>(
    ["products", "recommendations"],
    async () => await productAPI.getRecommendedProducts(productId!)
  );

  return (
    <>
      <div className="relative mx-auto max-w-screen-xl px-4 py-8">
        <Badge className="border-border p-3 text-xl">
          Recommended Products
        </Badge>
        <div className="relative grid grid-cols-5 gap-4 lg:mt-4">
          {recommendedProducts?.map((product: ProductRecommendationType, _) => (
            <ProductCard
              key={product._id}
              to={`../${product._id}`}
              image={<ProductImage imageURL={product.coverImageURL} />}
              info={
                <ProductInfo>
                  <ProductTitle title={product.title} />
                </ProductInfo>
              }
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductRecommendation;
