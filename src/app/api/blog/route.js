import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { NextResponse } from "next/server";

// GET: Fetch all blogs
export async function GET(req) {
    try {
        const blogs = await prisma.blog.findMany();
        return NextResponse.json(blogs, { status: 200 });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json({ error: 'Error fetching blogs' }, { status: 500 });
    }
}

// POST: Create a new blog with an image upload
export async function POST(req) {
    try {
        const data = await req.formData();
        const file = data.get("file"); // image file
        const title = data.get("title");
        const slug = data.get("slug");
        const shortDescription = data.get("shortDescription");
        const content = data.get("content");
        const author = data.get("author");
        const categories = data.get("categories") ? JSON.parse(data.get("categories")) : [];
        const tags = data.get("tags") ? JSON.parse(data.get("tags")) : [];

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Cloudinary image upload
        const buffer = Buffer.from(await file.arrayBuffer());
        const imageResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'nextjs_uploads' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        const newBlog = await prisma.blog.create({
            data: {
                title,
                slug,
                shortDescription,
                content,
                author,
                image: imageResponse.secure_url, // Cloudinary URL
                categories,
                tags,
                readCount: 0,
            },
        });
        return NextResponse.json(newBlog, { status: 201 });
    } catch (error) {
        console.error('Error creating blog post:', error);
        return NextResponse.json({ error: 'Error creating blog post', details: error.message }, { status: 500 });
    }
}

// PUT: Update a blog with an optional image upload
export async function PUT(req) {
    try {
        const data = await req.formData();
        const id = data.get("id");
        const file = data.get("file"); // optional new image file
        const title = data.get("title");
        const shortDescription = data.get("shortDescription");
        const content = data.get("content");
        const author = data.get("author");
        const categories = data.get("categories") ? JSON.parse(data.get("categories")) : [];
        const tags = data.get("tags") ? JSON.parse(data.get("tags")) : [];

        let imageUrl;
        if (file) {
            // Upload new image to Cloudinary
            const buffer = Buffer.from(await file.arrayBuffer());
            const imageResponse = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'nextjs_uploads' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });
            imageUrl = imageResponse.secure_url;
        }

        const updatedBlog = await prisma.blog.update({
            where: { id },
            data: {
                title,
                shortDescription,
                content,
                author,
                image: imageUrl || undefined,
                categories,
                tags,
            },
        });
        return NextResponse.json(updatedBlog, { status: 200 });
    } catch (error) {
        console.error('Error updating blog post:', error);
        return NextResponse.json({ error: 'Error updating blog post', details: error.message }, { status: 500 });
    }
}

// DELETE: Delete a blog post by ID
export async function DELETE(req) {
    try {
        const { id } = await req.json();
        await prisma.blog.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Blog deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json({ error: 'Error deleting blog post' }, { status: 500 });
    }
}

// PATCH: Partially update a blog post
export async function PATCH(req) {
    try {
        const data = await req.formData();
        const id = data.get("id");
        const file = data.get("file"); // optional new image file
        const fields = {};

        ["title", "shortDescription", "content", "author", "categories", "tags"].forEach(field => {
            const value = data.get(field);
            if (value) fields[field] = field === "categories" || field === "tags" ? JSON.parse(value) : value;
        });

        if (file) {
            // Upload new image to Cloudinary
            const buffer = Buffer.from(await file.arrayBuffer());
            const imageResponse = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'nextjs_uploads' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });
            fields.image = imageResponse.secure_url;
        }

        const updatedBlog = await prisma.blog.update({
            where: { id },
            data: fields,
        });
        return NextResponse.json(updatedBlog, { status: 200 });
    } catch (error) {
        console.error('Error partially updating blog post:', error);
        return NextResponse.json({ error: 'Error partially updating blog post', details: error.message }, { status: 500 });
    }
}