import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
// import Banner from "@/components/ui/banner";
import { ReactNode } from "react";

interface MainLayoutInterface {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutInterface) {
  return (
    <>
      {/* <Banner /> */}
      <Navbar />
      <div className="relative mx-auto max-w-screen-xl px-4 py-8 antialiased">
        {children}
      </div>
      <Footer />
    </>
  );
}
