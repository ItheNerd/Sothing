import {
  ProductButton,
  ProductCard,
  ProductCategory,
  ProductImage,
  ProductInfo,
  ProductPrice,
  ProductRating,
  ProductTitle,
} from "@/components/products/productCard";
import { ProductCollection } from "@/components/products/productCollection";
import MainLayout from "@/layouts/MainLayout";
import useProductAPI from "@/lib/api/productAPI";
import {
  GetProductListSchema,
  ProductSchema,
} from "@/lib/schemas/productSchema";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { z } from "zod";

type ProductType = z.infer<typeof ProductSchema>;

const index = () => {
  const productAPI = useProductAPI();

  const fetchProducts = async () => {
    try {
      console.log("fetch products");
      const productList = await productAPI.getProductList();
      const parsedProducts = GetProductListSchema.parse(
        productList
      ).products.map((product: ProductType) => ProductSchema.parse(product));
      return parsedProducts;
    } catch (error) {
      console.log("Failed to fetch product list", error);
    }
  };

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const ref = useRef(null);

  return (
    <MainLayout>
      <ProductCollection>
        {products!.map((product) => (
          <ProductCard
            ref={ref}
            key={product._id}
            to={`./${product._id}`}
            image={<ProductImage imageURL={product.coverImageURL} />}
            info={
              <ProductInfo>
                <ProductCategory category={product.category.title} />
                <ProductTitle title={product.title} />
                <ProductRating />
                <ProductPrice currency="INR" price={product.price} />
              </ProductInfo>
            }
            action={<ProductButton />}
          />
        ))}
      </ProductCollection>
    </MainLayout>
  );
};

export default index;
