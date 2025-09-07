import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Card, CardContent } from "@/components/ui/card";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Latest Electronics Trends 2024",
      excerpt:
        "Discover the most innovative electronics that are changing the world this year.",
      date: "March 15, 2024",
      image:
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Wireless Technology Revolution",
      excerpt:
        "How wireless charging and connectivity are reshaping our daily lives.",
      date: "March 10, 2024",
      image:
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Smart Home Electronics Guide",
      excerpt:
        "Complete guide to setting up your smart home with the latest devices.",
      date: "March 5, 2024",
      image:
        "https://images.unsplash.com/photo-1681263832106-40723a86886d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c21hcnQlMjBIb21lJTIwRWxlY3Ryb25pY3MlMjBHdWlkfGVufDB8fDB8fHww",
    },
  ];

  return (
    <div className='min-h-screen bg-background'>
      <TopBanner />

      <main className='max-w-7xl mx-auto py-8 px-4'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-4'>Electronics Blog</h1>
          <p className='text-xl text-muted-foreground'>
            Stay updated with the latest news, reviews, and trends in
            electronics
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {blogPosts.map((post) => (
            <Card key={post.id} className='card-shadow group cursor-pointer'>
              <CardContent className='p-0'>
                <div className='aspect-video overflow-hidden'>
                  <img
                    src={post.image}
                    alt={post.title}
                    className='w-full h-full object-cover group-hover:scale-105 smooth-transition'
                  />
                </div>
                <div className='p-6'>
                  <div className='text-sm text-muted-foreground mb-2'>
                    {post.date}
                  </div>
                  <h3 className='text-xl font-bold mb-3'>{post.title}</h3>
                  <p className='text-muted-foreground'>{post.excerpt}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Blog;
