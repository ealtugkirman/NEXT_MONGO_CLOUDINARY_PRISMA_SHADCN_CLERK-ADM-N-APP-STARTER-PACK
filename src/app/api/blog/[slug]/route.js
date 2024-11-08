import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

// GET: Fetch blog details by slug
export async function GET(req, { params }) {
    const { slug } = params;
    try {
        const blog = await prisma.blog.findUnique({
            where: { slug },
        });
        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }
        return NextResponse.json(blog, { status: 200 });
    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json({ error: 'Error fetching blog' }, { status: 500 });
    }
}

// PUT: Update blog details by slug
export async function PUT(req, { params }) {
    const { slug } = params;
    try {
        const data = await req.formData();
        const title = data.get("title");
        const shortDescription = data.get("shortDescription");
        const content = data.get("content");
        const author = data.get("author");
        const categories = data.get("categories") ? JSON.parse(data.get("categories")) : [];
        const tags = data.get("tags") ? JSON.parse(data.get("tags")) : [];
        const file = data.get("file"); // optional new image file

        // Blog kaydının varlığını kontrol edin
        const existingBlog = await prisma.blog.findUnique({ where: { slug } });
        if (!existingBlog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        // Cloudinary'e yeni resmi yükleyin (eğer varsa)
        let imageUrl = existingBlog.image;
        if (file) {
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

        // Blog kaydını güncelleyin
        const updatedBlog = await prisma.blog.update({
            where: { slug },
            data: {
                title,
                shortDescription,
                content,
                author,
                image: imageUrl,
                categories,
                tags,
            },
        });
        return NextResponse.json(updatedBlog, { status: 200 });
    } catch (error) {
        console.error('Error updating blog:', error);
        return NextResponse.json({ error: 'Error updating blog', details: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { slug } = params;
    try {
        const deletedBlog = await prisma.blog.delete({
            where: { slug },
        });
        return NextResponse.json({ message: 'Blog post deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
    }
}