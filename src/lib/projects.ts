import { getAllProjects as getDbProjects } from './database';
import { Project, ProjectCategory } from '@/types';

export function getAllProjects(): Project[] {
  return getDbProjects();
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
  const { getProjectById } = require('./database');
  return getProjectById(slug);
}

export function getProjectSlugs(): string[] {
  const allProjects = getAllProjects();
  return allProjects.map(project => project.slug);
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
