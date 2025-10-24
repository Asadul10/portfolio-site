# Asadul Islam Arif - Portfolio Website

A modern, responsive portfolio website built with Next.js 14, TypeScript, and Tailwind CSS. Features a comprehensive project showcase, blog, and contact system with advanced security features.

## 🚀 Features

### Core Functionality
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: System-aware theme switching
- **MDX Content**: Rich content management with MDX
- **Project Showcase**: Categorized projects with filtering and search
- **Blog System**: Technical articles with tagging and pagination
- **Contact Form**: Secure form with validation and rate limiting
- **Gallery & PDF Viewer**: Interactive media components

### Security Features
- **HttpOnly Cookies**: Secure authentication tokens
- **Rate Limiting**: API endpoint protection
- **Honeypot Fields**: Bot protection
- **Input Validation**: Zod schema validation
- **CSRF Protection**: Cross-site request forgery prevention

### Performance
- **SSG/ISR**: Static generation with incremental updates
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Dynamic imports for heavy components
- **SEO Optimized**: Meta tags, sitemap, and structured data

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **shadcn/ui** for UI components
- **Lucide React** for icons

### Backend
- **Next.js API Routes** for backend functionality
- **Zod** for schema validation
- **React Hook Form** for form handling
- **Gray Matter** for MDX processing

### Content Management
- **MDX** for rich content
- **YAML Frontmatter** for metadata
- **File-based routing** for content

### Testing & CI
- **Playwright** for end-to-end testing
- **GitHub Actions** for CI/CD
- **TypeScript** for type checking
- **ESLint** for code quality

## 📁 Project Structure

```
portfolio-site-main/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/
│   │   ├── contact/
│   │   ├── projects/
│   │   ├── writing/
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   └── sections/         # Page sections
│   ├── lib/                  # Utility functions
│   └── types/                # TypeScript types
├── content/                  # MDX content
│   ├── projects/            # Project MDX files
│   └── posts/               # Blog post MDX files
├── public/                  # Static assets
│   └── projects/           # Project images and PDFs
├── tests/                  # Playwright tests
└── scripts/               # Build and utility scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/asadul/portfolio-site.git
   cd portfolio-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the environment variables as needed.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run format       # Format code with Prettier

# Testing
npm run test         # Run Playwright tests
npm run test:ui      # Run tests with UI

# Content
npm run content:validate  # Validate MDX content
```

## 📝 Content Management

### Adding Projects

1. **Create a new MDX file** in `content/projects/`
2. **Add frontmatter** with required fields:

```yaml
---
title: "Project Title"
slug: "project-slug"
category: "Web Apps"  # Web Apps | Cybersecurity Labs | Networking | Data/ML | Other
year: 2024
tags: ["React", "TypeScript", "Security"]
summary: "Brief project description"
cover: "/projects/project-name/cover.jpg"
images:
  - src: "/projects/project-name/image1.png"
    caption: "Image description"
pdfs:
  - src: "/projects/project-name/report.pdf"
    title: "Project Report"
    description: "Detailed report"
links:
  demo: "https://example.com/demo"
  repo: "https://github.com/username/repo"
featured: true
---
```

3. **Add project assets** to `public/projects/project-name/`
4. **Write project content** in MDX format

### Adding Blog Posts

1. **Create a new MDX file** in `content/posts/`
2. **Add frontmatter**:

```yaml
---
title: "Post Title"
slug: "post-slug"
date: "2024-01-15"
tags: ["Security", "Web Development"]
summary: "Brief post description"
featured: false
---
```

3. **Write post content** in MDX format

### Content Validation

Run content validation to check for errors:

```bash
npm run content:validate
```

This will validate:
- Required frontmatter fields
- File existence for images and PDFs
- Data format validation
- Category and tag validation

## 🎨 Customization

### Theme Configuration

The site supports three color palettes defined in `src/lib/theme.ts`:

1. **Slate/Indigo** (default)
2. **Zinc/Emerald**
3. **Neutral/Violet**

To change the palette, update the `palette` value in `src/lib/config.ts`.

### Site Configuration

Update site information in `src/lib/config.ts`:

```typescript
export const siteConfig = {
  name: 'Your Name',
  tagline: 'Your Tagline',
  description: 'Your description',
  url: 'https://yourdomain.com',
  // ... other configuration
};
```

### Adding New Pages

1. **Create a new page** in `src/app/page-name/page.tsx`
2. **Add navigation** in `src/components/site-shell.tsx`
3. **Update metadata** as needed

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run specific test file
npx playwright test tests/homepage.spec.ts
```

### Test Coverage

The test suite covers:
- **Homepage functionality** and navigation
- **Project filtering** and search
- **Contact form** validation
- **Theme switching**
- **Responsive design**

## 🚀 Deployment

### Vercel Deployment

1. **Connect your repository** to Vercel
2. **Set framework** to Next.js
3. **Deploy** automatically on push to main branch

### Cloudflare Pages Deployment

1. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Deploy**:
   ```bash
   npm run build
   wrangler pages deploy .next
   ```

### Environment Variables

Set these environment variables in your deployment platform:

```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 🔧 Configuration Files

### Tailwind CSS
- **Config**: `tailwind.config.ts`
- **Styles**: `src/app/globals.css`

### TypeScript
- **Config**: `tsconfig.json`
- **Types**: `src/types/index.ts`

### Next.js
- **Config**: `next.config.js`
- **MDX**: Configured for content processing

### Playwright
- **Config**: `playwright.config.ts`
- **Tests**: `tests/` directory

## 📊 Performance

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Optimization Features
- **Image optimization** with Next.js Image
- **Code splitting** and lazy loading
- **Static generation** for content pages
- **CDN integration** for assets

## 🔒 Security

### Implemented Security Measures
- **HttpOnly cookies** for authentication
- **Rate limiting** on API endpoints
- **Input validation** with Zod schemas
- **CSRF protection** with tokens
- **Honeypot fields** for bot protection
- **Content Security Policy** headers

### Security Headers
- **X-Frame-Options**: DENY
- **X-Content-Type-Options**: nosniff
- **Referrer-Policy**: origin-when-cross-origin

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- **Follow TypeScript** best practices
- **Use Prettier** for code formatting
- **Write tests** for new features
- **Update documentation** as needed
- **Follow conventional commits**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **shadcn/ui** for the beautiful UI components
- **Vercel** for the deployment platform
- **Cloudflare** for the CDN and security features

## 📞 Contact

- **Email**: asadul@example.com
- **GitHub**: [@asadul](https://github.com/asadul)
- **LinkedIn**: [Asadul Islam Arif](https://linkedin.com/in/asadul)

---

**First-Run Checklist:**

1. ✅ Rename site in `src/lib/config.ts`
2. ✅ Set your palette preference
3. ✅ Replace logo and favicon
4. ✅ Add your CV to public folder
5. ✅ Update social links
6. ✅ Add your projects and blog posts
7. ✅ Configure domain and deployment
8. ✅ Set up analytics (optional)
9. ✅ Test all functionality
10. ✅ Deploy and go live!

**Happy coding! 🚀**
