# MDX-Based Admin System

## Overview

The MDX admin system provides an alternative way to manage your portfolio content using MDX files instead of JSON. This approach integrates seamlessly with your existing content structure and provides better version control and content management.

## Features

### MDX File Management
- **Projects**: Manage projects as MDX files in `content/projects/`
- **Skills**: Manage skills configuration in `content/admin/skills.mdx`
- **Site Config**: Manage site settings in `content/admin/site-config.mdx`

### Benefits of MDX Approach
- **Version Control**: All content is stored in MDX files that can be version controlled
- **Content Preview**: See exactly how your MDX files will look
- **Markdown Support**: Full Markdown support for project content
- **Integration**: Works with your existing MDX-based content system
- **Backup**: Easy to backup and restore content files

## Access

Navigate to `/admin/mdx` to access the MDX-based admin interface.

## File Structure

```
content/
├── projects/              # Project MDX files
│   ├── project-1.mdx
│   └── project-2.mdx
└── admin/                 # Admin configuration files
    ├── skills.mdx         # Skills configuration
    └── site-config.mdx    # Site settings
```

## MDX File Format

### Project Files (`content/projects/*.mdx`)
```mdx
---
title: "Project Title"
category: "Web Apps"
year: 2024
tags: ["React", "TypeScript", "Next.js"]
summary: "Brief project description"
cover: "/images/project-cover.jpg"
featured: true
images:
  - src: "/images/screenshot1.jpg"
    caption: "Main dashboard view"
pdfs:
  - src: "/docs/project-report.pdf"
    title: "Project Report"
    description: "Detailed project documentation"
links:
  demo: "https://demo.example.com"
  repo: "https://github.com/user/project"
  docs: "https://docs.example.com"
---

# Project Overview

Your project content in Markdown format...

## Features

- Feature 1
- Feature 2

## Notes & Learnings

Key insights and lessons learned...
```

### Skills Configuration (`content/admin/skills.mdx`)
```mdx
---
title: "Skills Configuration"
type: "skills"
---

# Skills Configuration

## Cybersecurity
- Penetration Testing
- Vulnerability Assessment
- Security Architecture

## Frontend
- React
- Next.js
- TypeScript
```

### Site Configuration (`content/admin/site-config.mdx`)
```mdx
---
title: "Site Configuration"
type: "site-config"
---

# Site Configuration

## Basic Information
- **Name**: Your Name
- **Tagline**: Your Professional Tagline
- **Description**: Your description
- **Email**: your.email@example.com

## Social Links
- **GitHub**: https://github.com/yourusername
- **LinkedIn**: https://linkedin.com/in/yourusername
- **Twitter**: https://twitter.com/yourusername
```

## Usage

1. **Access MDX Admin**: Go to `/admin/mdx`
2. **Edit Content**: Use the visual editor or preview MDX directly
3. **Save Changes**: Changes are written to MDX files
4. **Version Control**: Commit changes to your repository

## Advantages Over JSON Admin

- **Content Rich**: Full Markdown support for project descriptions
- **Version Control**: All changes tracked in Git
- **Portable**: Easy to migrate or backup content
- **Familiar**: Uses the same MDX format as your existing content
- **Preview**: See exactly how content will render

## Migration from JSON

If you have existing JSON data, the MDX admin system can work alongside it. Both systems use the same API endpoints and can coexist.

## File Management

- **Automatic Creation**: MDX files are created automatically when you add new content
- **Validation**: Content is validated before saving
- **Backup**: Always backup your content directory before making changes
- **Recovery**: Deleted files can be recovered from version control

## Troubleshooting

1. **File Permissions**: Ensure the content directory is writable
2. **MDX Syntax**: Check for proper YAML frontmatter formatting
3. **Image Paths**: Use absolute paths for images starting with `/`
4. **Special Characters**: Escape special characters in YAML frontmatter

## Integration with Build Process

The MDX admin system integrates with your existing Next.js build process:
- Content is read during build time
- Changes are reflected immediately in development
- Production builds include all MDX content
- Static generation works with MDX files

This approach provides a more content-focused way to manage your portfolio while maintaining all the functionality of the JSON-based admin system.
