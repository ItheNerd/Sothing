import { ProductSchema } from "@/lib/schemas/productSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import _ from "lodash";
``
type ProductType = z.infer<typeof ProductSchema>;

const ProductVariantForm: React.FC<{ product: ProductType }> = ({
  product,
}) => {
  const { variantTable, variantConfig } = product;
  const form = useForm<ProductType>();
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});

  let isOptionDisabled = useCallback(
    (variantType: string, variantValue: string) => {
      if (selectedVariants[variantType] === undefined) return false;

      const availableOptions = getVariantOptionsAvailable();
      //   console.log("hello", availableOptions);

      return availableOptions.map(
        (option) =>
          (option.VariantType === variantType &&
            option.VariantValue.includes(variantValue)) ||
          console.log("somehting", option.VariantValue)
      );
    },
    [selectedVariants]
  );

  const handleVariantChange = (variantType: string, variantValue: string) => {
    // Update the selected variant
    setSelectedVariants({
      ...selectedVariants,
      [variantType]: variantValue,
    });
  };

  const getVariantOptionsAvailable = useCallback(() => {
    console.log(selectedVariants);
    // Get the selected variant type and value
    const selectedVariantType =
      Object.keys(selectedVariants)[Object.keys(selectedVariants).length - 1];
    const selectedVariantValue = selectedVariants[selectedVariantType];

    // Filter the variantConfig array to find all configurations that have the selected variant value
    const variantConfigWithSelectedValue = variantConfig.filter((config) =>
      config.variantCombination.some(
        (combination) =>
          combination.variantType === selectedVariantType &&
          combination.variantValue === selectedVariantValue
      )
    );

    // Get the available options for other variant types
    const availableOptions = variantTable
      .filter((variant) => variant.variantType !== selectedVariantType)
      .map((variant) => {
        const availableValues = variantConfigWithSelectedValue
          .filter((config) =>
            config.variantCombination.some(
              (combination) =>
                combination.variantType === variant.variantType &&
                combination.variantValue !== selectedVariantValue
            )
          )
          .map((config) =>
            config.variantCombination.find(
              (c) => c.variantType === variant.variantType
            )
          )
          .filter(Boolean)
          .map((combination) => combination!.variantValue);

        return {
          VariantType: variant.variantType,
          VariantValue: availableValues,
        };
      });
    console.log(availableOptions);

    return availableOptions;
  }, [selectedVariants]);

  const onSubmit = () => {
    // Get the selected variant from the state
    const selectedVariant = Object.entries(selectedVariants).map(
      ([VariantType, VariantValue]) => ({
        VariantType,
        VariantValue,
      })
    );

    // Get the available variant options
    const VariantOptionsAvailable = getVariantOptionsAvailable();

    // Output the data in the desired format
    const outputData = {
      SelectedVariant: selectedVariant,
      VariantOptionsAvailable,
    };

    console.log(outputData); // Output the data to the console (you can do other logic here as needed)
  };

  const findVariantConfigForSelectedVariant = () => {
    const selectedVariantEntries = Object.entries(selectedVariants);
    const selectedCombination = selectedVariantEntries.map(
      ([VariantType, VariantValue]) => ({
        variantType: VariantType,
        variantValue: VariantValue,
      })
    );

    const matchingVariantConfig = variantConfig.find((config) => {
      const configCombination = config.variantCombination.map(
        (combination) => ({
          variantType: combination.variantType,
          variantValue: combination.variantValue,
        })
      );

      return _.isEqual(selectedCombination, configCombination);
    });

    return matchingVariantConfig;
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-wrap items-center">
      <div className=" mr-20 flex flex-col">
        {variantTable.map((variant) => (
          <fieldset key={variant.variantType} className="mt-4">
            <legend className="mb-1 text-sm font-medium">
              {variant.variantType}
            </legend>
            <div className="flex flex-wrap gap-1">
              {variant.variantValues.map((value) => (
                <label key={value} className="cursor-pointer">
                  <input
                    type="radio"
                    name={variant.variantType}
                    className="peer sr-only"
                    checked={selectedVariants[variant.variantType] === value}
                    onChange={() =>
                      handleVariantChange(variant.variantType, value)
                    }
                    disabled={isOptionDisabled(variant.variantType, value)}
                  />
                  <Badge
                    className={`m-1 h-8 ${
                      selectedVariants[variant.variantType] === value
                        ? "bg-black text-white"
                        : "bg-gray-200 text-black"
                    }`}>
                    {value + ` ` + variant.variantType}
                  </Badge>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <div className="mt-8 flex gap-2">
          <Button type="submit">Submit</Button>
          <Button
            onClick={() => {
              setSelectedVariants({});
            }}
            variant="destructive">
            Clear Form
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap justify-between">
        <div>
          <h2>Output Data:</h2>
          <pre>
            {JSON.stringify(
              {
                SelectedVariant: Object.entries(selectedVariants).map(
                  ([VariantType, VariantValue]) => ({
                    VariantType,
                    VariantValue,
                  })
                ),
                VariantOptionsAvailable: getVariantOptionsAvailable(),
              },
              null,
              2
            )}
          </pre>
        </div>
        <div>
          <h2>Variant Table:</h2>
          <pre>
            {JSON.stringify(
              {
                variantTable: Object.entries(variantTable).map(
                  ([_, VariantValue]) => VariantValue
                ),
              },
              null,
              2
            )}
          </pre>
        </div>
        <div>
          <h2>Variant Config:</h2>
          <pre>
            {JSON.stringify(
              {
                variantConfig: Object.entries(variantConfig).map(
                  ([_, VariantValue]) => VariantValue.variantCombination
                ),
              },
              null,
              2
            )}
          </pre>
        </div>
        {/* Display the selected variant configuration */}
        {Object.keys(selectedVariants).length > 0 && (
          <div>
            <h2>Selected Variant Configuration:</h2>
            <pre>
              {JSON.stringify(
                {
                  variantCombination:
                    findVariantConfigForSelectedVariant()?.variantCombination,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </form>
  );
};

export default ProductVariantForm;
