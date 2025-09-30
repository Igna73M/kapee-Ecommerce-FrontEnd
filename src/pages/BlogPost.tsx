import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import axios from "axios";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
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
      .get(`http://localhost:5000/api_v1/blog-posts/${id}`)
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch blog post");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className='min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center'>
        <div className='text-gray-900 dark:text-yellow-100'>Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className='min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center'>
        <div className='text-red-500'>{error || "Blog post not found"}</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background dark:bg-gray-900'>
      <TopBanner />
      <main className='max-w-3xl mx-auto py-8 px-4'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-4 text-gray-900 dark:text-yellow-100'>
            {post.title}
          </h1>
          <div className='text-sm text-muted-foreground dark:text-yellow-100 mb-2'>
            {post.date}
          </div>
          <div className='mb-6'>
            <img
              src={post.image}
              alt={post.title}
              className='w-full max-h-96 object-cover rounded'
            />
          </div>
          <div className='text-lg text-muted-foreground dark:text-yellow-100 mb-4'>
            <span dangerouslySetInnerHTML={{ __html: post.excerpt }} />
          </div>
          <div
            className='prose dark:prose-invert max-w-none text-gray-900 dark:text-yellow-100'
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default BlogPost;
