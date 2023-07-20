import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { ReactNode } from "react";

interface MainLayoutInterface {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutInterface) {
  return (
    <>
      <Navbar />
      <div className="relative mx-auto max-w-screen-2xl px-4 py-8 antialiased">
        {children}
      </div>
      <Footer />
    </>
  );
}
