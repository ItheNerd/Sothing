import ProductDetail from "@/components/products/productLisisting";
import ProductRecommendation from "@/components/products/productRecommendation";
import MainLayout from "@/layouts/MainLayout";
import useProductAPI from "@/lib/api/productAPI";
import { ProductSchema } from "@/lib/schemas/productSchema";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { z } from "zod";

type ProductType = z.infer<typeof ProductSchema>;

const listing = () => {
  const { id } = useParams();
  const productAPI = useProductAPI();
  const { data: product } = useQuery<ProductType>(
    ["product", id],
    async () => await productAPI.getProductById(id!)
  );

  return (
    <MainLayout>
      <ProductDetail product={product!} />
      <ProductRecommendation productId={id!}/>
    </MainLayout>
  );
};
export default listing;
