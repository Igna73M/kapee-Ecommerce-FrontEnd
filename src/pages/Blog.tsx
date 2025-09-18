import React, { useEffect, useState } from "react";
import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import axios from "axios";
import { Link } from "react-router-dom";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const darkMode = localStorage.getItem("dashboardDarkMode") === "true";
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api_v1/blog-posts")
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch blog posts");
        setLoading(false);
      });
  }, []);

  return (
    <div className='min-h-screen bg-background dark:bg-gray-900'>
      <TopBanner />

      <main className='max-w-7xl mx-auto py-8 px-4'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-4 text-gray-900 dark:text-yellow-100'>
            Electronics Blog
          </h1>
          <p className='text-xl text-muted-foreground dark:text-yellow-100'>
            Stay updated with the latest news, reviews, and trends in
            electronics
          </p>
        </div>

        {loading ? (
          <div className='text-center py-8 text-gray-900 dark:text-yellow-100'>
            Loading...
          </div>
        ) : error ? (
          <div className='text-center py-8 text-red-500'>{error}</div>
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {posts.map((post) => (
              <Link
                key={post._id}
                to={`/blog/${post._id}`}
                className='card-shadow group cursor-pointer bg-white dark:bg-gray-800 rounded-lg overflow-hidden border dark:border-gray-700 block'
              >
                <div className='aspect-video overflow-hidden'>
                  <img
                    src={post.image}
                    alt={post.title}
                    className='w-full h-full object-cover group-hover:scale-105 smooth-transition'
                  />
                </div>
                <div className='p-6'>
                  <div className='text-sm text-muted-foreground dark:text-yellow-100 mb-2'>
                    {post.date}
                  </div>
                  <h3 className='text-xl font-bold mb-3 text-gray-900 dark:text-yellow-100'>
                    {post.title}
                  </h3>
                  <p className='text-muted-foreground dark:text-yellow-100'>
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Blog;
