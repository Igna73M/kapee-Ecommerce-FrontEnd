import { useEffect, useState } from "react";
import axios from "axios";
import * as LucideIcons from "lucide-react";

interface Service {
  _id: string;
  title: string;
  description: string;
  icon?: string; // Lucide icon name or URL
}

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://kapee-ecommerce-backend.onrender.com/api_v1/services`)
      .then((res) => setServices(res.data))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  // Helper: render Lucide icon by name, fallback to image or text
  const renderIcon = (icon?: string, title?: string) => {
    if (!icon) {
      return (
        <span className='h-8 w-8 text-primary dark:text-yellow-400 text-2xl font-bold flex items-center justify-center'>
          S
        </span>
      );
    }
    const LucideIcon = LucideIcons[icon];
    if (LucideIcon) {
      return (
        <LucideIcon
          className='h-8 w-8 text-primary dark:text-yellow-400'
          aria-label={icon}
        />
      );
    }
    if (icon.startsWith("http") || icon.startsWith("/")) {
      return (
        <img
          src={icon}
          alt={title || "icon"}
          className='h-8 w-8 object-contain'
        />
      );
    }
    // fallback: show icon string
    return (
      <span className='h-8 w-8 text-primary dark:text-yellow-400 text-2xl font-bold flex items-center justify-center'>
        {icon}
      </span>
    );
  };

  if (loading) {
    return (
      <section className='py-12'>
        <div className='flex items-center justify-center min-h-[100px]'>
          <span>Loading services...</span>
        </div>
      </section>
    );
  }

  return (
    <section className='py-12'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
        {services.map((service) => (
          <div key={service._id} className='text-center space-y-4'>
            <div className='flex justify-center'>
              <div className='p-4 rounded-full bg-primary/10 dark:bg-yellow-500/10'>
                {renderIcon(service.icon, service.title)}
              </div>
            </div>
            <div className='space-y-2'>
              <h3 className='font-bold text-lg text-gray-900 dark:text-yellow-100'>
                {service.title}
              </h3>
              <p className='text-muted-foreground dark:text-yellow-100 text-sm'>
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
