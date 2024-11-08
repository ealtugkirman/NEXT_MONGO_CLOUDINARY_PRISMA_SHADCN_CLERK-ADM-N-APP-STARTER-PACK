"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  UserIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";

// BlogPostCard component
const BlogPostCard = ({ post, onEdit, onDelete }) => (
  <Card className="flex flex-col h-full">
    <CardHeader className="p-0">
      <div className="relative w-full pt-[56.25%]">
        <Image
          src={post.image}
          alt={post.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
    </CardHeader>
    <CardContent className="flex-grow p-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {post.categories.map((category, index) => (
          <Badge key={index} variant="secondary">
            {category}
          </Badge>
        ))}
      </div>
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="text-muted-foreground mb-4">{post.shortDescription}</p>
      <div className="flex items-center text-sm text-muted-foreground mb-2">
        <UserIcon className="w-4 h-4 mr-1" />
        <span>{post.author}</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground mb-2">
        <CalendarIcon className="w-4 h-4 mr-1" />
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <EyeIcon className="w-4 h-4 mr-1" />
        <span>{post.readCount} reads</span>
      </div>
    </CardContent>
    <CardFooter className="p-4 pt-0 flex justify-between">
      <Button
        variant="outline"
        className="flex-1 mr-2"
        onClick={() => onEdit(post.slug)}>
        <EditIcon className="w-4 h-4 mr-2" />
        Edit
      </Button>
      <Button
        variant="destructive"
        className="flex-1"
        onClick={() => onDelete(post.slug)}>
        <TrashIcon className="w-4 h-4 mr-2" />
        Delete
      </Button>
    </CardFooter>
  </Card>
);

// Main component
const AdminBlogPostCards = () => {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch blog posts from the API
  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const response = await fetch("/api/blog");
        if (!response.ok) throw new Error("Failed to fetch blog posts");
        const data = await response.json();
        setBlogPosts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  const handleEdit = (slug) => {
    router.push(`/blog/edit/${slug}`);
  };

  const handleDelete = async (slug) => {
    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete blog post");
      setBlogPosts(blogPosts.filter((post) => post.slug !== slug));
    } catch (err) {
      console.error(err);
      setError("Failed to delete blog post");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className=" justify-center flex flex-col" >
        <h1 className="text-4xl font-bold mb-8 text-center">
          Admin Blog Posts
        </h1>
        <Link
          href="/blog/new"
          className="text-2xl px-4 py-2 bg-black text-white border-2 mb-8 text-center">
          Add New
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <BlogPostCard
            key={post.id}
            post={post}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminBlogPostCards;
