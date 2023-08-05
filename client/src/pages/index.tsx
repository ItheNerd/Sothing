import MainBanner, { MainBannerData } from "@/components/index/mainBanner";
import MainProduct, { Product } from "@/components/index/collection";
import MainLayout from "@/layouts/MainLayout";

const sampleMainBannerData: MainBannerData = {
  smallText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  midText: "Mid Text",
  largeText1: "Large Text",
  product: "sample-product",
  buttonText: "Shop Now",
  desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

const products: Product[] = [
  {
    id: 1,
    name: "Vintage Record Player",
    imageUrl:
      "https://images.unsplash.com/photo-1556767575-5ec41e3239c3?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop&ixid=eyJhcHBfaWQiOjF9",
  },
  {
    id: 2,
    name: "Classic Film Camera",
    imageUrl:
      "https://images.unsplash.com/photo-1501446529957-6226bd447c46?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop&ixid=eyJhcHBfaWQiOjF9",
  },
  {
    id: 3,
    name: "Retro Typewriter",
    imageUrl:
      "https://images.unsplash.com/photo-1520697091141-69f4ad7d62e0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop&ixid=eyJhcHBfaWQiOjF9",
  },
  {
    id: 4,
    name: "Vintage Polaroid Camera",
    imageUrl:
      "https://images.unsplash.com/photo-1518627242446-6d4c0f88a969?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop&ixid=eyJhcHBfaWQiOjF9",
  },
];

const index = () => {
  return (
    <MainLayout>
      <MainBanner mainBanner={sampleMainBannerData} />
      <MainProduct products={products} />
    </MainLayout>
  );
};

export default index;
