import { useState } from "react";
import React from "react";
import { SortCollapsible } from "./sortComposable";
import Header from "../header";

// Filter options
const availabilityOptions = {
  title: "Availability",
  options: ["In Stock", "Pre Order", "Out of Stock"],
};

const colorOptions = {
  title: "Colors",
  options: ["Red", "Blue", "Green", "Orange", "Purple", "Teal"],
};

interface FilterProps {
  title: string;
  options: string[];
}

const Filter: React.FC<FilterProps> = ({ title, options }) => {
  return (
    <details className="overflow-hidden rounded-md border text-sm [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
        <span className="text-sm font-medium">{title}</span>

        <span className="transition group-open:-rotate-180">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-4 w-4">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </span>
      </summary>

      <div className="border-t border-gray-200 bg-white">
        <header className="flex items-center justify-between p-4">
          <span className="text-sm text-gray-700">0 Selected</span>

          <button
            type="button"
            className="text-sm text-gray-900 underline underline-offset-4">
            Reset
          </button>
        </header>

        <ul className="space-y-1 border-t border-gray-200 p-4">
          {options.map((value) => (
            <li key={value}>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`Filter${value}`}
                  className="h-5 w-5 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  {value}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
};

interface PriceOptions {
  label: string;
  minPrice: number;
  maxPrice: number;
}

interface PriceFilterProps {
  options: PriceOptions;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <details
      className={`overflow-hidden rounded-md border text-sm ${
        isOpen ? "group-open" : ""
      }`}>
      <summary
        className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition"
        onClick={handleToggle}>
        <span className="text-sm font-medium">{options.label}</span>
        <span
          className={`transition ${isOpen ? "group-open:-rotate-180" : ""}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-4 w-4">
            <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </summary>

      <div className="border-t border-gray-200 bg-white">
        <header className="flex items-center justify-between p-4">
          <span className="text-sm text-gray-700">
            The highest price is ${options.maxPrice}
          </span>
          <button
            type="button"
            className="text-sm text-gray-900 underline underline-offset-4">
            Reset
          </button>
        </header>

        <div className="border-t border-gray-200 p-4">
          <div className="flex justify-between gap-4">
            <label className="flex items-center gap-2">
              <span className="text-sm text-gray-600">$</span>
              <input
                type="number"
                id="FilterPriceFrom"
                placeholder="From"
                className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-sm text-gray-600">$</span>
              <input
                type="number"
                id="FilterPriceTo"
                placeholder="To"
                className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
              />
            </label>
          </div>
        </div>
      </div>
    </details>
  );
};

type ProductCollectionProps = {
  children: React.ReactNode;
};

export const ProductCollection: React.FC<ProductCollectionProps> = ({
  children,
}) => {
  const priceOptions: PriceOptions = {
    label: "Price",
    minPrice: 0,
    maxPrice: 600,
  };

  return (
    <section>
      <Header
        title="Product Collection"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. dolor sit amet, consectetur adipiscing elit dolor sit amet, consectetur adipiscing elit"
      />
      <div className="mt-4 lg:mt-8 lg:grid lg:grid-cols-5 lg:items-start lg:gap-8">
        <div className="block space-y-4">
          <SortCollapsible />

          <div>
            <p className="block text-xs font-medium text-gray-700">Filters</p>

            <div className="mt-1 space-y-2">
              <Filter
                options={availabilityOptions.options}
                title={availabilityOptions.title}
              />
              <Filter
                options={colorOptions.options}
                title={colorOptions.title}
              />
              <PriceFilter options={priceOptions} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <ul className="grid gap-4 py-4 sm:grid-cols-2 lg:grid-cols-3">
            {children}
          </ul>
        </div>
      </div>
    </section>
  );
};
