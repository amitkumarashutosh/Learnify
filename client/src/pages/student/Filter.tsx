import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { categories } from "@/constants";

interface FilterProps {
  handleFilterChange: (categories: string[], sortByPrice: string) => void;
}

const Filter = ({ handleFilterChange }: FilterProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortByPrice, setSortByPrice] = useState<string>("");

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId];
      handleFilterChange(newCategories, sortByPrice); // Trigger the callback
      return newCategories;
    });
  };

  const selectByPriceHandler = (selectedValue: string) => {
    setSortByPrice(selectedValue);
    handleFilterChange(selectedCategories, selectedValue); // Trigger the callback
  };

  return (
    <div className="w-full md:w-[20%]">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl pr-2">Filter</h1>
        <Select onValueChange={selectByPriceHandler}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by price</SelectLabel>
              <SelectItem value="low">Low to High</SelectItem>
              <SelectItem value="high">High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator className="my-4" />
      <div>
        <h1 className="font-semibold mb-2">CATEGORY</h1>
        {categories.map((category) => (
          <div
            key={category.id} // Add unique key
            className="flex items-center space-x-2 my-2"
          >
            <Checkbox
              id={category.id}
              onCheckedChange={() => handleCategoryChange(category.id)}
            />
            <Label
              htmlFor={category.id} // Link label to the checkbox
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {category.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
