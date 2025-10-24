import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Project, ProjectCategory } from '@/types';

const projectsDirectory = path.join(process.cwd(), 'content/projects');

export function getAllProjects(): Project[] {
  const fileNames = fs.readdirSync(projectsDirectory);
  const allProjectsData = fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => {
      const fullPath = path.join(projectsDirectory, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return {
        ...data,
        slug: name.replace(/\.mdx$/, ''),
      } as Project;
    });

  return allProjectsData.sort((a, b) => b.year - a.year);
}

export function getFeaturedProjects(): Project[] {
  const allProjects = getAllProjects();
  return allProjects.filter((project) => project.featured).slice(0, 6);
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  const allProjects = getAllProjects();
  return allProjects.filter((project) => project.category === category);
}

export function getProjectBySlug(slug: string): Project | null {
  try {
    const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      ...data,
      slug,
      content,
    } as Project;
  } catch (error) {
    return null;
  }
}

export function getProjectSlugs(): string[] {
  const fileNames = fs.readdirSync(projectsDirectory);
  return fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => name.replace(/\.mdx$/, ''));
}

export function searchProjects(query: string): Project[] {
  const allProjects = getAllProjects();
  const lowercaseQuery = query.toLowerCase();
  
  return allProjects.filter((project) =>
    project.title.toLowerCase().includes(lowercaseQuery) ||
    project.summary.toLowerCase().includes(lowercaseQuery) ||
    project.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function getUniqueTags(): string[] {
  const allProjects = getAllProjects();
  const tags = allProjects.flatMap((project) => project.tags);
  return Array.from(new Set(tags)).sort();
}

export function getProjectsByYearRange(startYear: number, endYear: number): Project[] {
  const allProjects = getAllProjects();
  return allProjects.filter(
    (project) => project.year >= startYear && project.year <= endYear
  );
}
