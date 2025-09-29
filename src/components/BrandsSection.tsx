import { useEffect, useState } from "react";
import axios from "axios";
import { tailwindBgColorSet } from "@/lib/tailwindcolors";

interface BrandCategory {
  _id: string;
  name: string;
  tagline: string;
  initial?: string;
  bgColor?: string;
}

const BrandsSection = () => {
  const [brandCategories, setBrandCategories] = useState<BrandCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api_v1/brand-categories")
      .then((res) => setBrandCategories(res.data))
      .catch(() => setBrandCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[150px]'>
        <span>Loading brand categories...</span>
      </div>
    );
  }

  return (
    <section className='py-12'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
        {brandCategories.map((category) => {
          // Use only allowed Tailwind classes, fallback to bg-primary
          const bgClass =
            category.bgColor && tailwindBgColorSet.has(category.bgColor)
              ? category.bgColor
              : "bg-primary";
          return (
            <div
              key={category._id}
              className='flex flex-col items-center justify-center p-6 bg-card dark:bg-gray-800 rounded-lg border dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group'
            >
              <div
                className={`w-12 h-12 ${bgClass} text-white rounded-lg flex items-center justify-center text-sm font-bold mb-3 group-hover:scale-105 transition-transform`}
              >
                {category.initial ?? category.name[0]}
              </div>
              <h3 className='font-bold text-xs m-2 text-foreground dark:text-yellow-100 mb-1'>
                {category.name}
              </h3>
              <p className='text-xs text-muted-foreground dark:text-yellow-100 text-center'>
                {category.tagline}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BrandsSection;
