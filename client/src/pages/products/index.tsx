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
import { useQuery } from "@tanstack/react-query";

const index = () => {
  const productAPI = useProductAPI();

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => await productAPI.getProductList(),
  });

  return (
    <MainLayout>
      <ProductCollection>
        {products!.products.map((product) => (
          <ProductCard
            key={product._id}
            to={`./${product._id}`}
            image={<ProductImage imageURL={product.coverImageURL} />}
            info={
              <ProductInfo>
                <ProductCategory category={product.category.title} />
                <ProductTitle title={product.title} />
                <ProductRating />
                <ProductPrice
                  currency={product.variantConfig[0].price.unit}
                  price={product.variantConfig[0].price.amount}
                />
              </ProductInfo>
            }
            action={
              <ProductButton
                variantConfigId={product.variantConfig[0]._id}
                productId={product._id}
              />
            }
          />
        ))}
      </ProductCollection>
    </MainLayout>
  );
};

export default index;
