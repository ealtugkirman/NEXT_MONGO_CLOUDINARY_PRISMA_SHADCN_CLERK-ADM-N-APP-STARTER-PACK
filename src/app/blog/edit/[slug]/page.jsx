'use client';

import { useEffect, useState } from 'react';
import BlogEdit from '@/components/ui/Blogedit';

export default function EditBlogPage({ params }) {
  const [blogData, setBlogData] = useState(null);
  const [error, setError] = useState(null);
  const { slug } = params;

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`/api/blog/${slug}`);
        if (!response.ok) throw new Error('Blog post not found');
        const data = await response.json();
        setBlogData(data);
      } catch (err) {
        console.error('Failed to fetch blog:', err);
        setError('Failed to fetch blog post.');
      }
    }

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  if (!slug || (!blogData && !error)) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Blog: {blogData.title}</h1>
      <BlogEdit slug={slug} blogData={blogData} />
    </div>
  );
}