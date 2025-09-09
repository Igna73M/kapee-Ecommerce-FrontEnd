import { services } from "@/data/services";

const ServicesSection = () => {
  return (
    <section className='py-12'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
        {services.map((service, index) => (
          <div key={index} className='text-center space-y-4'>
            <div className='flex justify-center'>
              <div className='p-4 rounded-full bg-primary/10'>
                <service.icon className='h-8 w-8 text-primary' />
              </div>
            </div>
            <div className='space-y-2'>
              <h3 className='font-bold text-lg'>{service.title}</h3>
              <p className='text-muted-foreground text-sm'>
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
