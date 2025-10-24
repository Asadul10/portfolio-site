import { siteConfig } from '@/lib/config';

export type ProjectCategory = typeof siteConfig.projectCategories[number];

export interface ProjectImage {
  src: string;
  caption?: string;
}

export interface ProjectPDF {
  src: string;
  title: string;
  description?: string;
}

export interface ProjectLinks {
  demo?: string;
  repo?: string;
  docs?: string;
}

export interface Project {
  title: string;
  slug: string;
  category: ProjectCategory;
  year: number;
  tags: string[];
  summary: string;
  cover: string;
  images?: ProjectImage[];
  pdfs?: ProjectPDF[];
  links?: ProjectLinks;
  featured?: boolean;
  content?: string;
  notes?: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  summary: string;
  content?: string;
  featured?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
}

export interface SearchResult {
  type: 'project' | 'post';
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  category?: ProjectCategory;
  date?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface TimelineItem {
  year: string;
  title: string;
  company: string;
  description: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface PDFDocument {
  src: string;
  title: string;
  description?: string;
  pages?: number;
}
