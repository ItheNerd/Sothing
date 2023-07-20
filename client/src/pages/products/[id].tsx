import ProductDetail from "@/components/products/productLisisting";
import ProductVariantForm from "@/components/products/productVariant";
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
      {/* <ProductDetail product={product!} /> */}
      <ProductVariantForm product={product!} />
    </MainLayout>
  );
};
export default listing;
