import React from "react";
import { Button } from "../ui/button";

export interface Product {
  id: number;
  name: string;
  imageUrl: string;
}

export interface MainProductProps {
  products: Product[];
}

const MainProduct: React.FC<MainProductProps> = () => {
  return (
    <section className="mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <ul className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <header className="mx-auto w-full lg:col-span-3 lg:row-start-1">
          <h2 className="flex justify-center rounded-lg p-2 text-xl sm:text-2xl bg-muted">
            New Collections
          </h2>
        </header>
        <li>
          <a href="#" className="group relative block">
            <img
              src="https://images.unsplash.com/photo-1618898909019-010e4e234c55?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
              alt=""
              className="aspect-square w-full rounded-lg object-cover transition duration-500 group-hover:opacity-90"
            />

            <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
              <h3 className="text-xl font-medium text-white">
                Casual Trainers
              </h3>

              <Button>Shop Now</Button>
            </div>
          </a>
        </li>

        <li>
          <a href="#" className="group relative block">
            <img
              src="https://images.unsplash.com/photo-1624623278313-a930126a11c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
              alt=""
              className="aspect-square w-full rounded-lg object-cover transition duration-500 group-hover:opacity-90"
            />

            <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
              <h3 className="text-xl font-medium text-white">Winter Jumpers</h3>

              <Button>Shop Now</Button>
            </div>
          </a>
        </li>

        <li className="lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-2">
          <a href="#" className="group relative block">
            <img
              src="https://images.unsplash.com/photo-1593795899768-947c4929449d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2672&q=80"
              alt=""
              className="aspect-square w-full rounded-lg object-cover transition duration-500 group-hover:opacity-90"
            />

            <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
              <h3 className="text-xl font-medium text-white">
                Skinny Jeans Blue
              </h3>

              <Button>Shop Now</Button>
            </div>
          </a>
        </li>
      </ul>
    </section>
  );
};

export default MainProduct;
