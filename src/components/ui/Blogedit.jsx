'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import 'react-quill-new/dist/quill.snow.css';

const QuillWrapper = dynamic(() => import('react-quill-new'), { ssr: false });

export default function BlogEdit({ slug, blogData }) {
  const [blogPost, setBlogPost] = useState({
    title: blogData.title || '',
    slug: blogData.slug || '',
    shortDescription: blogData.shortDescription || '',
    content: blogData.content || '',
    author: blogData.author || '',
    image: null,
    currentImageUrl: blogData.image || '',
    categories: blogData.categories || [],
    tags: blogData.tags || []
  });
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const quillRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogPost(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setBlogPost(prev => ({ ...prev, content }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogPost(prev => ({ ...prev, image: file }));
    }
  };

  const addCategory = () => {
    if (newCategory && !blogPost.categories.includes(newCategory)) {
      setBlogPost(prev => ({ ...prev, categories: [...prev.categories, newCategory] }));
      setNewCategory('');
    }
  };

  const removeCategory = (category) => {
    setBlogPost(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }));
  };

  const addTag = () => {
    if (newTag && !blogPost.tags.includes(newTag)) {
      setBlogPost(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setBlogPost(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!blogPost.title || !blogPost.content || !blogPost.author) {
      setError('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append("title", blogPost.title);
    formData.append("slug", blogPost.slug);
    formData.append("shortDescription", blogPost.shortDescription);
    formData.append("content", blogPost.content);
    formData.append("author", blogPost.author);
    if (blogPost.image) {
      formData.append("file", blogPost.image);
    }
    formData.append("categories", JSON.stringify(blogPost.categories));
    formData.append("tags", JSON.stringify(blogPost.tags));

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update blog post');
      setSuccess('Blog post updated successfully!');
      const data = await response.json();
      setBlogPost(prev => ({ ...prev, currentImageUrl: data.image }));
    } catch (error) {
      console.error('Error updating blog post:', error);
      setError('Failed to update blog post. Please try again.');
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Blog Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Title*" id="title" name="title" value={blogPost.title} onChange={handleInputChange} placeholder="Enter blog title" required />
          <InputField label="Slug" id="slug" name="slug" value={blogPost.slug} onChange={handleInputChange} placeholder="enter-blog-slug" />
          <TextareaField label="Short Description" id="shortDescription" name="shortDescription" value={blogPost.shortDescription} onChange={handleInputChange} placeholder="Enter a short description" />
          <QuillWrapper ref={quillRef} value={blogPost.content} onChange={handleContentChange} modules={modules} theme="snow" />
          <ImageUploadField label="Image" onChange={handleImageUpload} imageUrl={blogPost.currentImageUrl} />
          <Label categories={blogPost.categories} tags={blogPost.tags} addCategory={addCategory} removeCategory={removeCategory} addTag={addTag} removeTag={removeTag} />
        </form>
      </CardContent>
      <CardFooter>
        {error && <div error={error} />}
        {success && <div success={success} />}
        <Button type="submit" onClick={handleSubmit}>Update Blog Entry</Button>
      </CardFooter>
    </Card>
  );
}

function InputField({ label, ...props }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input {...props} />
    </div>
  );
}
function TextareaField({ label, ...props }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea {...props} />
    </div>
  );
}
function ImageUploadField({ label, onChange, imageUrl }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type="file" onChange={onChange} />
      {imageUrl && <img src={imageUrl} alt="Current image" />}
    </div>
  );
}