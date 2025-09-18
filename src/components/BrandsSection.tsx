import { brandCategories } from "@/data/brandCategories";

const BrandsSection = () => {
  return (
    <section className='py-12'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
        {brandCategories.map((category, index) => (
          <div
            key={index}
            className='flex flex-col items-center justify-center p-6 bg-card dark:bg-gray-800 rounded-lg border dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group'
          >
            <div
              className={`w-12 h-12 ${category.bgColor} text-white rounded-lg flex items-center justify-center text-xl font-bold mb-3 group-hover:scale-105 transition-transform`}
            >
              {category.initial}
            </div>
            <h3 className='font-bold text-sm text-foreground dark:text-yellow-100 mb-1'>
              {category.name}
            </h3>
            <p className='text-xs text-muted-foreground dark:text-yellow-100 text-center'>
              {category.tagline}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandsSection;
