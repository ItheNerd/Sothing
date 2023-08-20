import React from "react";
import { Button } from "../ui/button";
// import Banner from "../ui/banner";

interface MainBannerProps {
  mainBanner: MainBannerData;
}

export interface MainBannerData {
  smallText: string;
  midText: string;
  largeText1: string;
  product: string;
  buttonText: string;
  desc: string;
}

const MainBanner: React.FC<MainBannerProps> = ({ mainBanner }) => {
  return (
    <section className="mx-auto px-4 pt-8 sm:px-6 lg:px-8">
      <div className="relative isolate mx-auto overflow-hidden rounded-lg border-2 bg-opacity-95 px-6 pt-16 sm:px-16 md:pt-24 lg:flex lg:gap-x-40 lg:px-24 lg:pt-0">
        {/* <svg
          viewBox="0 0 1024 1024"
          className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
          aria-hidden="true">
          <circle
            cx="512"
            cy="512"
            r="512"
            fill="url(#gradient)"
            fillOpacity="0.7"></circle>
          <defs>
            <radialGradient id="gradient">
              <stop stopColor="#ffffff"></stop>
              <stop offset="1" stopColor="#ffffff"></stop>
            </radialGradient>
          </defs>
        </svg> */}
        <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {mainBanner.largeText1}
          </h2>
          <p className="mt-6 text-lg leading-8">{mainBanner.smallText}</p>
          <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
            <Button size="lg">{mainBanner.buttonText}</Button>
            <Button
              size="lg"
              variant="secondary"
              className="group relative inline-flex items-center overflow-hidden rounded bg-base-300 px-8 py-3 hover:bg-base-300 focus:outline-none">
              <span className="absolute -end-full transition-all group-hover:end-4">
                <svg
                  className="h-5 w-5 rtl:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>

              <span className="text-base font-medium transition-all group-hover:me-4">
                Know more
              </span>
            </Button>
          </div>
        </div>
        <div className="relative mt-16 h-96 lg:mt-8">
          <img
            className="absolute left-0 top-0 aspect-square w-[40rem] max-w-none rounded-2xl object-cover"
            src="https://images.unsplash.com/photo-1624623278313-a930126a11c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
            alt="App screenshot"
            width="1824"
            height="1080"
          />
        </div>
      </div>
    </section>
  );
};

export default MainBanner;
