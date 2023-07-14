import ProductDetail from "@/components/products/productLisisting";
import MainLayout from "@/layouts/MainLayout";
import useProductAPI from "@/lib/api/productAPI";
import { ProductSchema } from "@/lib/schemas/productSchema";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { z } from "zod";

// const product = {
//   name: "Example Product",
//   rating: 4.5,
//   price: "$19.99",
//   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//   image:
//     "https://images.unsplash.com/photo-1618898909019-010e4e234c55?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
//   colors: ["Red", "Green", "Blue"],
//   sizes: ["Small", "Medium", "Large"],
// };

type ProductType = z.infer<typeof ProductSchema>;

const listing = () => {
  const { id } = useParams();
  const productAPI = useProductAPI();
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<ProductType>(["product", id], () =>
    productAPI.getProductById(id!)
  );

  if (isLoading) {
    return <div>Loading Page...</div>;
  }

  if (error) {
    throw error;
  }

  return (
    <MainLayout>
      <ProductDetail product={product!} />
    </MainLayout>
  );
};

export default listing;
