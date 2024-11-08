"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Plus, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import "react-quill-new/dist/quill.snow.css";

// Wrapper component for React Quill
const QuillWrapper = dynamic(() => import("react-quill-new"), { ssr: false });

export default function AdvancedAdminBlogEntry() {
  const [blogPost, setBlogPost] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    content: "",
    author: "",
    image: null, // Store as a file, not a URL
    categories: [],
    tags: [],
  });
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      // Access the Quill instance if needed
    }
  }, [quillRef]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setBlogPost((prev) => ({ ...prev, content }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogPost((prev) => ({ ...prev, image: file }));
    }
  };

  const addCategory = () => {
    if (newCategory && !blogPost.categories.includes(newCategory)) {
      setBlogPost((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }));
      setNewCategory("");
    }
  };

  const removeCategory = (category) => {
    setBlogPost((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  };

  const addTag = () => {
    if (newTag && !blogPost.tags.includes(newTag)) {
      setBlogPost((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      setNewTag("");
    }
  };

  const removeTag = (tag) => {
    setBlogPost((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!blogPost.title || !blogPost.content || !blogPost.author) {
      setError("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", blogPost.title);
    formData.append("slug", blogPost.slug);
    formData.append("shortDescription", blogPost.shortDescription);
    formData.append("content", blogPost.content);
    formData.append("author", blogPost.author);
    if (blogPost.image) {
      formData.append("file", blogPost.image); // Add the image file
    }
    formData.append("categories", JSON.stringify(blogPost.categories));
    formData.append("tags", JSON.stringify(blogPost.tags));

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create blog post");
      console.log("Blog post submitted:", blogPost);
      // Clear form or display success message
    } catch (error) {
      setError("Failed to create blog post. Please try again.");
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="py-24" >
         <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>Create Blog Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title*</Label>
            <Input
              id="title"
              name="title"
              value={blogPost.title}
              onChange={handleInputChange}
              placeholder="Enter blog title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={blogPost.slug}
              onChange={handleInputChange}
              placeholder="enter-blog-slug"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              name="shortDescription"
              value={blogPost.shortDescription}
              onChange={handleInputChange}
              placeholder="Enter a short description"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content*</Label>
            <QuillWrapper
              ref={quillRef}
              value={blogPost.content}
              onChange={handleContentChange}
              modules={modules}
              theme="snow"
              className="h-64 mb-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author*</Label>
            <Input
              id="author"
              name="author"
              value={blogPost.author}
              onChange={handleInputChange}
              placeholder="Enter author name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
            />
            {blogPost.image && <p>Image selected: {blogPost.image.name}</p>}
          </div>
          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2">
              {blogPost.categories.map((category, index) => (
                <span
                  key={index}
                  className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center">
                  {category}
                  <button
                    type="button"
                    onClick={() => removeCategory(category)}
                    className="ml-2">
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add a category"
              />
              <Button type="button" onClick={addCategory} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {blogPost.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm flex items-center">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2">
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" onClick={handleSubmit} className="w-full">
          Save Blog Entry
        </Button>
      </CardFooter>
    </Card>
 </div>
  );
}
