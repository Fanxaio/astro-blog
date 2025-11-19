# Astro Blog Project Context

## Project Overview

This is a modern personal blog system built with Astro, featuring server-side rendering, excellent performance, and SEO-friendly design. The blog is hosted at https://zishu.me and contains a large collection of articles covering web development, personal experiences, and technical tutorials.

### Key Technologies
- **Astro**: Modern web framework for content-driven websites
- **TypeScript**: For type-safe development
- **MDX**: For rich content creation
- **Sass**: For styling
- **LightGallery.js**: For image gallery functionality

### Project Structure
```
src/
├── components/     # Reusable UI components
├── content/        # Blog posts and pages content
│   ├── blog/       # Blog posts organized by date
│   └── page/       # Static pages (about, projects, etc.)
├── layouts/        # Page layout templates
├── pages/          # Page routes
├── styles/         # Global styles
├── consts.ts       # Global constants
└── content.config.ts # Content collection configuration
```

## Building and Running

### Development Commands
```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production site
npm run build

# Preview local build
npm run preview

# Copy LightGallery assets
npm run copy-lightgallery
```

### Key Scripts
- `dev`: Starts the development server at `localhost:4321`
- `build`: Builds the production site to `./dist/`
- `preview`: Previews the local build before deployment
- `copy-lightgallery`: Custom script to copy LightGallery.js assets to public directory

## Content Management

### Blog Posts
Blog posts are stored in `src/content/blog/` as Markdown files with frontmatter. The naming convention follows `YYYY-MM-DD-title.md`.

Frontmatter schema includes:
- `slug`: URL slug (optional)
- `title`: Post title
- `description`: SEO description (optional)
- `pubDate`: Publication date
- `updatedDate`: Last updated date (optional)
- `heroImage`: Featured image (optional)
- `categories`: Array of categories (optional)
- `tags`: Array of tags (optional)

### Static Pages
Static pages are stored in `src/content/page/` as Markdown files or JSON data files.

## Development Conventions

### Code Style
- Uses Prettier with custom configuration (`.prettierrc.json`)
- TypeScript with strict null checks
- 120 character line width
- Tabs for indentation (size 2)
- Single quotes for strings
- Semicolons required

### Component Structure
- Uses Astro components with `.astro` extension
- Components are organized in `src/components/`
- Layouts are organized in `src/layouts/`
- Base layout provides consistent page structure

### Content Collections
- Blog posts use the `blog` collection with MDX support
- Static pages use the `page` collection
- Content is type-checked using Zod schemas

### SEO and Performance
- Sitemap generation via `@astrojs/sitemap`
- RSS feed generation via `@astrojs/rss`
- HTML compression enabled
- Image optimization with Sharp
- Code syntax highlighting with Shiki

## Deployment
The site is configured for deployment with:
- Site URL: https://zishu.me
- Sitemap generation
- RSS feed generation
- HTML compression
- Image optimization

## Custom Features
- LightGallery.js integration for image galleries
- Custom copy script for LightGallery assets
- MDX support for rich content
- Category and tag organization
- Search functionality
- Comment system integration (Giscus/Twikoo)