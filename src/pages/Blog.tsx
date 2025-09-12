import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { blogPosts } from "@/data/blogPosts";

const Blog = () => {
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
            <div
              key={post.id}
              className='card-shadow group cursor-pointer bg-white rounded-lg overflow-hidden border'
            >
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
            </div>
          ))}
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Blog;
