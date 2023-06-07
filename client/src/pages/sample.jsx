import BrowseStore from "@/components/BrowseStore";
import CartOverlay from "@/components/CartOverlay";
import CategoryPreview from "@/components/CategoryPreview";
import Header from "@/components/Header";
import PlatformFeatures from "@/components/PlatformFeatures";
import Product from "@/components/Product";
import MainLayout from "@/layouts/MainLayout";

export default function Sample() {
  return (
    <MainLayout>
      <Header />
      <PlatformFeatures/>
      <CategoryPreview />
      <Product />
      <BrowseStore />
      <CartOverlay />
    </MainLayout>
  );
}
