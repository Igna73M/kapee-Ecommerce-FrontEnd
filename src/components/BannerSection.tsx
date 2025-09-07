import { Button } from '@/components/ui/button';
import wirelessSpeaker from '@/assets/wireless-speaker.png';
import watchCharger from '@/assets/watch-charger.png';

const banners = [
  {
    id: 1,
    title: "DIGITAL SMART",
    subtitle: "WIRELESS SPEAKER",
    discount: "MIN. 30-75% OFF",
    image: wirelessSpeaker,
    buttonText: "SHOP NOW"
  },
  {
    id: 2,
    title: "DIGITAL SMART",
    subtitle: "WATCH CHARGER",
    discount: "UP TO 75% OFF",
    image: watchCharger,
    buttonText: "SHOP NOW"
  }
];

const BannerSection = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className="relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg overflow-hidden group cursor-pointer card-shadow"
        >
          <div className="flex items-center p-6 md:p-8 min-h-[250px]">
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="text-primary text-xs font-semibold tracking-wider">
                  {banner.title}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                  {banner.subtitle}
                </h3>
                <div className="text-sm text-muted-foreground">
                  {banner.discount}
                </div>
              </div>
              
              <Button variant="shop" size="sm">
                {banner.buttonText}
              </Button>
            </div>

            <div className="flex-1">
              <img
                src={banner.image}
                alt={banner.subtitle}
                className="w-full h-auto max-w-[200px] mx-auto group-hover:scale-105 smooth-transition drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BannerSection;