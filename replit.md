# ModAPK Hub Application

## Overview

This repository contains a web application called "ModAPK Hub" that allows users to browse, search, download, and upload modified Android APK files. The application features a modern UI with categories, featured apps, trending apps, and detailed app pages.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a client-server architecture with a clear separation between frontend and backend:

1. **Frontend**: React-based single-page application with modern UI components from shadcn/ui
2. **Backend**: Express.js server handling API requests, file uploads, and serving the frontend
3. **Database**: PostgreSQL database accessed through Drizzle ORM
4. **File Storage**: Local file system storage for uploaded APK files and icons

### Key Design Decisions

- **Full-Stack TypeScript**: Using TypeScript throughout the codebase ensures type safety and better developer experience
- **React with React Query**: For state management and data fetching
- **Express.js API**: REST API for all backend operations
- **Drizzle ORM**: For database access with type safety
- **Shadcn/UI Components**: For consistent, accessible UI components
- **Vite**: For fast development and optimized builds
- **File Uploads**: Using multer for handling APK and image file uploads

## Key Components

### Frontend

1. **Pages**:
   - Home: Featured apps and sections for trending and latest apps
   - CategoryPage: Filtered apps by category
   - AppDetails: Detailed view of a specific app
   - SearchResults: Display search results
   - Upload: Form for uploading new APK files

2. **Components**:
   - AppCard: Reusable card component for displaying app information
   - FeaturedApps: Hero section for featured applications
   - SearchBar: For searching apps
   - UploadForm: Form for uploading new APK files
   - UI Components: Various shadcn/ui components (buttons, forms, etc.)

3. **Providers**:
   - ThemeProvider: For light/dark theme management
   - QueryClientProvider: For React Query data fetching

### Backend

1. **API Routes**:
   - `/api/apks`: CRUD operations for APK files
   - `/api/apks/category/:category`: Get APKs by category
   - `/api/apks/trending`: Get trending APKs
   - `/api/apks/latest`: Get latest APKs
   - `/api/apks/search`: Search APKs
   - `/api/apks/featured`: Get featured APKs
   - `/api/apks/:id`: Get APK details

2. **Storage**:
   - In-memory storage implementation (likely for development)
   - File system storage for uploaded files

3. **Authentication**:
   - Basic user authentication (not fully implemented yet)

## Data Flow

1. **App Browsing**:
   - User visits the website
   - Frontend makes API requests to fetch apps data
   - React renders the appropriate components with the fetched data

2. **Searching**:
   - User enters search query
   - Frontend makes API request to `/api/apks/search` endpoint
   - Results are displayed in the SearchResults component

3. **App Upload**:
   - User fills the upload form
   - Form data and files are sent to the server (multipart/form-data)
   - Server validates, processes, and stores the data
   - Server responds with success/error
   - UI updates accordingly

4. **App Download**:
   - User clicks download button on an app
   - Server increments download count
   - File is served to the user for download

## Database Schema

The database uses PostgreSQL with the following schema:

1. **Users Table**:
   - id: Primary key
   - username: Unique username
   - password: Hashed password

2. **APK Files Table**:
   - id: Primary key
   - name: App name
   - description: App description
   - version: App version
   - category: Enum (games, social, entertainment, etc.)
   - size: Size of the APK file
   - fileName: Name of the stored APK file
   - iconPath: Path to the app icon
   - rating: App rating (0-50 scale for half-star precision)
   - downloads: Download count
   - uploadedAt: Timestamp
   - userId: Foreign key to users table
   - isFeatured: Boolean flag for featured apps

3. **APK Features**:
   - Features associated with each APK (no-ads, premium, unlimited-resources, etc.)

## External Dependencies

1. **Frontend**:
   - React & React DOM: UI library
   - wouter: For routing
   - @tanstack/react-query: For data fetching and caching
   - shadcn/ui (via Radix UI): UI component library
   - clsx & tailwind-merge: For CSS class management
   - Tailwind CSS: For styling

2. **Backend**:
   - Express.js: Web server framework
   - Multer: For file uploads
   - Drizzle ORM: Database ORM
   - Zod: For schema validation

## Deployment Strategy

The application is configured for deployment on Replit with:

1. **Development Mode**:
   - `npm run dev` - Starts the server with development settings
   - Uses Vite's dev server for frontend hot reloading

2. **Production Mode**:
   - `npm run build` - Builds the client and server
   - `npm run start` - Starts the production server
   - Server serves static files from the `dist/public` directory

3. **Database**:
   - Assumes PostgreSQL is available (Replit's PostgreSQL module)
   - Database URL is provided via environment variables

4. **File Storage**:
   - Uses local file system for storing uploaded files
   - Creates an 'uploads' directory if it doesn't exist

## Missing Features/Next Steps

1. **Authentication System**:
   - Complete user registration/login flows
   - Session management

2. **Admin Panel**:
   - For managing apps, users, and content

3. **Advanced Search**:
   - Filtering by multiple criteria

4. **Social Features**:
   - Comments, ratings, and reviews

5. **Analytics**:
   - Track downloads, popular categories, etc.