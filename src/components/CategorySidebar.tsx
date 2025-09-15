import { ChevronRight } from "lucide-react";
import { useState } from "react";

// Import categorized data
import { mensClothingList } from "@/data/categorizedData";
import { womensClothingList } from "@/data/categorizedData";
import { accessoriesList } from "@/data/categorizedData";
import { shoesList } from "@/data/categorizedData";
import { jewelleryList } from "@/data/categorizedData";
import { bagsList } from "@/data/categorizedData";
import { watchesList } from "@/data/categorizedData";
import { Category } from "@/types/product";
import { categories } from "@/data/products";

interface CategorySidebarProps {
  open: boolean;
  onClose: () => void;
}

const categoryMenuMap: Record<string, { id: number; name: string }[]> = {
  "Men's Clothing": mensClothingList,
  "Women's Clothing": womensClothingList,
  Accessories: accessoriesList,
  Shoes: shoesList,
  Jewellery: jewelleryList,
  "Bags & Backpacks": bagsList,
  Watches: watchesList,
};

const CategorySidebar = ({ open, onClose }: CategorySidebarProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className='bg-white rounded-lg  shadow-sm border top-12 -left-1 z-50 w-60 h-fit absolute'>
      <div className='bg-white relative'>
        {categories.map((category) => (
          <div
            key={category.id}
            className='flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer group relative'
            onMouseEnter={() => setHoveredCategory(category.name)}
            onMouseLeave={() =>
              setHoveredCategory((prev) =>
                prev === category.name ? null : prev
              )
            }
          >
            <span className='text-sm text-gray-700 group-hover:text-primary'>
              {category.name}
            </span>
            <ChevronRight className='h-4 w-4 text-gray-400 group-hover:text-primary' />
            {hoveredCategory === category.name &&
              categoryMenuMap[category.name] && (
                <ul className='absolute left-full ml-2 border  min-w-[150px] bg-white shadow-lg rounded-lg py-2 px-3 text-black  z-50 right-0 top-0 flex flex-col'>
                  {categoryMenuMap[category.name].map((item) => (
                    <li
                      key={item.id}
                      className='px-4 py-2 hover:bg-primary/10 cursor-pointer text-sm text-gray-700 rounded transition-colors duration-150 text-left'
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;
