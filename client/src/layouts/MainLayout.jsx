import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function MainLayout({ children }) {
  return (<><Navbar/><div className="mx-auto max-w-screen-2xl px-10">{children}</div><Footer/></>);
}
