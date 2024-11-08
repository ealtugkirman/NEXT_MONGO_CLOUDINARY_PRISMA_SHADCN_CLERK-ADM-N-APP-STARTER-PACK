
# NEXT_MONGO_CLOUDINARY_PRISMA_SHADCN_CLERK Starter Pack

This project is a Next.js starter pack that integrates MongoDB, Cloudinary, Prisma, ShadCN, and Clerk for authentication. Follow the setup instructions below to configure your `.env` file and initialize the project.

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (recommended version: 14+)
- **MongoDB**: Have a MongoDB database (MongoDB Atlas is recommended for cloud databases)
- **Cloudinary**: Set up a Cloudinary account for image storage
- **Clerk**: Register for a Clerk account for user authentication
- **Prisma**: Prisma setup for database ORM

### Installation

1. Clone this repository.

2. Install dependencies.

### Environment Variables

Create a .env.local file in the root directory to store environment variables. Below is a list of essential variables for the starter pack:

```plaintext
# MongoDB configuration
DATABASE_URL="your-mongodb-connection-string"

# Cloudinary configuration
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Clerk configuration
NEXT_PUBLIC_CLERK_FRONTEND_API="your-clerk-frontend-api"
CLERK_API_KEY="your-clerk-api-key"
CLERK_JWT_KEY="your-clerk-jwt-key"
```

### Setting Up Clerk

1. Sign up at [Clerk.dev](https://clerk.dev).
2. Create a new Clerk application.
3. Copy the **Frontend API**, **API Key**, and **JWT Key** from the Clerk dashboard.
4. Paste these values into your `.env.local` file as shown above.

### Prisma Setup

After configuring the `DATABASE_URL` in `.env.local`:

1. Initialize Prisma.

   npx prisma init
2. Generate the Prisma client.
   npx prisma generate

### Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com).
2. From your Cloudinary dashboard, get your **Cloud Name**, **API Key**, and **API Secret**.
3. Add these values to your `.env.local` file.

### Usage

1. Start the development server.
   npm run dev
2. Open your browser at [http://localhost:3000](http://localhost:3000) to view the project.

---

## Features

- **Authentication** with Clerk
- **Database** management with MongoDB and Prisma
- **Image storage** with Cloudinary
- **UI Components** using ShadCN

---

This setup is now ready for development!
