# Admin Panel Documentation

## Overview

The admin panel provides a comprehensive interface for managing portfolio content including projects, skills, and site configuration. It features secure authentication, file uploads, and real-time content management.

## Features

### Authentication
- **Login**: `/admin/login`
- **Default Credentials**: 
  - Email: `admin@asadul.dev`
  - Password: `admin123`
- **Security**: JWT tokens with HttpOnly cookies
- **Protection**: Middleware protects all admin routes

### Project Management
- **CRUD Operations**: Create, read, update, delete projects
- **Fields**: Title, year, summary, tags, category, cover image, content, notes
- **Media Upload**: 
  - **Photos**: Multiple image uploads with reordering (left/right arrows)
  - **PDFs**: Document uploads with inline viewing and download
- **Captions**: Fixed-height, scrollable caption boxes for images
- **Featured Projects**: Toggle to highlight important projects

### Skills Management
- **Categories**: Organize skills into categories (Cybersecurity, Frontend, Backend, etc.)
- **Dynamic Skills**: Add/remove individual skills within categories
- **Real-time Updates**: Changes persist immediately

### Site Configuration
- **Basic Info**: Name, tagline, description, email
- **Social Links**: GitHub, LinkedIn, Twitter URLs
- **Live Preview**: See how changes will appear on the site

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx          # Login page
│   │   └── page.tsx                # Main admin dashboard
│   └── api/
│       ├── auth/                   # Authentication endpoints
│       └── admin/                  # Admin CRUD endpoints
├── components/
│   └── admin/                      # Admin-specific components
├── lib/
│   ├── auth.ts                     # Authentication utilities
│   └── database.ts                 # Data persistence layer
└── middleware.ts                   # Route protection
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/admin/projects` - List all projects
- `POST /api/admin/projects` - Create new project
- `GET /api/admin/projects/[id]` - Get project by ID
- `PUT /api/admin/projects/[id]` - Update project
- `DELETE /api/admin/projects/[id]` - Delete project

### Skills
- `GET /api/admin/skills` - Get all skills
- `PUT /api/admin/skills` - Update skills

### Site Config
- `GET /api/admin/site-config` - Get site configuration
- `PUT /api/admin/site-config` - Update site configuration

### File Upload
- `POST /api/admin/upload` - Upload media files (images/PDFs)

## Data Storage

The admin panel uses JSON file-based storage in the `data/` directory:
- `projects.json` - Project data
- `skills.json` - Skills configuration
- `site-config.json` - Site settings

Uploaded media is stored in `public/uploads/[project-slug]/[type]/`

## Security Features

- **Authentication Required**: All admin routes require valid authentication
- **Role-based Access**: Only admin users can access admin functions
- **Input Validation**: All inputs are validated using Zod schemas
- **File Upload Security**: File type validation and secure storage
- **CSRF Protection**: HttpOnly cookies prevent XSS attacks

## Usage Instructions

1. **Access Admin Panel**: Navigate to `/admin`
2. **Login**: Use the provided credentials
3. **Manage Content**: Use the tabbed interface to manage different content types
4. **Upload Media**: Use the media uploader for project images and PDFs
5. **Save Changes**: All changes are automatically saved to the database

## Media Management

### Images
- Upload multiple images per project
- Reorder using left/right arrow buttons
- Add captions in fixed-height, scrollable boxes
- Thumbnail navigation for easy browsing

### PDFs
- Upload PDF documents
- Add titles and descriptions
- Inline viewing with PDF.js
- Download functionality for users

## Public View Integration

The admin panel seamlessly integrates with the public portfolio:
- Project galleries show uploaded images with navigation
- PDFs display inline with download buttons
- All changes are immediately visible on the public site
- Data persists across page reloads

## Dependencies Added

- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation
- `multer` - File upload handling
- `@types/bcryptjs` - TypeScript types
- `@types/jsonwebtoken` - TypeScript types
- `@types/multer` - TypeScript types

## Environment Variables

Add these to your `.env.local` file:
```
JWT_SECRET=your-secret-key-change-in-production
```

## Default Data

The system initializes with default data if none exists:
- Default admin user (admin@asadul.dev / admin123)
- Sample skill categories
- Basic site configuration

## Troubleshooting

1. **Login Issues**: Ensure JWT_SECRET is set in environment variables
2. **Upload Failures**: Check that uploads directory has write permissions
3. **Data Not Persisting**: Verify data directory exists and is writable
4. **Authentication Errors**: Clear cookies and try logging in again

## Future Enhancements

- User management for multiple admins
- Content versioning and history
- Bulk operations for projects
- Advanced media management
- Content scheduling
- Analytics dashboard
