import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Project, BlogPost, SkillCategory } from '@/types';

// Content directories
const CONTENT_DIR = path.join(process.cwd(), 'content');
const PROJECTS_DIR = path.join(CONTENT_DIR, 'projects');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');
const ADMIN_DIR = path.join(CONTENT_DIR, 'admin');

// Ensure admin directory exists
if (!fs.existsSync(ADMIN_DIR)) {
  fs.mkdirSync(ADMIN_DIR, { recursive: true });
}

// Admin data files
const SKILLS_FILE = path.join(ADMIN_DIR, 'skills.mdx');
const SITE_CONFIG_FILE = path.join(ADMIN_DIR, 'site-config.mdx');

// Initialize default admin data if files don't exist
function initializeAdminData() {
  if (!fs.existsSync(SKILLS_FILE)) {
    const defaultSkills = `---
title: "Skills Configuration"
type: "skills"
---

# Skills Configuration

## Cybersecurity
- Penetration Testing
- Vulnerability Assessment
- Security Architecture
- Incident Response
- Threat Modeling

## Frontend
- React
- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion

## Backend
- Node.js
- Python
- PostgreSQL
- MongoDB
- Redis

## DevOps
- Docker
- Kubernetes
- AWS
- CI/CD
- Terraform

## Networking
- Cisco
- Firewall Configuration
- Network Security
- VPN
- Load Balancing

## Data/ML
- Python
- TensorFlow
- Pandas
- NumPy
- Jupyter
`;

    fs.writeFileSync(SKILLS_FILE, defaultSkills);
  }

  if (!fs.existsSync(SITE_CONFIG_FILE)) {
    const defaultConfig = `---
title: "Site Configuration"
type: "site-config"
---

# Site Configuration

## Basic Information
- **Name**: Asadul Islam Arif
- **Tagline**: Cybersecurity & Full-Stack Engineer
- **Description**: Portfolio showcasing cybersecurity projects, full-stack development, and technical expertise.
- **Email**: asadul@example.com

## Social Links
- **GitHub**: https://github.com/asadul
- **LinkedIn**: https://linkedin.com/in/asadul
- **Twitter**: https://twitter.com/asadul
`;

    fs.writeFileSync(SITE_CONFIG_FILE, defaultConfig);
  }
}

// Initialize data on module load
initializeAdminData();

// Projects CRUD using MDX
export function getAllProjects(): Project[] {
  const fileNames = fs.readdirSync(PROJECTS_DIR);
  const allProjectsData = fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => {
      const fullPath = path.join(PROJECTS_DIR, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return {
        ...data,
        slug: name.replace(/\.mdx$/, ''),
      } as Project;
    });

  return allProjectsData.sort((a, b) => b.year - a.year);
}

export function getProjectById(id: string): Project | null {
  try {
    const fullPath = path.join(PROJECTS_DIR, `${id}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      ...data,
      slug: id,
      content,
    } as Project;
  } catch (error) {
    return null;
  }
}

export function createProject(project: Omit<Project, 'slug'>): Project {
  const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const mdxContent = `---
title: "${project.title}"
category: "${project.category}"
year: ${project.year}
tags: [${project.tags.map(tag => `"${tag}"`).join(', ')}]
summary: "${project.summary}"
cover: "${project.cover}"
featured: ${project.featured || false}
${project.images ? `images:
${project.images.map(img => `  - src: "${img.src}"${img.caption ? `\n    caption: "${img.caption}"` : ''}`).join('\n')}` : ''}
${project.pdfs ? `pdfs:
${project.pdfs.map(pdf => `  - src: "${pdf.src}"\n    title: "${pdf.title}"${pdf.description ? `\n    description: "${pdf.description}"` : ''}`).join('\n')}` : ''}
${project.links ? `links:
  ${project.links.demo ? `demo: "${project.links.demo}"` : ''}
  ${project.links.repo ? `repo: "${project.links.repo}"` : ''}
  ${project.links.docs ? `docs: "${project.links.docs}"` : ''}` : ''}
---

${project.content || ''}

${project.notes ? `## Notes & Learnings

${project.notes}` : ''}
`;

  const fullPath = path.join(PROJECTS_DIR, `${slug}.mdx`);
  fs.writeFileSync(fullPath, mdxContent);

  return {
    ...project,
    slug,
  };
}

export function updateProject(id: string, updates: Partial<Project>): Project | null {
  const project = getProjectById(id);
  if (!project) return null;

  const updatedProject = { ...project, ...updates };
  const mdxContent = `---
title: "${updatedProject.title}"
category: "${updatedProject.category}"
year: ${updatedProject.year}
tags: [${updatedProject.tags.map(tag => `"${tag}"`).join(', ')}]
summary: "${updatedProject.summary}"
cover: "${updatedProject.cover}"
featured: ${updatedProject.featured || false}
${updatedProject.images ? `images:
${updatedProject.images.map(img => `  - src: "${img.src}"${img.caption ? `\n    caption: "${img.caption}"` : ''}`).join('\n')}` : ''}
${updatedProject.pdfs ? `pdfs:
${updatedProject.pdfs.map(pdf => `  - src: "${pdf.src}"\n    title: "${pdf.title}"${pdf.description ? `\n    description: "${pdf.description}"` : ''}`).join('\n')}` : ''}
${updatedProject.links ? `links:
  ${updatedProject.links.demo ? `demo: "${updatedProject.links.demo}"` : ''}
  ${updatedProject.links.repo ? `repo: "${updatedProject.links.repo}"` : ''}
  ${updatedProject.links.docs ? `docs: "${updatedProject.links.docs}"` : ''}` : ''}
---

${updatedProject.content || ''}

${updatedProject.notes ? `## Notes & Learnings

${updatedProject.notes}` : ''}
`;

  const fullPath = path.join(PROJECTS_DIR, `${id}.mdx`);
  fs.writeFileSync(fullPath, mdxContent);

  return updatedProject;
}

export function deleteProject(id: string): boolean {
  try {
    const fullPath = path.join(PROJECTS_DIR, `${id}.mdx`);
    fs.unlinkSync(fullPath);
    return true;
  } catch (error) {
    return false;
  }
}

// Skills CRUD using MDX
export function getAllSkills(): SkillCategory[] {
  try {
    const fileContents = fs.readFileSync(SKILLS_FILE, 'utf8');
    const { content } = matter(fileContents);
    
    const skills: SkillCategory[] = [];
    const lines = content.split('\n');
    let currentCategory: SkillCategory | null = null;

    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentCategory) {
          skills.push(currentCategory);
        }
        currentCategory = {
          name: line.replace('## ', '').trim(),
          skills: []
        };
      } else if (line.startsWith('- ') && currentCategory) {
        currentCategory.skills.push(line.replace('- ', '').trim());
      }
    }

    if (currentCategory) {
      skills.push(currentCategory);
    }

    return skills;
  } catch (error) {
    console.error('Error reading skills:', error);
    return [];
  }
}

export function updateSkills(skills: SkillCategory[]): void {
  const content = skills.map(category => 
    `## ${category.name}\n${category.skills.map(skill => `- ${skill}`).join('\n')}`
  ).join('\n\n');

  const mdxContent = `---
title: "Skills Configuration"
type: "skills"
---

# Skills Configuration

${content}
`;

  fs.writeFileSync(SKILLS_FILE, mdxContent);
}

// Site Config CRUD using MDX
export function getSiteConfig(): any {
  try {
    const fileContents = fs.readFileSync(SITE_CONFIG_FILE, 'utf8');
    const { content } = matter(fileContents);
    
    const config: any = {};
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.includes('**Name**:')) {
        config.name = line.split('**Name**:')[1].trim();
      } else if (line.includes('**Tagline**:')) {
        config.tagline = line.split('**Tagline**:')[1].trim();
      } else if (line.includes('**Description**:')) {
        config.description = line.split('**Description**:')[1].trim();
      } else if (line.includes('**Email**:')) {
        config.email = line.split('**Email**:')[1].trim();
      } else if (line.includes('**GitHub**:')) {
        config.github = line.split('**GitHub**:')[1].trim();
      } else if (line.includes('**LinkedIn**:')) {
        config.linkedin = line.split('**LinkedIn**:')[1].trim();
      } else if (line.includes('**Twitter**:')) {
        config.twitter = line.split('**Twitter**:')[1].trim();
      }
    }

    return config;
  } catch (error) {
    console.error('Error reading site config:', error);
    return {};
  }
}

export function updateSiteConfig(config: any): void {
  const content = `## Basic Information
- **Name**: ${config.name}
- **Tagline**: ${config.tagline}
- **Description**: ${config.description}
- **Email**: ${config.email}

## Social Links
- **GitHub**: ${config.github}
- **LinkedIn**: ${config.linkedin}
- **Twitter**: ${config.twitter}
`;

  const mdxContent = `---
title: "Site Configuration"
type: "site-config"
---

# Site Configuration

${content}
`;

  fs.writeFileSync(SITE_CONFIG_FILE, mdxContent);
}

// Media management
export function saveProjectMedia(projectSlug: string, mediaType: 'images' | 'pdfs', mediaData: any[]): void {
  const project = getProjectById(projectSlug);
  if (project) {
    project[mediaType] = mediaData;
    updateProject(projectSlug, project);
  }
}

export function deleteProjectMedia(projectSlug: string, mediaType: 'images' | 'pdfs', mediaIndex: number): void {
  const project = getProjectById(projectSlug);
  if (project && project[mediaType]) {
    project[mediaType]!.splice(mediaIndex, 1);
    updateProject(projectSlug, project);
  }
}

export function reorderProjectMedia(projectSlug: string, mediaType: 'images' | 'pdfs', fromIndex: number, toIndex: number): void {
  const project = getProjectById(projectSlug);
  if (project && project[mediaType]) {
    const media = project[mediaType]!;
    const [movedItem] = media.splice(fromIndex, 1);
    media.splice(toIndex, 0, movedItem);
    updateProject(projectSlug, project);
  }
}
